<?php

namespace Tests\Feature\User;

class UserDestroyTest extends UserTestCase
{
    public function testDeletesAUser(): void
    {
        $user = $this->createUser();

        $response = $this->deleteJson("/api/users/$user->id");

        $response->assertStatus(204);

        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }
}
