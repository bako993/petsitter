<?php

namespace Core\Services;

use App\Exceptions\NotFoundException;
use App\Exceptions\UserNotAllowedException;
use App\Policies\ProfilePolicy;
use Core\Repositories\ProfileRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;

class ProfileService
{
    protected ProfileRepositoryInterface $profileRepo;
    protected FileService $fileService;
    protected ProfilePolicy $policy;
    public function __construct(ProfileRepositoryInterface $profileRepo, ProfilePolicy $policy, FileService $fileService)
    {
        $this->profileRepo = $profileRepo;
        $this->policy      = $policy;
        $this->fileService = $fileService;
    }

    public function paginate(int $perPage = 15, array $with =[]): LengthAwarePaginator
    {
        return $this->profileRepo->paginate($perPage, $with);
    }

    public function findById(int $id, array $with =[])
    {
        return $this->profileRepo->findById($id, $with);
    }

    /**
     * @throws UserNotAllowedException
     */
    public function create(array $data, $authUser, ?UploadedFile $photo = null)
    {
        if (!$this->policy->create($authUser->id, $authUser->role, $data['user_id'])) {
            throw new UserNotAllowedException();
        }

        if ($photo) {
            $data['profile_photo'] = $this->fileService->upload($photo, 'profiles');
        }

        $profile = $this->profileRepo->create($data);

        if ($authUser->type !== 'sitter') {
            $authUser->type = 'sitter';
            $authUser->save();
        }

        return $profile;
    }

    /**
     * @throws UserNotAllowedException
     */
    public function update(int $id, array $data, $authUser, ?UploadedFile $photo = null)
    {
        $profile = $this->profileRepo->findById($id);

        if (!$profile) {
            throw new NotFoundException('profile', $id);
        }

        if (!$this->policy->update($authUser->id, $authUser->role, $profile->user_id)) {
            throw new UserNotAllowedException();
        }

        if ($photo) {
            $data['profile_photo'] = $this->fileService->upload($photo, 'profiles');
            if ($profile->profile_photo) {
                $this->fileService->delete($profile->profile_photo);
            }
        }

        return $this->profileRepo->update($id, $data);
    }

    /**
     * @throws UserNotAllowedException
     */
    public function delete(int $id, $authUser): bool
    {
        $profile = $this->profileRepo->findById($id);

        if (!$profile) {
            return false;
        }

        if (!$this->policy->delete($authUser->id, $authUser->role, $profile->user_id)) {
            throw new UserNotAllowedException();
        }

        if ($profile->profile_photo) {
            $this->fileService->delete($profile->profile_photo);
        }

        return $this->profileRepo->delete($id);
    }
}
