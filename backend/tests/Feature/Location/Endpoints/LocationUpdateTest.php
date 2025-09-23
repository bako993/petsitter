<?php

namespace Location\Endpoints;

use App\Models\Location;
use Tests\Feature\Location\LocationTestCase;

class LocationUpdateTest extends LocationTestCase
{
    public function testUpdatesALocation(): void
    {
        $location = $this->createModel(Location::class);

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
