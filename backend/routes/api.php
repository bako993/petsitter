<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\User\LocationController;
use App\Http\Controllers\User\OfferingController;
use App\Http\Controllers\User\ProfileController;
use App\Http\Controllers\User\ReviewController;
use App\Http\Controllers\User\UserController;
use Illuminate\Support\Facades\Route;

// public routes
Route::middleware('throttle:10,1')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);

    Route::apiResource('locations', LocationController::class)->only(['index', 'show']);
    Route::apiResource('offerings', OfferingController::class)->only(['index', 'show']);
    Route::apiResource('profiles', ProfileController::class)->only(['index', 'show']);
    Route::apiResource('reviews', ReviewController::class)->only(['index', 'show']);
});

// logged in routes
Route::middleware('auth:sanctum')->group(function () {

    Route::middleware('admin')->group(function () {
        Route::apiResource('users', UserController::class)->only(['index', 'store']);
    });

    Route::apiResource('users', UserController::class)->only(['show', 'update', 'destroy']);
    Route::apiResource('locations', LocationController::class)->only(['store', 'update', 'destroy']);
    Route::apiResource('profiles', ProfileController::class)->only(['store', 'update', 'destroy']);
    Route::apiResource('offerings', OfferingController::class)->only(['store', 'update', 'destroy']);
    Route::apiResource('reviews', ReviewController::class)->only(['store', 'update', 'destroy']);
});
