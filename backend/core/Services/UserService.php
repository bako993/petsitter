<?php

namespace Core\Services;

use App\Exceptions\UserNotAllowedException;
use App\Policies\UserPolicy;
use Core\Repositories\UserRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;

class UserService
{
    protected UserRepositoryInterface $userRepo;
    protected UserPolicy $policy;

    public function __construct(UserRepositoryInterface $userRepo, UserPolicy $policy)
    {
        $this->userRepo = $userRepo;
        $this->policy = $policy;
    }

    /**
     * @throws UserNotAllowedException
     */
    public function paginate(int $perPage, $authUser): LengthAwarePaginator
    {
        if (!$this->policy->viewAny($authUser->role)) {
            throw new UserNotAllowedException();
        }

        return $this->userRepo->paginate($perPage);
    }
    /**
     * @throws UserNotAllowedException
     */
    public function findById(int $id, $authUser)
    {
        if (!$this->policy->view($authUser->id, $authUser->role, $id)) {
            throw new UserNotAllowedException("Not allowed to view this user.");
        }

        return $this->userRepo->findById($id);
    }
    /**
     * @throws UserNotAllowedException
     */
    public function create(array $data, $authUser)
    {
        if (!$this->policy->create($authUser->role)) {
            throw new UserNotAllowedException("Not allowed to create user.");
        }

        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        return $this->userRepo->create($data);
    }
    /**
     * @throws UserNotAllowedException
     */
    public function update(int $id, array $data, $authUser)
    {
        if (!$this->policy->update($authUser->id, $authUser->role, $id)) {
            throw new UserNotAllowedException("Not allowed to update this user.");
        }

        unset($data['password']);
        return $this->userRepo->update($id, $data);
    }
    /**
     * @throws UserNotAllowedException
     */
    public function delete(int $id, $authUser)
    {
        if (!$this->policy->delete($authUser->role)) {
            throw new UserNotAllowedException("Not allowed to delete user.");
        }

        return $this->userRepo->delete($id);
    }
}
