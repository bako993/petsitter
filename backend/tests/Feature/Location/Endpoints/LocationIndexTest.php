<?php

namespace Location\Endpoints;

use App\Models\Location;
use Tests\Feature\Location\LocationTestCase;

class LocationIndexTest extends LocationTestCase
{
    public function testListsPaginatedUsers(): void
    {
        $this->createModels(Location::class,10);

        $response = $this->get('/api/locations');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'latitude', 'longitude', 'city', 'postal_code', 'street', 'house_number', 'user' => ['id','name','email','role'], 'created_at', 'updated_at']
                ],
                'meta' => ['current_page', 'last_page', 'per_page', 'total'],
                'links' => ['first', 'last', 'prev', 'next'],
            ]);
    }
}
