<?php

namespace Tests\Feature\Profile;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ProfileStoreTest extends ProfileTestCase
{

    public function testCreateAProfile(): void
    {
        Storage::fake('public');

        $user = $this->createLoggedInUser();

        $payload = [
            'user_id' => $user->id,
            'bio' => 'Loving dog sitter',
            'phone' => '0612345678',
            'experience' => '5 years with dogs',
            'availability' => 'Mon-Fri evenings',
            'profile_photo' => UploadedFile::fake()->image('avatar.jpg'),
        ];

        $response = $this->postJson('/api/profiles', $payload);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => ['id','bio','phone','experience','availability','profile_photo','created_at','updated_at']
            ]);

        $this->assertDatabaseHas('profiles', [
            'user_id' => $user->id,
            'bio' => 'Loving dog sitter',
        ]);
    }
}
