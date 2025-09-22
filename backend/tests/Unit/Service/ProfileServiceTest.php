<?php

namespace Service;

use App\Models\Profile;
use Core\Repositories\ProfileRepositoryInterface;
use Core\Services\FileService;
use Core\Services\ProfileService;
use Illuminate\Http\UploadedFile;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Mockery;
use Tests\Fixtures\FixtureHelpers;
use Tests\TestCase;

class ProfileServiceTest extends TestCase
{
    use FixtureHelpers;

    protected ProfileService $service;
    protected ProfileRepositoryInterface $profileRepoMock;
    protected FileService $fileServiceMock;

    protected function setUp(): void
    {
        parent::setUp();

        $this->profileRepoMock = $this->mockRepository(ProfileRepositoryInterface::class);
        $this->fileServiceMock = Mockery::mock(FileService::class);

        $this->service = new ProfileService($this->profileRepoMock, $this->fileServiceMock);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_paginate_profiles(): void
    {
        $items = new Collection([]);
        $mockResult = new LengthAwarePaginator($items, $items->count(), 15, 1);

        $this->profileRepoMock
            ->shouldReceive('paginate')
            ->once()
            ->with(15, [])
            ->andReturn($mockResult);

        $result = $this->service->paginate();
        $this->assertSame($mockResult, $result);
    }

    public function test_find_profile_by_id(): void
    {
        $mockProfile = $this->makeModel(Profile::class, ['id' => 123]);

        $this->profileRepoMock
            ->shouldReceive('findById')
            ->once()
            ->with($mockProfile->id, [])
            ->andReturn($mockProfile);

        $result = $this->service->findById($mockProfile->id);
        $this->assertSame($mockProfile, $result);
    }

    public function test_creates_profile_without_photo(): void
    {
        $data = [
            'user_id' => 1,
            'bio' => 'Test bio',
        ];

        $mockProfile = $this->makeModel(Profile::class, $data);

        $this->profileRepoMock
            ->shouldReceive('create')
            ->once()
            ->with($data)
            ->andReturn($mockProfile);

        $result = $this->service->create($data);
        $this->assertSame($mockProfile, $result);
    }

    public function test_creates_profile_with_photo(): void
    {
        $data = [
            'user_id' => 1,
            'bio' => 'Test bio',
        ];
        $uploadedFile = UploadedFile::fake()->image('profile.jpg');
        $dataWithPhoto = array_merge($data, ['profile_photo' => '/storage/profiles/profile.jpg']);

        $mockProfile = $this->makeModel(Profile::class, $dataWithPhoto);

        $this->fileServiceMock
            ->shouldReceive('upload')
            ->once()
            ->with($uploadedFile, 'profiles')
            ->andReturn('/storage/profiles/profile.jpg');

        $this->profileRepoMock
            ->shouldReceive('create')
            ->once()
            ->with($dataWithPhoto)
            ->andReturn($mockProfile);

        $result = $this->service->create($data, $uploadedFile);
        $this->assertSame($mockProfile, $result);
    }

    public function test_updates_profile_without_photo(): void
    {
        $data = [
            'bio' => 'Updated bio',
        ];
        $mockProfile = $this->makeModel(Profile::class, ['id' => 123, 'bio' => 'Updated bio']);

        $this->profileRepoMock
            ->shouldReceive('findById')
            ->once()
            ->with($mockProfile->id)
            ->andReturn($mockProfile);

        $this->profileRepoMock
            ->shouldReceive('update')
            ->once()
            ->with($mockProfile->id, $data)
            ->andReturn($mockProfile);

        $result = $this->service->update($mockProfile->id, $data);
        $this->assertSame($mockProfile, $result);
    }

    public function test_updates_profile_with_new_photo(): void
    {
        $uploadedFile = UploadedFile::fake()->image('new.jpg');
        $data = ['bio' => 'Updated bio'];
        $mockProfile = $this->makeModel(Profile::class, ['id' => 123, 'profile_photo' => '/storage/profiles/old.jpg']);

        $this->profileRepoMock
            ->shouldReceive('findById')
            ->once()
            ->with($mockProfile->id)
            ->andReturn($mockProfile);

        $this->fileServiceMock
            ->shouldReceive('delete')
            ->once()
            ->with('/storage/profiles/old.jpg')
            ->andReturnTrue();

        $this->fileServiceMock
            ->shouldReceive('upload')
            ->once()
            ->with($uploadedFile, 'profiles')
            ->andReturn('/storage/profiles/new.jpg');

        $dataWithPhoto = array_merge($data, ['profile_photo' => '/storage/profiles/new.jpg']);

        $this->profileRepoMock
            ->shouldReceive('update')
            ->once()
            ->with($mockProfile->id, $dataWithPhoto)
            ->andReturn($mockProfile);

        $result = $this->service->update($mockProfile->id, $data, $uploadedFile);
        $this->assertSame($mockProfile, $result);
    }

    public function test_deletes_profile_without_photo(): void
    {
        $mockProfile = $this->makeModel(Profile::class, ['id' => 123, 'profile_photo' => null]);

        $this->profileRepoMock
            ->shouldReceive('findById')
            ->once()
            ->with($mockProfile->id)
            ->andReturn($mockProfile);

        $this->profileRepoMock
            ->shouldReceive('delete')
            ->once()
            ->with($mockProfile->id)
            ->andReturnTrue();

        $result = $this->service->delete($mockProfile->id);
        $this->assertTrue($result);
    }

    public function test_deletes_profile_with_photo(): void
    {
        $mockProfile = $this->makeModel(Profile::class, ['id' => 123, 'profile_photo' => '/storage/profiles/photo.jpg']);

        $this->profileRepoMock
            ->shouldReceive('findById')
            ->once()
            ->with($mockProfile->id)
            ->andReturn($mockProfile);

        $this->fileServiceMock
            ->shouldReceive('delete')
            ->once()
            ->with('/storage/profiles/photo.jpg')
            ->andReturnTrue();

        $this->profileRepoMock
            ->shouldReceive('delete')
            ->once()
            ->with($mockProfile->id)
            ->andReturnTrue();

        $result = $this->service->delete($mockProfile->id);
        $this->assertTrue($result);
    }

    public function test_deletes_nonexistent_profile_returns_false(): void
    {
        $this->profileRepoMock
            ->shouldReceive('findById')
            ->once()
            ->with(999)
            ->andReturnNull();

        $result = $this->service->delete(999);
        $this->assertFalse($result);
    }
}
