<?php

namespace Offering\Endpoints;

use App\Models\Offering;
use Tests\Feature\Offering\OfferingTestCase;

class OfferingIndexTest extends OfferingTestCase
{
    public function testListsPaginatedOfferings(): void
    {
        $this->createModels(Offering::class, 10);

        $response = $this->getJson('/api/offerings');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id','offering_type','price','conditions','duration','profile_id','created_at','updated_at']
                ],
                'meta',
                'links',
            ]);
        $this->assertCount(10, $response->json('data'));
    }
}
