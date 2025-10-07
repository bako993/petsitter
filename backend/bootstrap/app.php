<?php

use App\Exceptions\UserNotAllowedException;
use App\Exceptions\NotFoundException;
use App\Http\Middlewares\AdminMiddleware;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'admin' => AdminMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (AuthenticationException $e, Request $request) {
            return response()->json([
                'message' => 'Unauthenticated.'
            ], 401);
        });
        $exceptions->render(function (UserNotAllowedException $e, Request $request) {
            return response()->json([
                'error' => 'Unauthorized',
                'message' => $e->getMessage(),
            ], 403);
        });
        $exceptions->render(function (NotFoundException $e, Request $_request) {
            return response()->json([
                'error' => 'Not Found',
                'message' => $e->getMessage(),
            ], 404);
        });
    })->create();
