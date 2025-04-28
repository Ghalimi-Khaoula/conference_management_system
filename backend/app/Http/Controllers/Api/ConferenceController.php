<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreConferenceRequest;
use App\Models\Conference;
use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ConferenceController extends Controller
{
    /**
     * Store a newly created conference.
     */
    public function store(StoreConferenceRequest $request)
    {
        $data = $request->validated();

        // Generate slug manually
        $slug = \Illuminate\Support\Str::uuid();


        /** @var User $user */
        $user = Auth::user();
        $status = 'pending';
        if ($user->hasRole('admin') || $user->can('create conferences without approval')) {
            $status = 'accepted'; // Admins or users with permission create directly accepted conferences
        }

        $conference = Conference::create([
            ...$data,
            'slug' => $slug, // ADD THIS LINE
            'status' => $status, // force status to pending
        ]);

        // Attach the creator
        $conference->participants()->attach(Auth::id(), [
            'role' => 'creator',
            'role_status' => 'approved',
        ]);

        return response()->json([
            'message' => 'Conférence créée avec succès.',
            'conference' => $conference
        ], 201);
    }


    /**
     * Display the specified conference.
     */
    public function show($id)
    {
        try {
            $conference = Conference::findOrFail($id);

            return response()->json($conference);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Conférence non trouvée.'
            ], 404);
        }
    }

    public function userConferences(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();

        $limit = $request->query('limit', 10);
        $role = $request->query('role');
        $sortBy = $request->query('sort_by', 'created_at');
        $sortDirection = $request->query('sort_direction', 'desc');

        if ($user->hasRole('admin')) {
            // 🔥 Admin gets all conferences + creator info
            $query = Conference::with([
                'participants' => function ($q) {
                    $q->wherePivot('role', 'creator'); // only the creator
                }
            ])->orderBy($sortBy, $sortDirection);
        } else {
            // 🔥 Normal user: conferences he participates in
            $query = $user->conferences()
                ->withPivot('role', 'role_status')
                ->orderBy($sortBy, $sortDirection);

            if ($role) {
                $query->wherePivot('role', $role);
            }
        }

        $conferences = $query->paginate($limit);

        // 🛠 Format the result manually
        $formattedConferences = $conferences->through(function ($conference) use ($user) {
            $creator = $conference->participants->first(); // there will be only one (we filtered role=creator)

            return [
                'id' => $conference->id,
                'slug' => $conference->slug,
                'title' => $conference->title,
                'visibility' => $conference->visibility,
                'status' => $conference->status,
                'creator_email' => $creator ? $creator->email : null,
                'creator_role_status' => $creator ? $creator->pivot->role_status : null,
                'pivot' => $conference->pivot ?? null, // only for normal user
            ];
        });

        return response()->json($formattedConferences);
    }



    public function showBySlug($slug)
    {
        try {
            $conference = Conference::with([
                'participants' => function ($q) {
                    $q->select('users.id', 'users.email')
                      ->withPivot('id', 'role', 'role_status'); // 🛠 add pivot.id here too!
                }
            ])->where('slug', $slug)->firstOrFail();
    
            /** @var User $user */
            $user = Auth::user();
    
            if ($conference->visibility === 'private') {
                if (!$user) {
                    return response()->json([
                        'message' => 'Utilisateur non authentifié.',
                    ], Response::HTTP_UNAUTHORIZED);
                }
    
                $isParticipant = $conference->participants()
                    ->where('user_id', $user->id)
                    ->exists();
    
                if (!$isParticipant) {
                    return response()->json([
                        'message' => 'Cette conférence est privée. Vous devez être invité pour y accéder.',
                    ], Response::HTTP_FORBIDDEN);
                }
            }
    
            // Prepare participant info
            $creator = $conference->participants->firstWhere('pivot.role', 'creator');
    
            $participantsTable = $conference->participants->map(function ($participant) {
                return [
                    'email' => $participant->email,
                    'role' => $participant->pivot->role,
                    'role_status' => $participant->pivot->role_status,
                    'conference_user_id' => $participant->pivot->id,
                ];
            });
    
            // 🛠 Find logged-in user's pivot
            $userPivot = null;
            if ($user) {
                $participant = $conference->participants->firstWhere('id', $user->id);
                if ($participant) {
                    $userPivot = $participant->pivot;
                }
            }
    
            return response()->json([
                'id' => $conference->id,
                'title' => $conference->title,
                'slug' => $conference->slug,
                'visibility' => $conference->visibility,
                'status' => $conference->status,
                'start_date' => $conference->start_date,
                'end_date' => $conference->end_date,
                'country' => $conference->country,
                'city' => $conference->city,
                'installation_type' => $conference->installation_type,
                'web_page' => $conference->web_page,
                'venue' => $conference->venue,
                'organizer_name' => $conference->organizer_name,
                'organizer_web_page' => $conference->organizer_web_page,
                'contact_phone' => $conference->contact_phone,
                'estimated_submissions' => $conference->estimated_submissions,
                'primary_area' => $conference->primary_area,
                'secondary_area' => $conference->secondary_area,
                'area_notes' => $conference->area_notes,
                'additional_info' => $conference->additional_info,
    
                // New additions
                'creator_email' => $creator ? $creator->email : null,
                'participants' => $participantsTable,
    
                // Return pivot with conference_user_id
                'pivot' => $userPivot ? [
                    'conference_user_id' => $userPivot->id, // 🌟 HERE
                    'role' => $userPivot->role,
                    'role_status' => $userPivot->role_status,
                    
                ] : null,
            ]);
    
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Conférence non trouvée.',
            ], Response::HTTP_NOT_FOUND);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Une erreur est survenue.',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    

    public function acceptOrRejectConference(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();

        $action = $request->input('action'); // "accept" or "reject"
        $slug = $request->input('slug'); // "slug"

        if (!in_array($action, ['accept', 'reject'])) {
            return response()->json([
                'message' => 'Action invalide. Utilisez "accept" ou "reject".',
            ], 422);
        }

        if (!$slug) {
            return response()->json([
                'message' => 'Slug requis.',
            ], 422);
        }

        if (!$user->hasRole('admin') && !$user->can('manage conferences')) {
            return response()->json([
                'message' => 'Non autorisé.',
            ], 403);
        }

        try {
            $conference = Conference::where('slug', $slug)->firstOrFail();

            $conference->status = $action === 'accept' ? 'accepted' : 'rejected';
            $conference->save();

            return response()->json([
                'message' => "Conférence {$action}ée avec succès.",
                'conference' => $conference,
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Conférence non trouvée.',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Une erreur est survenue.',
            ], 500);
        }
    }

    /**
     * Become a reviewer for a conference.
     */
    public function becomeReviewer($slug)
    {
        try {
            $conference = Conference::where('slug', $slug)->firstOrFail();
            $user = Auth::user();

            $conference->participants()->syncWithoutDetaching([
                $user->id => [
                    'role' => 'reviewer',
                    'role_status' => 'pending', // Always pending
                ],
            ]);

            return response()->json([
                'message' => 'Votre demande pour devenir reviewer est en attente d\'approbation.',
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Conférence non trouvée.',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Une erreur est survenue.',
            ], 500);
        }
    }

    /**
     * Become a participant for a conference.
     */
    public function becomeParticipant($slug)
    {
        try {
            $conference = Conference::where('slug', $slug)->firstOrFail();
            $user = Auth::user();

            $roleStatus = $conference->visibility === 'public' ? 'approved' : 'pending';

            $conference->participants()->syncWithoutDetaching([
                $user->id => [
                    'role' => 'participant',
                    'role_status' => $roleStatus,
                ],
            ]);

            return response()->json([
                'message' => $roleStatus === 'approved'
                    ? 'Vous êtes maintenant un participant à cette conférence.'
                    : 'Votre demande de participation est en attente d\'approbation.',
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Conférence non trouvée.',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Une erreur est survenue.',
            ], 500);
        }
    }



}
