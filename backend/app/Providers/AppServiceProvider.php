<?php

namespace App\Providers;

use Core\Repositories\AuthRepository;
use Core\Repositories\AuthRepositoryInterface;
use Core\Repositories\LocationRepository;
use Core\Repositories\LocationRepositoryInterface;
use Core\Repositories\OfferingRepository;
use Core\Repositories\OfferingRepositoryInterface;
use Core\Repositories\ProfileRepository;
use Core\Repositories\ProfileRepositoryInterface;
use Core\Repositories\ReviewRepository;
use Core\Repositories\ReviewRepositoryInterface;
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
        $this->app->bind(AuthRepositoryInterface::class, AuthRepository::class);
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
        $this->app->bind(LocationRepositoryInterface::class, LocationRepository::class);
        $this->app->bind(ProfileRepositoryInterface::class, ProfileRepository::class);
        $this->app->bind(OfferingRepositoryInterface::class, OfferingRepository::class);
        $this->app->bind(ReviewRepositoryInterface::class, ReviewRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
