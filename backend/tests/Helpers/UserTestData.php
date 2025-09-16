<?php

namespace Tests\Helpers;

use App\Models\User;
use Core\Repositories\UserRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Mockery;

trait UserTestData
{
    protected function createUser(array $overrides = []): User
    {
        return User::factory()->create($overrides);
    }

    protected function makeUser(array $overrides = []): User
    {
        return User::factory()->make($overrides);
    }


    protected function createUsers(int $count = 5, array $overrides = []): Collection
    {
        return User::factory($count)->create($overrides);
    }

    protected function mockUserRepository(array $methods = []): UserRepositoryInterface
    {
        $mock = Mockery::mock(UserRepositoryInterface::class);

        foreach ($methods as $method => $returnValue) {
            $mock->shouldReceive($method)->andReturn($returnValue);
        }

        app()->instance(UserRepositoryInterface::class, $mock);

        return $mock;
    }

}
