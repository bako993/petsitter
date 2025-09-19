<?php

namespace Tests\Feature\Profile;

class ProfileShowTest extends ProfileTestCase
{
    public function testShowsASingleProfile(): void
    {
        $profile = $this->createProfile();

        $response = $this->getJson("/api/profiles/$profile->id");

        $response->assertStatus(200)
            ->assertJsonFragment([
                'id' => $profile->id
            ])
            ->assertJsonStructure(['data' => [
                'id','profile_photo','bio','phone','experience','availability',
                'user' => ['id','name','email','role'],
                'created_at','updated_at'
            ]]);
    }

    public function testReturns404IfProfileNotFound(): void
    {
        $response = $this->getJson('/api/profiles/999');

        $response->assertStatus(404)
            ->assertJson(['message' => 'Profile not found.']);
    }
}
