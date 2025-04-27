<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SubmissionRequest;
use App\Models\Submission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

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
}
