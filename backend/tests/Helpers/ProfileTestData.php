<?php

namespace Tests\Helpers;

use App\Models\Profile;
use App\Models\User;
use Core\Repositories\ProfileRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Mockery;

trait ProfileTestData
{
    protected function createProfile(array $overrides = []): Profile
    {
        $userId = $overrides['user_id'] ?? User::factory()->create()->id;

        /** @var Profile $profile */
        $profile = Profile::factory()->create(array_merge(['user_id' => $userId], $overrides));

        return $profile;
    }

    protected function makeProfile(array $overrides = []): Profile
    {
        $userId = $overrides['user_id'] ?? User::factory()->make()->id;

        /** @var Profile $profile */
        $profile = Profile::factory()->make(array_merge(['user_id' => $userId], $overrides));

        return $profile;
    }


    protected function createProfiles(int $count = 5, array $overrides = []): Collection
    {
        $user = $overrides['user_id'] ?? User::factory()->create()->id;

        return Profile::factory()->count($count)->create(array_merge(['user_id' => $user], $overrides));
    }

    protected function mockProfileRepository(array $methods = []): ProfileRepositoryInterface
    {
        $mock = Mockery::mock(ProfileRepositoryInterface::class);

        foreach ($methods as $method => $returnValue) {
            $mock->shouldReceive($method)->andReturn($returnValue);
        }

        app()->instance(ProfileRepositoryInterface::class, $mock);

        return $mock;
    }
}
