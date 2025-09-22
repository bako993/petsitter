<?php

namespace Tests\Fixtures;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;
use Mockery;
use Mockery\MockInterface;

trait FixtureHelpers
{
    /**
     * Create a single model instance in DB.
     * @noinspection PhpUndefinedMethodInspection
     */
    protected function createModel(string $modelClass, array $overrides = []): Model
    {
        return $modelClass::factory()->create($overrides);
    }

    /**
     * Make a single model instance (not saved).
     * @noinspection PhpUndefinedMethodInspection
     *
     * @template T of Model
     * @param class-string<T> $modelClass
     * @param array $overrides
     * @return T
     */
    protected function makeModel(string $modelClass, array $overrides = []): Model
    {
        return $modelClass::factory()->make($overrides);
    }

    /**
     * Create multiple model instances in DB.
     * @noinspection PhpUndefinedMethodInspection
     */
    protected function createModels(string $modelClass, int $count = 5, array $overrides = []): Collection
    {
        return $modelClass::factory()->count($count)->create($overrides);
    }

    /**
     * Mock a repository or any interface.
     *
     * @template T
     * @param class-string<T> $interface
     * @param array<string, mixed> $methods
     * @return T&MockInterface
     */
    protected function mockRepository(string $interface, array $methods = [])
    {
        $mock = Mockery::mock($interface);

        foreach ($methods as $method => $returnValue) {
            $mock->shouldReceive($method)->andReturn($returnValue);
        }

        if (interface_exists($interface)) {
            app()->instance($interface, $mock);
        }

        return $mock;
    }
}
