<?php

namespace Core\Services;

use Core\Repositories\OfferingRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use RuntimeException;

class OfferingService
{
    protected OfferingRepositoryInterface $offeringRepo;
    public function __construct(OfferingRepositoryInterface $offeringRepo)
    {
        $this->offeringRepo = $offeringRepo;
    }

    public function paginate(int $perPage = 15, array $with =[]): LengthAwarePaginator
    {
        return $this->offeringRepo->paginate($perPage, $with);
    }

    public function findById(int $id, array $with =[])
    {
        return $this->offeringRepo->findById($id, $with);
    }

    public function create(array $data)
    {
        if (!isset($data['profile_id'])) {
            throw new RuntimeException('Profile ID is required to create an offering.');
        }

        return $this->offeringRepo->create($data);
    }

    public function update(int $id, array $data)
    {
        return $this->offeringRepo->update($id, $data);
    }

    public function delete(int $id)
    {
        return $this->offeringRepo->delete($id);
    }
}
