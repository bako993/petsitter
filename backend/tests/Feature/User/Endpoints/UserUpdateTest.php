<?php

namespace Tests\Feature\User\Endpoints;


use App\Models\User;
use Tests\Feature\User\UserTestCase;

class UserUpdateTest extends UserTestCase
{
    public function testUpdatesAUser(): void
    {
        $user = $this->createModel(User::class);

        $payload = [
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
        ];

        $response = $this->putJson("/api/users/$user->id", $payload);

        $response->assertStatus(200)
            ->assertJsonFragment([
                'name' => 'Updated Name',
                'email' => 'updated@example.com',
            ]);
        $this->assertDatabaseHas('users', ['email' => 'updated@example.com']);
    }
}
