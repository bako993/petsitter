<?php

namespace Tests\Feature\User\Endpoints;

use Tests\Feature\User\UserTestCase;

class UserStoreTest extends UserTestCase
{
    public function testCreatesAUser(): void
    {
        $payload = [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'role' => 'owner',
        ];

        $response = $this->postJson('/api/users', $payload);

        $response->assertStatus(201)
            ->assertJsonFragment([
                'name' => 'Test User',
                'email' => 'test@example.com',
                'role' => 'owner',
            ]);
        $this->assertDatabaseHas('users', ['email' => 'test@example.com']);
    }

}
