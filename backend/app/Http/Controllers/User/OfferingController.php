<?php

namespace App\Http\Controllers\User;

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

    public function store(OfferingStoreRequest $request): OfferingResource|JsonResponse
    {
        $profile = $request->user()->profile;
        if (!$profile) {
            return response()->json(['message' => 'Create a profile first.'], 422);
        }

        $data = $request->validated();
        $data['profile_id'] = $profile->id;

        $offering = $this->offeringService->create($data);

        return new OfferingResource($offering);
    }

    public function update(int $id, OfferingUpdateRequest $request): JsonResponse
    {
        $offering = $this->offeringService->update($id, $request->validated());

        if (!$offering) {
            return response()->json(['message' => 'Offering not found'], 404);
        }

        return response()->json(
            [
                'message' => 'Offering updated successfully',
                'offering' => new OfferingResource($offering),
            ]
        );
    }

    public function destroy(int $id): JsonResponse
    {
        $delete = $this->offeringService->delete($id);

        if (!$delete) {
            return response()->json(['message' => 'Offering not found'], 404);
        }

        return response()->json(null, 204);
    }
}
