<?php

namespace Location\Endpoints;

use App\Models\Location;
use App\Models\User;
use Tests\Feature\Location\LocationTestCase;

class LocationDestroyTest extends LocationTestCase
{
    public function testDeletesALocation(): void
    {
        $user = $this->createModel(User::class, ['role' => 'admin']);
        $this->actingAs($user, 'sanctum');

        $location = $this->createModel(Location::class);

        $response = $this->deleteJson("/api/locations/$location->id");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('locations', ['id' => $location->id]);
    }
}
