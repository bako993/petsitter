<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\HigherOrderCollectionProxy;

/**
 * @property mixed $postal_code
 * @property mixed $city
 * @property mixed $street
 * @property mixed $house_number
 * @property HigherOrderCollectionProxy|mixed $id
 * @property mixed $user_id
 * @method paginate(int $perPage)
 * @method find(int $id)
 * @method create(array $data)
 */
class Location extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'latitude',
        'longitude',
        'city',
        'postal_code',
        'street',
        'house_number',
    ];

    protected $appends = ['full_address'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getFullAddressAttribute(): ?string
    {
        $parts = [
            trim(($this->street ?? '') . ' ' . ($this->house_number ?? '')),
            $this->postal_code,
            $this->city,
        ];

        return implode(', ', array_filter($parts));
    }
}
