<?php

namespace Core\Services;

use Core\Repositories\UserRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;

class UserService
{
    protected UserRepositoryInterface $userRepo;

    public function __construct(UserRepositoryInterface $userRepo)
    {
        $this->userRepo = $userRepo;
    }

    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return $this->userRepo->paginate($perPage);
    }

    public function findById(int $id)
    {
        return $this->userRepo->findById($id);
    }

    public function findByEmail(string $email)
    {
        return $this->userRepo->findByEmail($email);
    }

    public function create(array $data)
    {
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }
        return $this->userRepo->create($data);
    }

    public function update(int $id, array $data)
    {
        unset($data['password']);
        return $this->userRepo->update($id, $data);
    }

    public function delete(int $id)
    {
        return $this->userRepo->delete($id);
    }
}
