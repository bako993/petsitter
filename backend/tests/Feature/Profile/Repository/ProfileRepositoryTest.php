<?php

namespace Profile\Repository;

use App\Models\Profile;
use App\Models\User;
use Core\Repositories\ProfileRepositoryInterface;
use Tests\Feature\Profile\ProfileTestCase;

class ProfileRepositoryTest extends ProfileTestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        $this->repository = app(ProfileRepositoryInterface::class);
    }

    public function testPaginateProfiles(): void
    {
        $this->createModels(Profile::class,20);

        $result = $this->repository->paginate();

        $this->assertCount(15, $result->items());
        $this->assertEquals(20, $result->total());
        $this->assertEquals(1, $result->currentPage());
        $this->assertEquals(2, $result->lastPage());
    }

    public function testFindByIdReturnsProfile(): void
    {
        $profile = $this->createModel(Profile::class);

        $found = $this->repository->findById($profile->id);

        $this->assertInstanceOf(Profile::class, $found);
        $this->assertEquals($profile->id, $found->id);
    }

    public function testFindByIdReturnsProfileNotFound(): void
    {
        $this->assertNull($this->repository->findById(999));
    }

    public function testCreateProfile(): void
    {
        $user = $this->createModel(User::class);

        $data = [
            'user_id' => $user->id,
            'bio' => 'I love spending time with pets',
            'phone' => '0123456789',
            'experience' => '5 years',
            'availability' => 'weekends morning and afternoon',
        ];

        $profile = $this->repository->create($data);

        $this->assertInstanceOf(Profile::class, $profile);
        $this->assertEquals($user->id, $profile->user_id);
        $this->assertDatabaseHas('profiles', ['bio' => 'I love spending time with pets']);
    }

    public function testUpdateProfile(): void
    {
        $profile = $this->createModel(Profile::class, ['experience' => '5 years']);

        $updated = $this->repository->update($profile->id, ['experience' => '7 years']);

        $this->assertInstanceOf(Profile::class, $updated);
        $this->assertEquals($profile->id, $updated->id);
        $this->assertEquals('7 years', $updated->experience);
        $this->assertDatabaseHas('profiles', ['experience' => '7 years']);
    }

    public function testUpdateReturnsProfileNotFound(): void
    {
        $this->assertNull($this->repository->update(999, ['bio' => 'test']));
    }

    public function testDeleteProfile(): void
    {
        $profile = $this->createModel(Profile::class);

        $deleted = $this->repository->delete($profile->id);

        $this->assertTrue($deleted);
        $this->assertDatabaseMissing('profiles', ['id' => $profile->id]);
    }

    public function testDeleteReturnsProfileNotFound(): void
    {
        $this->assertFalse($this->repository->delete(999));
    }

    public function testFindByIdWithRelations(): void
    {
        $profile = $this->createModel(Profile::class, ['user_id' => $this->createModel(User::class)->id]);

        $found = $this->repository->findById($profile->id, ['user']);

        $this->assertTrue($found->relationLoaded('user'));
    }
}
