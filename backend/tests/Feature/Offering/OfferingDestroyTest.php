<?php

namespace Tests\Feature\Offering;

class OfferingDestroyTest extends OfferingTestCase
{
    public function testDeleteOffering(): void
    {
        $user = $this->createUser();
        $profile = $this->createProfile(['user_id' => $user->id]);
        $offering = $this->createOffering(['profile_id' => $profile->id]);

        $response = $this->actingAs($user)->deleteJson("/api/offerings/$offering->id");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('offerings', ['id' => $offering->id]);
    }
}
