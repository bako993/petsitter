<?php

namespace Profile\Endpoints;

use App\Models\Profile;
use Tests\Feature\Profile\ProfileTestCase;

class ProfileUpdateTest extends ProfileTestCase
{
    public function testUpdatesAProfile(): void
    {
        $profile = $this->createModel(Profile::class);

        $payload = [
            'bio' => 'Updated bio',
            'phone' => '0600000000',
        ];

        $response = $this->putJson("/api/profiles/$profile->id", $payload);

        $response->assertStatus(200)
            ->assertJsonFragment([
                'bio' => 'Updated bio',
                'phone' => '0600000000'
            ]);

        $this->assertDatabaseHas('profiles', [
            'id' => $profile->id,
            'bio' => 'Updated bio',
        ]);
    }
}
