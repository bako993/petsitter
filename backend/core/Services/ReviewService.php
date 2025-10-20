<?php

namespace Core\Services;

use App\Exceptions\UserNotAllowedException;
use Core\Policies\ReviewPolicy;
use Core\Repositories\ReviewRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ReviewService
{
    protected ReviewRepositoryInterface $reviewRepo;
    protected ReviewPolicy $policy;
    public function __construct(ReviewRepositoryInterface $reviewRepo, ReviewPolicy $policy)
    {
        $this->reviewRepo = $reviewRepo;
        $this->policy     = $policy;
    }

    public function paginate(int $perPage = 15, array $with = []): LengthAwarePaginator
    {
        return $this->reviewRepo->paginate($perPage, $with);
    }

    public function findById(int $id, array $with = [])
    {
        return $this->reviewRepo->findById($id, $with);
    }

    /**
     * @throws UserNotAllowedException
     */
    public function create(array $data, $authUser)
    {
        $data['user_id'] = $authUser->id;

        if (! $this->policy->create($authUser->id, $authUser->role, $authUser->id)) {
            throw new UserNotAllowedException();
        }

        return $this->reviewRepo->create($data);
    }

    /**
     * @throws UserNotAllowedException
     */
    public function update(int $id, array $data, $authUser)
    {
        $review = $this->reviewRepo->findById($id);

        if (! $this->policy->update($authUser->id, $authUser->role, $review->profile->user_id)) {
            throw new UserNotAllowedException();
        }

        return $this->reviewRepo->update($id, $data);
    }

    /**
     * @throws UserNotAllowedException
     */
    public function delete(int $id, $authUser): bool
    {
        $review = $this->reviewRepo->findById($id);

        if (! $this->policy->delete($authUser->id, $authUser->role, $review->profile->user_id)) {
            throw new UserNotAllowedException();
        }

        return $this->reviewRepo->delete($id);
    }
}
