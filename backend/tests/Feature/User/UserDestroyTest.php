<?php

namespace Tests\Feature\User;

class UserDestroyTest extends UserTestCase
{
    public function test_it_can_delete_a_user(): void
    {
        $user = $this->createUser();

        $response = $this->deleteJson("/api/users/$user->id");

        $response->assertStatus(204);

        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }
}
