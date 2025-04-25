<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Symfony\Component\Intl\Countries;

class RegisterRequest extends FormRequest
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
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => ['nullable', 'phone:INTERNATIONAL', 'max:20'],
            'affiliation' => 'nullable|string|max:255',
            'country' => ['nullable', Rule::in($this->getAllowedCountries())],
            'password' => ['required','confirmed',Password::min(8)->letters()->symbols()],
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
            'phone.regex'    => 'Numéro de téléphone invalide.',
            'country.in'     => 'Le pays sélectionné est invalide.',
            'email.unique'   => "Cet e-mail est déjà utilisé.",
            'email.email'    => "Format de l’e-mail invalide.",
        ];
    }
}
