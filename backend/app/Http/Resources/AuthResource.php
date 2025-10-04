<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AuthResource extends JsonResource
{
    protected string $token;
    protected ?string $expiresAt;

    public function __construct($resource, string $token, ?string $expiresAt = null)
    {
        parent::__construct($resource);
        $this->token = $token;
        $this->expiresAt = $expiresAt;
    }

    public function toArray($request): array
    {
        return [
            'user' => new UserResource($this->resource),
            'token' => $this->token,
            'expires_at' => $this->expiresAt,
        ];
    }
}
