<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ConferenceUser;
use Illuminate\Http\Request;

class ConferenceUserController extends Controller
{


    public function decideRole(Request $request)
    {
        $request->validate([
            'conference_user_id' => 'required|exists:conference_user,id',
            'action' => 'required|in:accept,reject',
        ]);

        $conferenceUser = ConferenceUser::findOrFail($request->conference_user_id);

        $conferenceUser->role_status = $request->action === 'accept' ? 'approved' : 'rejected';
        $conferenceUser->save();

        return response()->json(['message' => 'Rôle mis à jour.']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
