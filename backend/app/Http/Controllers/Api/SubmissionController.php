<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SubmissionRequest;
use App\Models\Conference;
use App\Models\Submission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class SubmissionController extends Controller
{
    public function store(SubmissionRequest $request)
    {
        // Handle file upload
        $file = $request->file('file');
        $originalFileName = $file->getClientOriginalName(); // e.g. "paper.pdf"
        $hashedFilePath = $file->store('submissions'); // e.g. "submissions/abc123xyz.pdf"

        $submission = new Submission();
        $submission->conference_user_id = $request->conference_user_id;
        $submission->title = $request->title;
        $submission->abstract = $request->abstract;

        // 🌟 implode keywords and authors into TEXT using \n
        $submission->keywords = implode("\n", $request->keywords);
        $submission->authors = implode("\n", $request->authors);

        $submission->file_name = $originalFileName;
        $submission->file_path = $hashedFilePath;

        $submission->status = 'pending'; // default status

        $submission->save();

        return response()->json(['message' => 'Submission created successfully.'], 201);
    }

    public function show($conferenceUserId)
    {
        try {
            $submission = Submission::where('conference_user_id', $conferenceUserId)->first();

            if (!$submission) {
                return response()->json([
                    'message' => 'Soumission non trouvée pour cet utilisateur.',
                ], 404);
            }

            return response()->json([
                'id' => $submission->id,
                'conference_user_id' => $submission->conference_user_id,
                'title' => $submission->title,
                'abstract' => $submission->abstract,
                'keywords' => explode("\n", $submission->keywords), // explode back into array if needed
                'authors' => explode("\n", $submission->authors),
                'status' => $submission->status,
                'file_name' => $submission->file_name,
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération de la soumission: ' . $e->getMessage());
            return response()->json([
                'message' => 'Une erreur est survenue.',
            ], 500);
        }
    }
    public function decideSubmission(Request $request)
    {
        $request->validate([
            'submission_id' => 'required|exists:submissions,id',
            'action' => 'required|in:accept,reject',
        ]);

        $submission = Submission::findOrFail($request->submission_id);

        $submission->status = $request->action === 'accept' ? 'accepted' : 'rejected';
        $submission->save();

        return response()->json(['message' => 'Soumission mise à jour.']);
    }

    public function submissionsByConference($slug)
    {
        $conference = Conference::where('slug', $slug)->firstOrFail();
        $submissions = Submission::whereIn('conference_user_id', $conference->participants()->pluck('conference_user.id'))
            ->get();

        return response()->json($submissions);
    }
    // In SubmissionController.php

    public function download($id)
    {   
        $submission = Submission::findOrFail($id);
        

        if (!Storage::exists($submission->file_path)) {
            return response()->json(['message' => 'File not found.'], 404);
        }

        return Storage::download($submission->file_path, $submission->file_name);
    }



}
