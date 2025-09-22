<?php

namespace Service;

use App\Models\Location;
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

    protected function setUp(): void
    {
        parent::setUp();

        $this->locationRepoMock = $this->mockRepository(LocationRepositoryInterface::class);
        $this->service = new LocationService($this->locationRepoMock);
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

    public function test_creates_location(): void
    {
        $data = [
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

        $result = $this->service->create($data);
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
            ->shouldReceive('update')
            ->once()
            ->with($mockLocation->id, $data)
            ->andReturn($mockLocation);

        $result = $this->service->update($mockLocation->id, $data);
        $this->assertSame($mockLocation, $result);
    }

    public function test_deletes_location(): void
    {
        $mockLocationId = 123;

        $this->locationRepoMock
            ->shouldReceive('delete')
            ->once()
            ->with($mockLocationId)
            ->andReturnTrue();

        $result = $this->service->delete($mockLocationId);
        $this->assertTrue($result);
    }
}
