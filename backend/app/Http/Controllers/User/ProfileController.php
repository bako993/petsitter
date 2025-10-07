<?php

namespace App\Http\Controllers\User;

use App\Exceptions\UserNotAllowedException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Profile\ProfileStoreRequest;
use App\Http\Requests\Profile\ProfileUpdateRequest;
use App\Http\Resources\Collections\ProfileCollection;
use App\Http\Resources\ProfileResource;
use Core\Services\ProfileService;
use Illuminate\Http\JsonResponse;

class ProfileController extends Controller
{
    protected ProfileService $profileService;
    public function __construct(ProfileService $profileService)
    {
        $this->profileService = $profileService;
    }

    public function index(): ProfileCollection
    {
        $profiles = $this->profileService->paginate(15, ['user']);

        return new ProfileCollection($profiles);
    }

    public function show(int $id): ProfileResource|JsonResponse
    {
        $profile = $this->profileService->findById($id, ['user']);

        if (!$profile) {
            return response()->json(['message' => 'Profile not found.'], 404);
        }

        return new ProfileResource($profile);
    }

    /**
     * @throws UserNotAllowedException
     */
    public function store(ProfileStoreRequest $request): ProfileResource
    {
        $data = $request->validated();

        $data['user_id'] = $request->user()->id;
        $data['profile_photo'] = $request->file('profile_photo');

        $profile = $this->profileService->create($data, $request->user(), $request->file('profile_photo'));

        return new ProfileResource($profile);
    }

    /**
     * @throws UserNotAllowedException
     */
    public function update(ProfileUpdateRequest $request, int $id): JsonResponse|ProfileResource
    {
        $data = $request->validated();

        $updatedProfile = $this->profileService->update($id, $data, $request->user(), $request->file('profile_photo'));

        if (!$updatedProfile) {
            return response()->json(['message' => 'Profile not found.'], 404);
        }

        return new ProfileResource($updatedProfile);
    }

    /**
     * @throws UserNotAllowedException
     */
    public function destroy(int $id): JsonResponse
    {
        $deleted = $this->profileService->delete($id,auth()->user());

        if (!$deleted) {
            return response()->json(['message' => 'Profile not found or delete failed'], 404);
        }

        return response()->json(null, 204);
    }
}
