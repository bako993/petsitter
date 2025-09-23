<?php

namespace Offering\Endpoints;

use App\Models\Offering;
use App\Models\Profile;
use App\Models\User;
use Tests\Feature\Offering\OfferingTestCase;

class OfferingUpdateTest extends OfferingTestCase
{
    public function testUpdateOffering(): void
    {
        $user = $this->createModel(User::class);
        $profile = $this->createModel(Profile::class, ['user_id' => $user->id]);
        $offering = $this->createModel(Offering::class, ['profile_id' => $profile->id]);

        $payload = ['price' => 50];

        $response = $this->actingAs($user)->putJson("/api/offerings/$offering->id", $payload);

        $response->assertStatus(200)->assertJsonFragment(['price' => 50]);
    }
}
