<?php

namespace App\Rules;

use Illuminate\Validation\Rules\Password;

class UserRule
{
    public static function password(bool $required = true, bool $confirmed = true): array
    {
        $rules = [];

        if ($required) {
            $rules[] = 'required';
        } else {
            $rules[] = 'sometimes';
            $rules[] = 'nullable';
        }

        $rules[] = 'string';
        $rules[] = Password::defaults();

        if ($confirmed) {
            $rules[] = 'confirmed';
        }

        return $rules;
    }
}
