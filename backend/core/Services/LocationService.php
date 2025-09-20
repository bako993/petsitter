<?php

namespace Core\Services;

use Core\Repositories\LocationRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class LocationService
{
    protected LocationRepositoryInterface $locationRepo;
    public function __construct(LocationRepositoryInterface $locationRepo)
    {
        $this->locationRepo = $locationRepo;
    }

    public function paginate(int $perPage = 15, array $with =[]): LengthAwarePaginator
    {
        return $this->locationRepo->paginate($perPage, $with);
    }

    public function findById(int $id, array $with =[])
    {
        return $this->locationRepo->findById($id, $with);
    }

    public function create(array $data)
    {
        return $this->locationRepo->create($data);
    }

    public function update(int $id, array $data)
    {
        return $this->locationRepo->update($id, $data);
    }

    public function delete(int $id)
    {
        return $this->locationRepo->delete($id);
    }
}
