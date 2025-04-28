<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ConferenceUserController;
use App\Http\Controllers\Api\SubmissionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ConferenceController;
use Illuminate\Support\Facades\Log;

// Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    $user = $request->user();

    return response()->json([
        'id' => $user->id,
        'first_name' => $user->first_name,
        'last_name' => $user->last_name,
        'email' => $user->email,
        'phone' => $user->phone,
        'affiliation' => $user->affiliation,
        'country' => $user->country,
        'email_verified_at' => $user->email_verified_at,
        'created_at' => $user->created_at,
        'updated_at' => $user->updated_at,
        'roles' => $user->getRoleNames(), // <<< ADD THIS
        'permissions' => $user->getAllPermissions()->pluck('name'), // <<< ADD THIS
    ]);
});


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/add-conference', [ConferenceController::class, 'store']);
    Route::get('/my-conferences', [ConferenceController::class, 'userConferences']);
    Route::post('/submission', [SubmissionController::class, 'store']);
    Route::get('/submission/user', [SubmissionController::class, 'getUserSubmission']);
    Route::get('/submission/{conferenceUserId}', [SubmissionController::class, 'show']);

    Route::post('/conference/role-decision', [ConferenceUserController::class, 'decideRole']);
    Route::post('/submission/decision', [SubmissionController::class, 'decideSubmission']);
    Route::get('/conference/{slug}/submissions', [SubmissionController::class, 'submissionsByConference']);




    

    Route::post('/conference/{slug}/become-reviewer', [ConferenceController::class, 'becomeReviewer']);
    Route::post('/conference/{slug}/become-participant', [ConferenceController::class, 'becomeParticipant']);
});
Route::middleware(['auth:sanctum'])->post('/conference/decision', [ConferenceController::class, 'acceptOrRejectConference']);
Route::get('/submission/{id}/download', [SubmissionController::class, 'download']);


Route::get('/conference/{slug}', [ConferenceController::class, 'showBySlug']);