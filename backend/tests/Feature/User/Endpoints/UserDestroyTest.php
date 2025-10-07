<?php

namespace Tests\Feature\User\Endpoints;

use App\Models\User;
use Tests\Feature\User\UserTestCase;

class UserDestroyTest extends UserTestCase
{
    public function testUserDeletesSelfReturns204(): void
    {
        $user = $this->createModel(User::class);
        $this->actingAs($user, 'sanctum');

        $response = $this->deleteJson("/api/users/$user->id");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }

    public function testFailsWhenUserIsNotLoggedIn(): void
    {
        $user = $this->createModel(User::class);

        $response = $this->deleteJson("/api/users/$user->id");

        $response->assertStatus(401);
        $this->assertDatabaseHas('users', ['id' => $user->id]);
    }

    public function testFailsIfNotAdminDeletesAnotherUser(): void
    {
        $user = $this->createModel(User::class);
        $secondUser = $this->createModel(User::class);

        $this->actingAs($user, 'sanctum');

        $response = $this->deleteJson("/api/users/$secondUser->id");

        $response->assertStatus(403);
        $this->assertDatabaseHas('users', ['id' => $secondUser->id]);
    }

    public function testAdminCanDeleteAnyUser(): void
    {
        $admin = $this->createModel(User::class, ['role' => 'admin']);
        $user = $this->createModel(User::class);

        $this->actingAs($admin, 'sanctum');

        $response = $this->deleteJson("/api/users/$user->id");

        $response->assertStatus(204);

    }
}
