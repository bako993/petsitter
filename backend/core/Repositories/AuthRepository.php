<?php

namespace Core\Repositories;

use App\Exceptions\UserNotFoundException;
use App\Models\User;

class AuthRepository implements AuthRepositoryInterface
{
    protected User $model;

    public function __construct(User $model)
    {
        $this->model = $model;
    }

    public function createUser(array $data): User
    {
        $user = $this->model->create($data);
        return $user->refresh();
    }

    public function findByEmail(string $email): ?User
    {
        return $this->model->where('email', $email)->first();
    }

    public function findById(int $id): ?User
    {
        return $this->model->find($id);
    }

    public function createTokenForUser(int $userId, string $deviceName = null): string
    {
        $user = $this->findById($userId);

        if (! $user) {
            throw new UserNotFoundException($userId);
        }

        $name = $deviceName ?? request()->userAgent() ?? 'auth_token';

        return $user->createToken($name)->plainTextToken;
    }


    public function deleteToken(int $userId, ?string $tokenId = null): void
    {
        $user = $this->findById($userId);
        if (! $user) {
            return;
        }

        if ($tokenId) {
            $user->tokens()->where('id', $tokenId)->delete();
        } else {
            $user->tokens()->delete();
        }
    }
}
