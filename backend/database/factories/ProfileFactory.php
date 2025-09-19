<?php

namespace Database\Factories;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProfileFactory extends Factory
{
    protected $model = Profile::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'bio' => $this->faker->sentence(8),
            'phone' => $this->faker->phoneNumber(),
            'experience' => $this->faker->randomElement([
                '1 year with pets',
                '3 years with cats and dogs',
                'Experienced dog walker',
                'Pet sitter for 5 years',
            ]),
            'availability' => $this->faker->randomElement([
                'Weekdays only',
                'Weekends only',
                'Mon-Fri evenings',
                'Full-time',
            ]),
            'profile_photo' => null,
        ];
    }
}
