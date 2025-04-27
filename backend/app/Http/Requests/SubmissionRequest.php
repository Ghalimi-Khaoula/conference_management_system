<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

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
}
