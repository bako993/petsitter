<?php

namespace Profile\Endpoints;

use App\Models\Profile;
use Tests\Feature\Profile\ProfileTestCase;

class ProfileIndexTest extends ProfileTestCase
{
    public function testListsPaginatedProfiles(): void
    {
        $this->createModels(Profile::class,10);

        $response = $this->get('/api/profiles');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id','profile_photo','bio','phone','experience','availability','user','created_at','updated_at']
                ],
                'meta' => ['current_page','last_page','per_page','total'],
                'links' => ['first','last','prev','next'],
            ]);
    }
}
