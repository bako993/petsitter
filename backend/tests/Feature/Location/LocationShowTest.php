<?php

namespace Tests\Feature\Location;

class LocationShowTest extends LocationTestCase
{
    public function testShowsASingleLocation(): void
    {
        $location = $this->createLocation();

        $response = $this->getJson("/api/locations/$location->id");

        $response->assertStatus(200)
            ->assertJsonFragment([
                "id" => $location->id
            ])
            ->assertJsonStructure(['data' => ['id','latitude','longitude','city','postal_code','street','house_number', 'user' => ['id','name','email','role'],'created_at','updated_at']]);
    }

    public function testReturns404IfLocationNotFound(): void
    {
        $response = $this->getJson('/api/locations/999');

        $response->assertStatus(404)
            ->assertJson(['message' => 'Location not found']);
    }
}
