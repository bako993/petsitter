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

    public function paginate(int $perPage = 15, array $with =[]): LengthAwarePaginator
    {
        return $this->userRepo->paginate($perPage, $with);
    }

    public function findById(int $id, array $with =[])
    {
        return $this->userRepo->findById($id, $with);
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
