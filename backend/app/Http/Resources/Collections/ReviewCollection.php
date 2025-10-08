<?php

namespace App\Http\Resources\Collections;
use App\Http\Resources\ReviewResource;
use Illuminate\Http\Resources\Json\ResourceCollection;

/**
 * @method currentPage()
 * @method lastPage()
 * @method perPage()
 * @method total()
 * @method url(int $int)
 * @method previousPageUrl()
 * @method nextPageUrl()
 */
class ReviewCollection extends ResourceCollection
{
    public $collects = ReviewResource::class;
    public function toArray($request): array
    {
        return [
            'data' => $this->collection,
            'meta' => [
                'current_page' => $this->currentPage(),
                'last_page' => $this->lastPage(),
                'per_page' => $this->perPage(),
                'total' => $this->total(),
            ],
            'links' => [
                'first' => $this->url(1),
                'last' => $this->url($this->lastPage()),
                'prev' => $this->previousPageUrl(),
                'next' => $this->nextPageUrl(),
            ],
        ];
    }
}
