<?php

namespace Tests\Feature\Offering;

class OfferingUpdateTest extends OfferingTestCase
{
    public function testUpdateOffering(): void
    {
        $user = $this->createUser();
        $profile = $this->createProfile(['user_id' => $user->id]);
        $offering = $this->createOffering(['profile_id' => $profile->id]);

        $payload = ['price' => 50];

        $response = $this->actingAs($user)->putJson("/api/offerings/$offering->id", $payload);

        $response->assertStatus(200)->assertJsonFragment(['price' => 50]);
    }
}
