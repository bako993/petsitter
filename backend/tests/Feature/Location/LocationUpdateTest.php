<?php

namespace Tests\Feature\Location;

class LocationUpdateTest extends LocationTestCase
{
    public function testUpdatesALocation(): void
    {
        $location = $this->createLocation();

        $payload = [
            'city' => 'Rotterdam',
            'street' => 'Coolsingel',
        ];

        $response = $this->putJson("/api/locations/$location->id", $payload);

        $response->assertStatus(200)
            ->assertJsonFragment([
                'city' => 'Rotterdam',
                'street' => 'Coolsingel'
            ]);

        $this->assertDatabaseHas('locations', ['id' => $location->id, 'city' => 'Rotterdam', 'street' => 'Coolsingel']);
    }
}
