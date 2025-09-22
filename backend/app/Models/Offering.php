<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\HigherOrderCollectionProxy;

/**
 * @method create(array $data)
 * @property HigherOrderCollectionProxy|mixed $id
 * @property mixed $profile_id
 * @property mixed $offering_type
 */
class Offering extends Model
{
    use HasFactory;

    protected $fillable = [
        'profile_id',
        'offering_type',
        'price',
        'conditions',
        'duration',
    ];

    protected $casts = [
        'conditions' => 'array',
        'price' => 'decimal:2',
        'duration' => 'integer',
    ];

    public function profile(): BelongsTo
    {
        return $this->belongsTo(Profile::class);
    }
}
