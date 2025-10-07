<?php

namespace Location\Endpoints;

use App\Models\User;
use Tests\Feature\Location\LocationTestCase;

class LocationStoreTest extends LocationTestCase
{
    public function testCreateALocationWhenAuthenticatedReturnsCreated(): void
    {
        $user = $this->createModel(User::class);

        $payload = [
            'user_id' => $user->id,
            'latitude' => 52.370216,
            'longitude' => 4.895168,
            'city' => 'Amsterdam',
            'postal_code' => '1012',
            'street' => 'Damrak',
            'house_number' => '1A',
        ];

        $response = $this->actingAs($user)->postJson('/api/locations', $payload);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'latitude',
                    'longitude',
                    'city',
                    'postal_code',
                    'street',
                    'house_number',
                    'created_at',
                    'updated_at',
                ]
            ]);

        $this->assertDatabaseHas('locations', [
            'user_id' => $user->id,
            'city' => 'Amsterdam',
        ]);
    }

    public function testCreateALocationWhenNotLoggedInReturnsUnAuthorized(): void
    {
        $user = $this->createModel(User::class);

        $payload = [
            'user_id' => $user->id,
            'latitude' => 52.370216,
            'longitude' => 4.895168,
            'city' => 'Amsterdam',
            'postal_code' => '1012',
            'street' => 'Damrak',
            'house_number' => '1A',
        ];

        $response = $this->postJson('/api/locations', $payload);

        $response->assertStatus(401);
    }
}
