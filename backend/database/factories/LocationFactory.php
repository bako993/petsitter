<?php

namespace Database\Factories;

use App\Models\Location;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class LocationFactory extends Factory
{
    protected $model = Location::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'latitude' => round($this->faker->latitude, 7),
            'longitude' => round($this->faker->longitude, 7),
            'city' => $this->faker->city,
            'postal_code' => $this->faker->postcode,
            'street' => $this->faker->streetAddress,
            'house_number' => $this->faker->buildingNumber,
        ];
    }
}
