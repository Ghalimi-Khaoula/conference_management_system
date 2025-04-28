<?php

namespace App\Http\Requests;

use App\Models\Submission;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class SubmissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Adjust if you have authorization logic
    }

    public function rules(): array
    {
        return [
            'conference_user_id' => 'required|exists:conference_user,id',
            'title' => 'required|string|max:255',
            'abstract' => 'required|string',
            'keywords' => 'required|array', // 👈 expect array
            'keywords.*' => 'required|string|max:255', // 👈 each keyword must be a string
            'authors' => 'required|array', // 👈 expect array
            'authors.*' => 'required|string|max:255', // 👈 each author must be a string
            'file' => 'required|file|mimes:pdf,doc,docx', // adjust accepted file types
        ];
    }
    /**
     * Get the user's submission for a specific conference.
     */
    public function getUserSubmission(Request $request)
    {
        $conferenceUserId = $request->query('conference_user_id');

        $submission = Submission::where('conference_user_id', $conferenceUserId)
            ->whereHas('conferenceUser', function ($query) {
                $query->where('user_id', Auth::id());
            })
            ->first();

        if (!$submission) {
            return response()->json(null); // No submission yet
        }

        return response()->json([
            'id' => $submission->id,
            'title' => $submission->title,
            'abstract' => $submission->abstract,
            'keywords' => explode("\n", $submission->keywords),
            'authors' => explode("\n", $submission->authors),
            'file_name' => $submission->file_name,
            'status' => $submission->status,
        ]);
    }

}
