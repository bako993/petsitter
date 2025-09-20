<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property mixed $created_at
 * @property mixed $updated_at
 * @property mixed $id
 * @property mixed $profile_photo
 * @property mixed $bio
 * @property mixed $phone
 * @property mixed $experience
 * @property mixed $availability
 */
class ProfileResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'profile_photo' => $this->profile_photo,
            'bio' => $this->bio,
            'phone' => $this->phone,
            'experience' => $this->experience,
            'availability' => $this->availability,
            'user' => new UserResource($this->whenLoaded('user')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
