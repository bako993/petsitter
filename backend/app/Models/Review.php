<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\HigherOrderCollectionProxy;

/**
 * @method create(array $data)
 * @property HigherOrderCollectionProxy|mixed $id
 * @property mixed $rating
 */
class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'profile_id',
        'rating',
        'comment',
    ];

    public function profile(): BelongsTo
    {
        return $this->belongsTo(Profile::class);
    }
}
