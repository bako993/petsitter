<?php

namespace Core\Repositories;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class UserRepository implements UserRepositoryInterface
{
    protected User $model;
    public function __construct(User $model)
    {
        $this->model = $model;
    }

    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->paginate($perPage);
    }

    public function findById(int $id): ?User
    {
        return $this->model->find($id);
    }

    public function findByEmail(string $email): ?User
    {
        return $this->model->where('email', $email)->first();
    }

    public function create(array $data): User
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): ?User
    {
        $user = $this->findById($id);
        if (!$user) return null;

        $user->update($data);
        return $user;
    }

    public function delete(int $id): bool
    {
        $user = $this->findById($id);
        if (!$user) return false;

        return $user->delete();
    }

}
