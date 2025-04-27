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

        $conference = Conference::create([
            ...$data,
            'slug' => $slug, // ADD THIS LINE
            'status' => 'pending', // force status to pending
        ]);

        // Attach the creator
        $conference->participants()->attach(Auth::id(), [
            'role' => 'creator',
            'role_status' => 'pending',
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

        $limit = $request->query('limit', 10); // default 10 conferences per page
        $role = $request->query('role'); // optional role filter
        $sortBy = $request->query('sort_by', 'created_at'); // default sorting by creation date
        $sortDirection = $request->query('sort_direction', 'desc'); // default descending order

        $query = $user->conferences()
            ->withPivot('role', 'role_status')
            ->orderBy($sortBy, $sortDirection);

        if ($role) {
            $query->wherePivot('role', $role);
        }

        // Instead of skip/take ➔ use paginate
        $conferences = $query->paginate($limit);

        return response()->json($conferences);
    }

    public function showBySlug($slug)
    {
        try {
            $conference = Conference::where('slug', $slug)->firstOrFail();

            if ($conference->visibility === 'public') {
                return response()->json($conference);
            }

            // If conference is private, check if user is a participant
            $user = Auth::user();

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

            return response()->json($conference);

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
}
