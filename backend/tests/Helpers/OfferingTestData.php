<?php

namespace Tests\Helpers;

use App\Models\Offering;
use Core\Repositories\OfferingRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Mockery;

trait OfferingTestData
{
    protected function createOffering(array $overrides = []): Offering|Collection
    {
        return Offering::factory()->create($overrides);
    }

    protected function makeOffering(array $overrides = []): Offering|Collection
    {
        return Offering::factory()->make($overrides);
    }

    protected function createOfferings(int $count = 5, array $overrides = []): Collection
    {
        return Offering::factory()->count($count)->create($overrides);
    }

    protected function mockOfferingRepository(array $methods = []): OfferingRepositoryInterface
    {
        $mock = Mockery::mock(OfferingRepositoryInterface::class);

        foreach ($methods as $method => $returnValue) {
            $mock->shouldReceive($method)->andReturn($returnValue);
        }

        app()->instance(OfferingRepositoryInterface::class, $mock);

        return $mock;
    }
}


