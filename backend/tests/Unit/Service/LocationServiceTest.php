<?php

namespace Service;

use App\Exceptions\UserNotAllowedException;
use App\Models\Location;
use App\Models\User;
use Core\Policies\LocationPolicy;
use Core\Repositories\LocationRepositoryInterface;
use Core\Services\LocationService;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Mockery;
use Tests\Fixtures\FixtureHelpers;
use Tests\TestCase;

class LocationServiceTest extends TestCase
{
    use FixtureHelpers;

    protected LocationService $service;
    protected LocationRepositoryInterface $locationRepoMock;
    protected LocationPolicy $locationPolicyMock;
    protected User $authUser;

    protected function setUp(): void
    {
        parent::setUp();

        $this->locationRepoMock = $this->mockRepository(LocationRepositoryInterface::class);

        $this->locationPolicyMock = Mockery::mock(LocationPolicy::class);

        $this->locationPolicyMock->shouldReceive('viewAny')->andReturn(true);
        $this->locationPolicyMock->shouldReceive('view')->andReturn(true);
        $this->locationPolicyMock->shouldReceive('create')->andReturn(true);
        $this->locationPolicyMock->shouldReceive('update')->andReturn(true);
        $this->locationPolicyMock->shouldReceive('delete')->andReturn(true);

        $this->service = new LocationService($this->locationRepoMock, $this->locationPolicyMock);

        $this->authUser = $this->makeModel(User::class, [
            'id' => 1,
            'role' => 'admin',
        ]);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_paginate_locations(): void
    {
        $items = new Collection([]);
        $mockResult = new LengthAwarePaginator(
            $items,
            $items->count(),
            15,
            1
        );

        $this->locationRepoMock
            ->shouldReceive('paginate')
            ->once()
            ->with(15, [])
            ->andReturn($mockResult);

        $result = $this->service->paginate();
        $this->assertSame($mockResult, $result);
    }

    public function test_find_location_by_id(): void
    {
        $mockLocation = $this->makeModel(Location::class, ['id' => 123, 'city' => 'arnhem']);

        $this->locationRepoMock
            ->shouldReceive('findById')
            ->once()
            ->with($mockLocation->id, [])
            ->andReturn($mockLocation);

        $result = $this->service->findById($mockLocation->id);
        $this->assertSame($mockLocation, $result);
    }

    /**
     * @throws UserNotAllowedException
     */
    public function test_creates_location(): void
    {
        $data = [
            'user_id' => $this->authUser->id,
            'latitude' => '12.34',
            'longitude' => '12.34',
            'city' => 'arnhem',
            'postal_code' => '1234',
            'street' => 'reet',
            'house_number' => '123',
        ];

        $expectedLocation = $this->makeModel(Location::class, $data);

        $this->locationRepoMock
            ->shouldReceive('create')
            ->once()
            ->with($data)
            ->andReturn($expectedLocation);

        $result = $this->service->create($data, $this->authUser);
        $this->assertSame($expectedLocation, $result);
    }

    public function test_updates_location(): void
    {
        $data = [
            'latitude' => 52.1234567,
            'longitude' => 5.9876543,
            'city' => 'Test City',
            'postal_code' => '1234AB',
            'street' => 'Test Street',
            'house_number' => '42',
        ];

        $mockLocation = $this->makeModel(Location::class, array_merge(['id' => 123], $data));

        $this->locationRepoMock
            ->shouldReceive('findById')
            ->once()
            ->with($mockLocation->id)
            ->andReturn($mockLocation);

        $this->locationRepoMock
            ->shouldReceive('update')
            ->once()
            ->with($mockLocation->id, $data)
            ->andReturn($mockLocation);

        $result = $this->service->update($mockLocation->id, $data, $this->authUser);
        $this->assertSame($mockLocation, $result);
    }

    public function test_deletes_location(): void
    {
        $mockLocationId = 123;
        $mockLocation = $this->makeModel(Location::class, ['id' => $mockLocationId, 'user_id' => 1]);

        $this->locationRepoMock
            ->shouldReceive('findById')
            ->once()
            ->with($mockLocationId)
            ->andReturn($mockLocation);

        $this->locationRepoMock
            ->shouldReceive('delete')
            ->once()
            ->with($mockLocationId)
            ->andReturnTrue();

        $result = $this->service->delete($mockLocationId, $this->authUser);
        $this->assertTrue($result);
    }
}
