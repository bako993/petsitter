<?php

namespace Core\Repositories;

use App\Models\Review;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ReviewRepository implements ReviewRepositoryInterface
{
    protected Review $model;
    public function __construct(Review $model)
    {
        $this->model = $model;
    }
    public function paginate(int $perPage = 15, array $with = []): LengthAwarePaginator
    {
        return $this->model->with($with)->paginate($perPage);
    }

    public function findById(int $id, array $with = []): ?Review
    {
        return $this->model->with($with)->find($id);
    }

    public function create(array $data): Review
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): ?Review
    {
        $review = $this->findById($id);
        if (!$review) {
            return null;
        }

        $review->update($data);
        return $review;
    }

    public function delete(int $id): bool
    {
        $review = $this->findById($id);

        return $review ? $review->delete() : false;
    }
}
