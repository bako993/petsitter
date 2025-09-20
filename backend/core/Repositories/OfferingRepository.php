<?php

namespace Core\Repositories;

use App\Models\Offering;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class OfferingRepository implements OfferingRepositoryInterface
{
    protected Offering $model;
    public function __construct(Offering $model)
    {
        $this->model = $model;
    }
    public function paginate(int $perPage = 15, array $with = []): LengthAwarePaginator
    {
        return $this->model->with($with)->paginate($perPage);
    }

    public function findById(int $id, array $with = []): ?Offering
    {
        return $this->model->with($with)->find($id);
    }

    public function create(array $data): Offering
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): ?Offering
    {
        $offering = $this->findById($id);
        if (!$offering) return null;

        $offering->update($data);
        return $offering;
    }

    public function delete(int $id): bool
    {
        $offering = $this->findById($id);
        if (!$offering) return false;

        return $offering->delete();
    }
}
