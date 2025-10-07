<?php

namespace Core\Services;

use App\Exceptions\NotFoundException;
use App\Exceptions\UserNotAllowedException;
use App\Policies\LocationPolicy;
use Core\Repositories\LocationRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class LocationService
{
    protected LocationRepositoryInterface $locationRepo;
    protected LocationPolicy $policy;

    public function __construct(LocationRepositoryInterface $locationRepo, LocationPolicy $policy)
    {
        $this->locationRepo = $locationRepo;
        $this->policy = $policy;
    }

    public function paginate(int $perPage = 15, array $with =[]): LengthAwarePaginator
    {
        return $this->locationRepo->paginate($perPage, $with);
    }

    public function findById(int $id, array $with =[])
    {
        return $this->locationRepo->findById($id, $with);
    }

    /**
     * @throws UserNotAllowedException
     */
    public function create(array $data, $authUser)
    {
        if (!$this->policy->create($authUser->id, $authUser->role, $data['user_id'])) {
            throw new UserNotAllowedException();
        }

        return $this->locationRepo->create($data);
    }

    /**
     * @throws UserNotAllowedException
     */
    public function update(int $id, array $data, $authUser)
    {
        $location = $this->locationRepo->findById($id);
        if (!$location) {
            throw new NotFoundException('location', $id);
        }

        if (!$this->policy->update($authUser->id, $authUser->role, $location->user_id)) {
            throw new UserNotAllowedException();
        }

        return $this->locationRepo->update($id, $data);
    }

    /**
     * @throws UserNotAllowedException
     */
    public function delete(int $id, $authUser)
    {
        $location = $this->locationRepo->findById($id);
        if (!$location) {
            throw new NotFoundException('location', $id);
        }

        if (!$this->policy->delete($authUser->id, $authUser->role, $location->user_id)) {
            throw new UserNotAllowedException();
        }

        return $this->locationRepo->delete($id);
    }
}
