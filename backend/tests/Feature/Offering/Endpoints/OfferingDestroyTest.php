<?php

namespace Offering\Endpoints;

use App\Models\Offering;
use App\Models\Profile;
use App\Models\User;
use Tests\Feature\Offering\OfferingTestCase;

class OfferingDestroyTest extends OfferingTestCase
{
    public function testDeleteOffering(): void
    {
        $user = $this->createModel(User::class);
        $profile = $this->createModel(Profile::class, ['user_id' => $user->id]);
        $offering = $this->createModel(Offering::class, ['profile_id' => $profile->id]);

        $response = $this->actingAs($user)->deleteJson("/api/offerings/$offering->id");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('offerings', ['id' => $offering->id]);
    }
}
