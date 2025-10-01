<?php

namespace App\Http\Requests\User;

use App\Rules\UserRule;
use Illuminate\Foundation\Http\FormRequest;

class UserStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'min:3', 'max:255'],
            'email' => ['sometimes', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:3', UserRule::password()],
        ];
    }
}
