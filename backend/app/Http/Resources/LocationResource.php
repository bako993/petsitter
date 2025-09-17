<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property mixed $id
 * @property mixed $latitude
 * @property mixed $longitude
 * @property mixed $city
 * @property mixed $postal_code
 * @property mixed $street
 * @property mixed $house_number
 * @property mixed $full_address
 * @property mixed $created_at
 * @property mixed $updated_at
 */
class LocationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'city' => $this->city,
            'postal_code' => $this->postal_code,
            'street' => $this->street,
            'house_number' => $this->house_number,
            'full_address' => $this->full_address,
            'user' => new UserResource($this->whenLoaded('user')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
