<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SubmissionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ConferenceController;
use Illuminate\Support\Facades\Log;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/add-conference', [ConferenceController::class, 'store']);
    Route::get('/my-conferences', [ConferenceController::class, 'userConferences']);
    Route::post('/submission', [SubmissionController::class, 'store']);
});



Route::get('/conference/{slug}', [ConferenceController::class, 'showBySlug']);