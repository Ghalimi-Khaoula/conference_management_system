<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreConferenceRequest;
use App\Models\Conference;
use Illuminate\Support\Facades\Auth;

class ConferenceController extends Controller
{
    /**
     * Store a newly created conference.
     */
    public function store(StoreConferenceRequest $request)
    {

        $data = $request->validated();

        $conference = Conference::create([
            ...$data,
            'status' => 'pending', // force status as we agreed
        ]);

        // Attach the creator to the conference_user table
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
}
