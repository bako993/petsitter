<?php

namespace App\Policies;

class UserPolicy
{
    public function viewAny(string $authUserRole): bool
    {
        return $authUserRole === 'admin';
    }

    public function view(int $authUserId, string $authUserRole, int $targetUserId): bool
    {
        return $authUserRole === 'admin' || $authUserId === $targetUserId;
    }

    public function create(string $authUserRole): bool
    {
        return $authUserRole === 'admin';
    }

    public function update(int $authUserId, string $authUserRole, int $targetUserId): bool
    {
        return $authUserRole === 'admin' || $authUserId === $targetUserId;
    }

    public function delete(int $authUserId, string $authUserRole, int $targetUserId): bool
    {
        return $authUserRole === 'admin' || $authUserId === $targetUserId;
    }
}
