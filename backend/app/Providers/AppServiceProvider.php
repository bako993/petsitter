<?php

namespace App\Providers;

use Core\Repositories\LocationRepository;
use Core\Repositories\LocationRepositoryInterface;
use Core\Repositories\ProfileRepository;
use Core\Repositories\ProfileRepositoryInterface;
use Core\Repositories\UserRepository;
use Core\Repositories\UserRepositoryInterface;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
        $this->app->bind(LocationRepositoryInterface::class, LocationRepository::class);
        $this->app->bind(ProfileRepositoryInterface::class, ProfileRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
