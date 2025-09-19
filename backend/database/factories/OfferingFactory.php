<?php

namespace Database\Factories;

use App\Models\Offering;
use App\Models\Profile;
use Illuminate\Database\Eloquent\Factories\Factory;

class OfferingFactory extends Factory
{
    protected $model = Offering::class;
    public function definition(): array
    {
        return [
            'profile_id' => Profile::factory(),
            'offering_type' => $this->faker->randomElement(['dog_walking', 'sitting', 'grooming', 'night_stay']),
            'price' => $this->faker->randomFloat(2, 5, 100),
            'conditions' => ['special_instructions' => $this->faker->sentence()],
            'duration' => $this->faker->numberBetween(60, 180),
        ];
    }
}
