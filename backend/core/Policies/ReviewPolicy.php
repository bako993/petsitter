<?php

namespace Core\Policies;

class ReviewPolicy
{
    public function create(int $authUserId, string $authUserRole, int $profileUserId): bool
    {
        return $authUserRole === 'admin' || $authUserId === $profileUserId;
    }

    public function update(int $authUserId, string $authUserRole, int $reviewProfileUserId): bool
    {
        return $authUserRole === 'admin' || $authUserId === $reviewProfileUserId;
    }

    public function delete(int $authUserId, string $authUserRole, int $reviewProfileUserId): bool
    {
        return $authUserRole === 'admin' || $authUserId === $reviewProfileUserId;
    }
}
