<?php

namespace Tests\Feature\User\Endpoints;


use App\Models\User;
use Tests\Feature\User\UserTestCase;

class UserUpdateTest extends UserTestCase
{
    public function testUserCanUpdateSelf(): void
    {
        $user = $this->createModel(User::class);
        $this->actingAs($user, 'sanctum');

        $payload = ['name' => 'updated', 'email' => 'updated@gmail.com'];

        $response = $this->putJson("/api/users/{$user->id}", $payload);

        $response->assertStatus(200)
            ->assertJsonFragment([
                'id' => $user->id,
                'name' => 'updated',
                'email' => 'updated@gmail.com',
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'updated',
            'email' => 'updated@gmail.com',
        ]);
    }

    public function testUserCannotUpdateAnotherUser(): void
    {
        $user = $this->createModel(User::class);
        $otherUser = $this->createModel(User::class);

        $this->actingAs($user, 'sanctum');

        $payload = ['name' => 'test', 'email' => 'test@gmail.com'];

        $response = $this->putJson("/api/users/{$otherUser->id}", $payload);

        $response->assertStatus(403);

        $this->assertDatabaseMissing('users', [
            'id' => $otherUser->id,
            'name' => 'test',
            'email' => 'test@gmail.com',
        ]);
    }

    public function testAdminCanUpdateAnyUser(): void
    {
        $admin = $this->createModel(User::class, ['role' => 'admin']);
        $user = $this->createModel(User::class);

        $this->actingAs($admin, 'sanctum');

        $payload = ['name' => 'admin', 'email' => 'admin@gmail.com'];

        $response = $this->putJson("/api/users/{$user->id}", $payload);

        $response->assertStatus(200)
            ->assertJsonFragment([
                'id' => $user->id,
                'name' => 'admin',
                'email' => 'admin@gmail.com',
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'admin',
            'email' => 'admin@gmail.com',
        ]);
    }

    public function testUnauthenticatedUserCannotUpdate(): void
    {
        $user = $this->createModel(User::class);

        $payload = ['name' => 'noAuth', 'email' => 'noAuth@gmail.com'];

        $response = $this->putJson("/api/users/{$user->id}", $payload);

        $response->assertStatus(401);

        $this->assertDatabaseMissing('users', [
            'id' => $user->id,
            'name' => 'noAuth',
            'email' => 'noAuth@gmail.com',
        ]);
    }

    public function testReturns404IfUserNotFound(): void
    {
        $admin = $this->createModel(User::class, ['role' => 'admin']);
        $this->actingAs($admin, 'sanctum');

        $payload = ['name' => 'test', 'email' => 'test@gmail.com'];

        $response = $this->putJson("/api/users/9999", $payload);

        $response->assertStatus(404);
    }
}
