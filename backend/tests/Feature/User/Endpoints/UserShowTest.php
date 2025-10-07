<?php

namespace Tests\Feature\User\Endpoints;

use App\Models\User;
use Tests\Feature\User\UserTestCase;

class UserShowTest extends UserTestCase
{
    public function testShowsASingleUser(): void
    {
        $user = $this->createModel(User::class);
        $this->actingAs($user, 'sanctum');
        $response = $this->getJson("/api/users/$user->id");

        $response->assertStatus(200)
            ->assertJsonFragment([
                'id' => $user->id,
                'email' => $user->email,
            ]);
    }

    public function testReturns404WhenTargetUserNotFound(): void
    {
        $user = $this->createModel(User::class, ['role' => 'admin']);
        $this->actingAs($user, 'sanctum');
        $response = $this->getJson('/api/users/999');

        $response->assertStatus(404);
    }

    public function testReturns403WhenUserIsNotAdmin(): void
    {
        $user = $this->createModel(User::class);
        $this->actingAs($user, 'sanctum');
        $response = $this->getJson('/api/users/999');

        $response->assertStatus(403);
    }
}
