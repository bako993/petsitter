<?php

namespace Tests\Feature\Offering;

class OfferingShowTest extends OfferingTestCase
{
    public function testShowsASingleOffering(): void
    {
        $offering = $this->createOffering();

        $response = $this->getJson("/api/offerings/$offering->id");

        $response->assertStatus(200)
            ->assertJsonFragment(['id' => $offering->id]);
    }

    public function testReturns404IfOfferingNotFound(): void
    {
        $user = $this->createUser();
        $this->createProfile(['user_id' => $user->id]);
        $response = $this->actingAs($user)->getJson("/api/offerings/999999");

        $response->assertStatus(404)
            ->assertJson(['message' => 'Offering not found']);
    }
}
