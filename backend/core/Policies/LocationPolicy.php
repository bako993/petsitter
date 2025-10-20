<?php

namespace Core\Policies;

class LocationPolicy
{
    public function create(int $authUserId, string $authUserRole, int $ownerUserId): bool
    {
        return $authUserRole === 'admin' || $authUserId === $ownerUserId;
    }

    public function update(int $authUserId, string $authUserRole, int $ownerUserId): bool
    {
        return $authUserRole === 'admin' || $authUserId === $ownerUserId;
    }

    public function delete(int $authUserId, string $authUserRole, int $ownerUserId): bool
    {
        return $authUserRole === 'admin' || $authUserId === $ownerUserId;
    }
}
