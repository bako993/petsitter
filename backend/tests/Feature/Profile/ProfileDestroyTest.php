<?php

namespace Profile;

use Tests\Feature\Profile\ProfileTestCase;

class ProfileDestroyTest extends ProfileTestCase
{
    public function testDeletesAProfile(): void
    {
        $profile = $this->createProfile();

        $response = $this->deleteJson("/api/profiles/$profile->id");

        $response->assertStatus(204);

        $this->assertDatabaseMissing('profiles', ['id' => $profile->id]);
    }
}
