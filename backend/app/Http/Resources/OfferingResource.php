<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property mixed $id
 * @property mixed $offering_type
 * @property mixed $price
 * @property mixed $conditions
 * @property mixed $duration
 * @property mixed $profile_id
 * @property mixed $created_at
 * @property mixed $updated_at
 */
class OfferingResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'offering_type' => $this->offering_type,
            'price' => (float) $this->price,
            'conditions' => $this->conditions,
            'duration' => $this->duration,
            'profile_id' => $this->profile_id,
            'profile' => new ProfileResource($this->whenLoaded('profile')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
