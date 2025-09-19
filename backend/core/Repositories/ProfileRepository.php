<?php

namespace Core\Repositories;

use App\Models\Profile;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ProfileRepository implements ProfileRepositoryInterface
{
    protected Profile $model;

    public function __construct(Profile $model)
    {
        $this->model = $model;
    }

    public function paginate(int $perPage = 15, array $with = []): LengthAwarePaginator
    {
        return $this->model->with($with)->paginate($perPage);
    }

    public function findById(int $id, array $with = []): ?Profile
    {
        return $this->model->with($with)->find($id);
    }

    public function create(array $data): Profile
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): ?Profile
    {
        $profile = $this->findById($id);
        if (!$profile) return null;

        $profile->update($data);
        return $profile;
    }

    public function delete(int $id): bool
    {
        $profile = $this->findById($id);
        if (!$profile) return false;

        return $profile->delete();
    }
}
