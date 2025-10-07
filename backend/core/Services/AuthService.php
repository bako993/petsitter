<?php

namespace Core\Services;

use Core\Repositories\AuthRepositoryInterface;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    protected AuthRepositoryInterface $authRepo;

    public function __construct(AuthRepositoryInterface $authRepo)
    {
        $this->authRepo = $authRepo;
    }

    public function register(array $data): array
    {
        $data['password'] = Hash::make($data['password']);
        $user = $this->authRepo->createUser($data);

        $token = $this->authRepo->createTokenForUser($user->id);

        return [
            'user' => $user,
            'token' => $token,
            'expires_at' => null,
        ];
    }

    public function login(string $email, string $password): ?array
    {
        $user = $this->authRepo->findByEmail($email);

        if (! $user || ! Hash::check($password, $user->getAuthPassword())) {
            return null;
        }

        $token = $this->authRepo->createTokenForUser($user->id);

        return [
            'user' => $user,
            'token' => $token,
            'expires_at' => null,
        ];
    }

    public function logout(int $userId, ?string $tokenId = null): void
    {
        $this->authRepo->deleteToken($userId, $tokenId);
    }
}
