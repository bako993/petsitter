<?php

namespace Core\Services;

use Core\Repositories\ProfileRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;

class ProfileService
{
    protected ProfileRepositoryInterface $profileRepo;
    protected FileService $fileService;
    public function __construct(ProfileRepositoryInterface $profileRepo, FileService $fileService)
    {
        $this->profileRepo = $profileRepo;
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

    public function create(array $data, ?UploadedFile $photo = null)
    {
        if ($photo) {
            $data['profile_photo'] = $this->fileService->upload($photo, 'profiles');
        }

        return $this->profileRepo->create($data);
    }

    public function update(int $id, array $data, ?UploadedFile $photo = null)
    {
        $profile = $this->profileRepo->findById($id);

        if ($photo) {
            if ($profile->profile_photo) {
                $this->fileService->delete($profile->profile_photo);
            }
            $data['profile_photo'] = $this->fileService->upload($photo, 'profiles');
        }

        return $this->profileRepo->update($id, $data);
    }

    public function delete(int $id): bool
    {
        $profile = $this->profileRepo->findById($id);
        if (!$profile) return false;

        if ($profile->profile_photo) {
            $this->fileService->delete($profile->profile_photo);
        }

        return $this->profileRepo->delete($id);
    }
}
