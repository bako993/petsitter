<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\AuthResource;
use Core\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    protected AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function register(RegisterRequest $request): JsonResponse
    {
        $result = $this->authService->register($request->validated());

        return response()->json(
            new AuthResource($result['user'], $result['token'], $result['expires_at']),
            201
        );
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $result = $this->authService->login(
            $request->input('email'),
            $request->input('password')
        );

        if (! $result) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        return response()->json(
            new AuthResource($result['user'], $result['token'], $result['expires_at'])
        );
    }

    public function logout(Request $request): JsonResponse
    {
        $userId = $request->user()->getAuthIdentifier();
        $tokenId = $request->user()?->currentAccessToken()?->id;

        $this->authService->logout($userId, $tokenId);

        return response()->json(['message' => 'Logged out successfully']);
    }
}
