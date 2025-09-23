<?php

namespace Tests\Feature\User\Endpoints;

use App\Models\User;
use Tests\Feature\User\UserTestCase;

class UserDestroyTest extends UserTestCase
{
    public function testDeletesAUser(): void
    {
        $user = $this->createModel(User::class);

        $response = $this->deleteJson("/api/users/$user->id");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }
}
