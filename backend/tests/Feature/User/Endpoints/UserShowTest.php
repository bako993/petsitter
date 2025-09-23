<?php

namespace Tests\Feature\User\Endpoints;

use App\Models\User;
use Tests\Feature\User\UserTestCase;

class UserShowTest extends UserTestCase
{
    public function testShowsASingleUser(): void
    {
        $user = $this->createModel(User::class);

        $response = $this->getJson("/api/users/$user->id");

        $response->assertStatus(200)
            ->assertJsonFragment([
                'id' => $user->id,
                'email' => $user->email,
            ]);
    }

    public function testReturns404IfUserNotFound(): void
    {
        $response = $this->getJson('/api/users/999');

        $response->assertStatus(404);
    }
}
