<?php

namespace Tests\Feature\Location;

class LocationDestroyTest extends LocationTestCase
{
    public function testDeletesALocation(): void
    {
        $location = $this->createLocation();

        $response = $this->deleteJson("/api/locations/$location->id");

        $response->assertStatus(204);

        $this->assertDatabaseMissing('locations', ['id' => $location->id]);
    }
}
