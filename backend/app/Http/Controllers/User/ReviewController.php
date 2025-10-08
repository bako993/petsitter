<?php

namespace App\Http\Controllers\User;

use App\Exceptions\UserNotAllowedException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Review\ReviewStoreRequest;
use App\Http\Requests\Review\ReviewUpdateRequest;
use App\Http\Resources\Collections\ReviewCollection;
use App\Http\Resources\ReviewResource;
use Core\Services\ReviewService;
use Illuminate\Http\JsonResponse;

class ReviewController extends Controller
{
    protected ReviewService $reviewService;
    public function __construct(ReviewService $reviewService)
    {
        $this->reviewService = $reviewService;
    }

    public function index(): ReviewCollection
    {
        $reviews = $this->reviewService->paginate();

        return new ReviewCollection($reviews);
    }

    public function show(int $id): ReviewResource|JsonResponse
    {
        $review = $this->reviewService->findById($id);

        return new ReviewResource($review);
    }

    /**
     * @throws UserNotAllowedException
     */
    public function store(ReviewStoreRequest $request): ReviewResource|JsonResponse
    {
        $review = $this->reviewService->create($request->validated(), $request->user());

        return new ReviewResource($review);
    }


    /**
     * @throws UserNotAllowedException
     */
    public function update(int $id, ReviewUpdateRequest $request): JsonResponse
    {
        $review = $this->reviewService->update($id, $request->validated(), $request->user());

        return response()->json(
            [
                'message' => 'Offering updated successfully',
                'offering' => new ReviewResource($review),
            ]
        );
    }

    /**
     * @throws UserNotAllowedException
     */
    public function destroy(int $id): JsonResponse
    {
        $delete = $this->reviewService->delete($id, auth()->user());

        if (!$delete) {
            return response()->json(['message' => 'Review not found'], 404);
        }

        return response()->json([
            'message' => 'Review deleted successfully.',
        ], 204);
    }
}
