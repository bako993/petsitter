<?php

namespace Offering\Endpoints;

use App\Models\Offering;
use App\Models\Profile;
use App\Models\User;
use Tests\Feature\Offering\OfferingTestCase;

class OfferingShowTest extends OfferingTestCase
{
    public function testShowsASingleOffering(): void
    {
        $offering = $this->createModel(Offering::class);

        $response = $this->getJson("/api/offerings/$offering->id");

        $response->assertStatus(200)
            ->assertJsonFragment(['id' => $offering->id]);
    }

    public function testReturns404IfOfferingNotFound(): void
    {
        $user = $this->createModel(User::class);
        $this->createModel(Profile::class, ['user_id' => $user->id]);

        $response = $this->actingAs($user)->getJson("/api/offerings/999999");

        $response->assertStatus(404)
            ->assertJson(['message' => 'Offering not found']);
    }
}
