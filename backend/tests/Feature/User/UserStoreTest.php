<?php

namespace Tests\Feature\User;

class UserStoreTest extends UserTestCase
{

    public function test_it_can_create_a_user(): void
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
