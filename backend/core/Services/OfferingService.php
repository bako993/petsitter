<?php

namespace Core\Services;

use App\Exceptions\NotFoundException;
use App\Exceptions\UserNotAllowedException;
use App\Policies\OfferingPolicy;
use Core\Repositories\OfferingRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use PHPUnit\Framework\InvalidDataProviderException;

class OfferingService
{
    protected OfferingRepositoryInterface $offeringRepo;
    protected OfferingPolicy $policy;
    public function __construct(OfferingRepositoryInterface $offeringRepo, OfferingPolicy $policy)
    {
        $this->offeringRepo = $offeringRepo;
        $this->policy       = $policy;
    }

    public function paginate(int $perPage = 15, array $with =[]): LengthAwarePaginator
    {
        return $this->offeringRepo->paginate($perPage, $with);
    }

    public function findById(int $id, array $with =[])
    {
        return $this->offeringRepo->findById($id, $with);
    }

    /**
     * @throws UserNotAllowedException
     */
    public function create(array $data, $authUser)
    {
        $profile = $authUser->profile;
        if (!$profile) {
            throw new InvalidDataProviderException('User does not have a profile.');
        }

        if (!$this->policy->create($authUser->id, $authUser->role, $profile->user_id)) {
            throw new UserNotAllowedException();
        }

        $data['profile_id'] = $profile->id;

        return $this->offeringRepo->create($data);
    }

    /**
     * @throws UserNotAllowedException
     */
    public function update(int $id, array $data, $authUser)
    {
        $offering = $this->offeringRepo->findById($id);
        if (!$offering) {
            throw new NotFoundException('offering', $id);
        }

        if (!$this->policy->update($authUser->id, $authUser->role, $offering->profile->user_id)) {
            throw new UserNotAllowedException();
        }

        return $this->offeringRepo->update($id, $data);
    }

    /**
     * @throws UserNotAllowedException
     */
    public function delete(int $id, $authUser)
    {
        $offering = $this->offeringRepo->findById($id);

        $profileUserId = $offering->profile->user_id;

        if (!$offering) {
            throw new NotFoundException('offering', $id);
        }

        if (!$this->policy->delete($authUser->id, $authUser->role, $profileUserId)) {
            throw new UserNotAllowedException();
        }

        return $this->offeringRepo->delete($id);
    }
}
