<?php

namespace App\Http\Requests\Profile;

use Illuminate\Foundation\Http\FormRequest;

class ProfileStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'bio' => 'nullable|string|max:1000',
            'phone' => 'nullable|string|max:20',
            'experience' => 'nullable|string|max:1000',
            'availability' => 'nullable|string|max:500',
            'profile_photo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ];
    }
}
