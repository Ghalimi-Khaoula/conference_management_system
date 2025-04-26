<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\Intl\Countries;
use Illuminate\Validation\Rule;

class StoreConferenceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'visibility' => 'required|in:private,public',

            'installation_type' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'acronym' => 'nullable|string|max:255', // corrected (nullable)

            'web_page' => 'nullable|url|max:255',    // corrected (nullable)
            'venue' => 'nullable|string|max:255',
            'city' => 'required|string|max:255',
            'country' => ['required',Rule::in($this->getAllowedCountries())],

            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',

            'estimated_submissions' => 'nullable|integer|min:0', // corrected (nullable)

            'primary_area' => 'required|string|max:255',
            'secondary_area' => 'nullable|string|max:255',
            'area_notes' => 'nullable|string',

            'organizer_name' => 'required|string|max:255',
            'organizer_web_page' => 'nullable|url|max:255',
            'contact_phone' => 'required|string|max:20',

            // 'requester_role' => removed

            'additional_info' => 'nullable|string',
            'status' => 'prohibited',
        ];
    }
    protected function getAllowedCountries(): array
    {
        return cache()->rememberForever('allowed_countries_fr', function () {
            return array_values(Countries::getNames('fr'));
        });
    }
    public function messages(): array
    {
        return [
            'country.in' => 'Le pays sélectionné n\'est pas valide.',
        ];
    }
}
