<?php

namespace Tests\Feature\User\Endpoints;

use App\Models\User;
use Tests\Feature\User\UserTestCase;

class UserIndexTest extends UserTestCase
{
    public function testListsPaginatedUsers(): void
    {
        $this->createModels(User::class,10);

        $response = $this->getJson('/api/users');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'email', 'role', 'created_at', 'updated_at']
                ],
                'meta' => ['current_page', 'last_page', 'per_page', 'total'],
                'links' => ['first', 'last', 'prev', 'next'],
            ]);
    }
}
