<?php

namespace Core\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class FileService
{
    /**
     * Upload a file and return its public path.
     */
    public function upload(UploadedFile $file, string $directory): string
    {
        $path = $file->store($directory, 'public');
        return '/storage/' . $path;
    }

    /**
     * Delete a file by its path.
     */
    public function delete(string $path): bool
    {
        $relativePath = str_replace('/storage/', '', $path);
        return Storage::disk('public')->delete($relativePath);
    }
}
