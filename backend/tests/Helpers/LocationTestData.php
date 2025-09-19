<?php

namespace Tests\Helpers;

use App\Models\Location;
use Core\Repositories\LocationRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Mockery;

trait LocationTestData
{
    protected function createLocation(array $overrides = []): Location|Collection
    {
        return Location::factory()->create($overrides);
    }

    protected function makeLocation(array $overrides = []): Location|Collection
    {
        return Location::factory()->make($overrides);
    }

    protected function createLocations(int $count = 5, array $overrides = []): Location|Collection
    {
        return Location::factory($count)->create($overrides);
    }

    protected function mockLocationRepository(array $methods = []): LocationRepositoryInterface
    {
        $mock = Mockery::mock(LocationRepositoryInterface::class);

        foreach ($methods as $method => $returnValue) {
            $mock->shouldReceive($method)->andReturn($returnValue);
        }

        app()->instance(LocationRepositoryInterface::class, $mock);

        return $mock;
    }
}
