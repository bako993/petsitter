<?php

namespace App\Http\Requests\Offering;

use Illuminate\Foundation\Http\FormRequest;

class OfferingUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'offering_type' => ['sometimes', 'in:dog_walking,sitting,grooming,night_stay'],
            'price' => ['sometimes', 'numeric', 'min:0'],
            'conditions' => ['nullable', 'array'],
            'duration' => ['nullable', 'integer', 'min:60'],
        ];
    }
}
