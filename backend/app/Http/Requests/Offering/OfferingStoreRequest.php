<?php

namespace App\Http\Requests\Offering;

use Illuminate\Foundation\Http\FormRequest;

class OfferingStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'offering_type' => ['required', 'in:dog_walking,sitting,grooming,night_stay'],
            'price' => ['required', 'numeric', 'min:0'],
            'conditions' => ['nullable', 'array'],
            'duration' => ['nullable', 'integer', 'min:60'],
        ];
    }
}
