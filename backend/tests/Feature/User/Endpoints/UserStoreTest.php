<?php

namespace Tests\Feature\User\Endpoints;

use App\Models\User;
use Tests\Feature\User\UserTestCase;

class UserStoreTest extends UserTestCase
{
    public function testAnAdminCreatesAUserReturnsCreated(): void
    {
        $user = $this->createModel(User::class, ['role' => 'admin']);
        $this->actingAs($user, 'sanctum');

        $payload = [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
        ];

        $response = $this->postJson('/api/users', $payload);

        $response->assertStatus(201)
            ->assertJsonFragment([
                'name' => 'Test User',
                'email' => 'test@example.com',
            ]);
        $this->assertDatabaseHas('users', ['email' => 'test@example.com']);
    }

    public function testNonLoggedInAdminAdminCreatesAUserReturns(): void
    {
        $this->createModel(User::class, ['role' => 'admin']);

        $payload = [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
        ];

        $response = $this->postJson('/api/users', $payload);

        $response->assertStatus(401);
    }

    public function testNonAdminCreatesAUserReturnsUnauthorized(): void
    {
        $this->createModel(User::class);
        $payload = [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
        ];

        $response = $this->postJson('/api/users', $payload);

        $response->assertStatus(401);
    }
}
