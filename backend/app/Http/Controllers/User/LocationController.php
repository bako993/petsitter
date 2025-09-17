<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\Location\LocationStoreRequest;
use App\Http\Requests\Location\LocationUpdateRequest;
use App\Http\Resources\Collections\LocationCollection;
use App\Http\Resources\LocationResource;
use Core\Services\LocationService;
use Illuminate\Http\JsonResponse;

class LocationController extends Controller
{
    protected LocationService $locationService;
    public function __construct(LocationService $locationService)
    {
        $this->locationService = $locationService;
    }

    public function index(): LocationCollection
    {
        $locations = $this->locationService->paginate(15, ['user']);

        return new LocationCollection($locations);
    }
    public function show(int $id): LocationResource|JsonResponse
    {
        $location = $this->locationService->findById($id, ['user']);

        if (!$location) {
            return response()->json(['message' => 'Location not found'], 404);
        }

        return new LocationResource($location);
    }

    public function store(LocationStoreRequest $request): LocationResource
    {
        $location = $this->locationService->create($request->validated());

        return new LocationResource($location);
    }

    public function update(int $id, LocationUpdateRequest $request): JsonResponse
    {
        $location = $this->locationService->update($id, $request->validated());
        if (!$location) {
            return response()->json(['message' => 'Location not found'], 404);
        }

        return response()->json([
            'message' => 'Location updated successfully',
            'location' => new LocationResource($location),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
     $delete = $this->locationService->delete($id);
     if (!$delete) {
         return response()->json(['message' => 'Location not found'], 404);
     }

     return response()->json(null,204);
    }
}
