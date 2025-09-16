<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\UserStoreRequest;
use App\Http\Requests\User\UserUpdateRequest;
use App\Http\Resources\Collections\UserCollection;
use App\Http\Resources\UserResource;
use Core\Services\UserService;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    protected UserService $userService;
    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function index(): UserCollection
    {
        $users = $this->userService->paginate();
        return new UserCollection($users);
    }

    public function show(int $id): UserResource|JsonResponse
    {
        $user = $this->userService->findById($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        return new UserResource($user);
    }

    public function store(UserStoreRequest $request): UserResource
    {
        $user = $this->userService->create($request->validated());
        return new UserResource($user);
    }

    public function update(UserUpdateRequest $request, int $id): JsonResponse
    {
        $updated = $this->userService->update($id, $request->validated());
        if (!$updated) {
            return response()->json(['message' => 'User not found or update failed'], 404);
        }
        return response()->json([
            'message' => 'User updated successfully',
            'user' => new UserResource($updated),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $deleted = $this->userService->delete($id);
        if (!$deleted) {
            return response()->json(['message' => 'User not found or delete failed'], 404);
        }

        return response()->json(null, 204);
    }
}
