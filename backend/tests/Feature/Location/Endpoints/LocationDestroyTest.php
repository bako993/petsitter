<?php

namespace Location\Endpoints;

use App\Models\Location;
use Tests\Feature\Location\LocationTestCase;

class LocationDestroyTest extends LocationTestCase
{
    public function testDeletesALocation(): void
    {
        $location = $this->createModel(Location::class);

        $response = $this->deleteJson("/api/locations/$location->id");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('locations', ['id' => $location->id]);
    }
}
