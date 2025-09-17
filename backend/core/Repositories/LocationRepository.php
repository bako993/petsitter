<?php

namespace Core\Repositories;

use App\Models\Location;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class LocationRepository implements LocationRepositoryInterface
{
    protected Location $model;
    public function __construct(Location $model)
    {
        $this->model = $model;
    }

    public function paginate(int $perPage = 15, array $with =[]): LengthAwarePaginator
    {
        return $this->model->with($with)->paginate($perPage);
    }

    public function findById(int $id, array $with =[]): ?Location
    {
        return $this->model->with($with)->find($id);
    }

    public function create(array $data): Location
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): ?Location
    {
        $location = $this->findById($id);
        if (!$location) return null;

        $location->update($data);
        return $location;
    }

    public function delete(int $id): bool
    {
        $location = $this->findById($id);
        if (!$location) return false;

        return $location->delete();
    }
}
