<?php

namespace Offering\Endpoints;

use App\Models\Profile;
use App\Models\User;
use Tests\Feature\Offering\OfferingTestCase;

class OfferingStoreTest extends OfferingTestCase
{
    public function testCreateOffering(): void
    {
        $user = $this->createModel(User::class);
        $this->createModel(Profile::class, ['user_id' => $user->id]);

        $payload = [
            'offering_type' => 'dog_walking',
            'price' => 25.50,
            'conditions' => ['note' => 'Bring leash'],
            'duration' => 60,
        ];

        $response = $this->actingAs($user)->postJson('/api/offerings', $payload);

        $response->assertStatus(201)
            ->assertJsonFragment(['offering_type' => 'dog_walking']);
    }
}
