<?php

namespace Tests\Feature\User;

class UserShowTest extends UserTestCase
{
    public function test_it_can_show_a_single_user(): void
    {
        $user = $this->createUser();

        $response = $this->getJson("/api/users/{$user->id}");

        $response->assertStatus(200)
            ->assertJsonFragment([
                'id' => $user->id,
                'email' => $user->email,
            ]);
    }

    public function test_it_returns_404_if_user_not_found(): void
    {
        $response = $this->getJson('/api/users/999');

        $response->assertStatus(404);
    }
}
