<?php

namespace Core\Policies;

class OfferingPolicy
{
    public function create(int $authUserId, string $authUserRole, int $targetUserId): bool
    {
        return $authUserRole === 'admin' || $authUserId === $targetUserId;
    }

    public function update(int $authUserId, string $authUserRole, int $profileUserId): bool
    {
        return $authUserRole === 'admin' || $authUserId === $profileUserId;
    }

    public function delete(int $authUserId, string $authUserRole, int $profileUserId): bool
    {
        return $authUserRole === 'admin' || $authUserId === $profileUserId;
    }
}
