<?php

namespace App\Http\Controllers\User;

use App\Exceptions\UserNotAllowedException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Offering\OfferingStoreRequest;
use App\Http\Requests\Offering\OfferingUpdateRequest;
use App\Http\Resources\Collections\OfferingCollection;
use App\Http\Resources\OfferingResource;
use Core\Services\OfferingService;
use Illuminate\Http\JsonResponse;

class OfferingController extends Controller
{
    protected OfferingService $offeringService;
    public function __construct(OfferingService $offeringService)
    {
        $this->offeringService = $offeringService;
    }

    public function index(): OfferingCollection
    {
        $offerings = $this->offeringService->paginate(15, ['profile']);

        return new OfferingCollection($offerings);
    }

    public function show(int $id): OfferingResource|JsonResponse
    {
        $offering = $this->offeringService->findById($id, ['profile']);

        if (!$offering) {
            return response()->json(['message' => 'Offering not found'], 404);
        }

        return new OfferingResource($offering);
    }

    /**
     * @throws UserNotAllowedException
     */
    public function store(OfferingStoreRequest $request): OfferingResource|JsonResponse
    {
        $offering = $this->offeringService->create($request->validated(), $request->user());

        return new OfferingResource($offering);
    }

    /**
     * @throws UserNotAllowedException
     */
    public function update(int $id, OfferingUpdateRequest $request): JsonResponse
    {
        $offering = $this->offeringService->update($id, $request->validated(), $request->user());

        return response()->json(
            [
                'message' => 'Offering updated successfully',
                'offering' => new OfferingResource($offering),
            ]
        );
    }

    /**
     * @throws UserNotAllowedException
     */
    public function destroy(int $id): JsonResponse
    {
        $delete = $this->offeringService->delete($id, auth()->user());

        if (!$delete) {
            return response()->json(['message' => 'Offering not found'], 404);
        }

        return response()->json(null, 204);
    }
}
