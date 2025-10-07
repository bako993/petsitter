<?php

namespace App\Http\Controllers\User;

use App\Exceptions\UserNotAllowedException;
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

    /**
     * @throws UserNotAllowedException
     */
    public function store(LocationStoreRequest $request): LocationResource
    {
        $data = $request->validated();
        $data['user_id'] = $request->user()->id;

        $location = $this->locationService->create($data, auth()->user());

        return new LocationResource($location);
    }

    /**
     * @throws UserNotAllowedException
     */
    public function update(int $id, LocationUpdateRequest $request): JsonResponse
    {
        $data = $request->validated();

        $location = $this->locationService->update($id, $data, auth()->user());

        if (!$location) {
            return response()->json(['message' => 'Location not found'], 404);
        }

        return response()->json(
            [
                'message' => 'Location updated successfully',
                'location' => new LocationResource($location),
            ]
        );
    }

    /**
     * @throws UserNotAllowedException
     */
    public function destroy(int $id): JsonResponse
    {
        $delete = $this->locationService->delete($id, auth()->user());

        if (!$delete) {
            return response()->json(['message' => 'Location not found'], 404);
        }

        return response()->json(null, 204);
    }
}
