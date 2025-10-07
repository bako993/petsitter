<?php

namespace Core\Repositories;

use App\Models\User;

interface AuthRepositoryInterface
{
    public function createUser(array $data): User;
    public function findByEmail(string $email): ?User;
    public function findById(int $id): ?User;
    public function createTokenForUser(int $userId, string $deviceName = null): string;
    public function deleteToken(int $userId, ?string $tokenId = null): void;
}
