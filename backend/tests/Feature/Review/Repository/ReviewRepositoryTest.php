<?php

namespace Tests\Feature\Review\Repository;

use App\Models\Profile;
use App\Models\Review;
use App\Models\User;
use Core\Repositories\ReviewRepositoryInterface;
use Tests\Feature\Review\ReviewTestCase;

class ReviewRepositoryTest extends ReviewTestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        $this->repository = app(ReviewRepositoryInterface::class);
    }

    public function testPaginateReviews(): void
    {
        $this->createModels(Review::class, 20);

        $result = $this->repository->paginate();

        $this->assertCount(15, $result->items());
        $this->assertEquals(20, $result->total());
        $this->assertEquals(1, $result->currentPage());
        $this->assertEquals(2, $result->lastPage());
    }

    public function testFindByIdReturnsReview(): void
    {
        $review = $this->createModel(Review::class);
        $found = $this->repository->findById($review->id);

        $this->assertInstanceOf(Review::class, $found);
        $this->assertEquals($review->id, $found->id);
    }

    public function testFindByIdReturnsReviewNotFound(): void
    {
        $this->assertNull($this->repository->findById(999));
    }

    public function testCreateReview(): void
    {
        $user = $this->createModel(User::class);
        $profile = $this->createModel(Profile::class, ['user_id' => $user->id]);

        $data = [
            'user_id' => $user->id,
            'profile_id' => $profile->id,
            'rating' => 5,
            'comment' => 'Great sitter!',
        ];

        $review = $this->repository->create($data);
        $this->assertInstanceOf(Review::class, $review);
        $this->assertDatabaseHas('reviews', ['rating' => 5]);
    }

    public function testUpdateReview(): void
    {
        $review = $this->createModel(Review::class, ['rating' => 3]);

        $updated = $this->repository->update($review->id, ['rating' => 4]);

        $this->assertInstanceOf(Review::class, $updated);
        $this->assertEquals(4, $updated->rating);
        $this->assertDatabaseHas('reviews', ['rating' => 4]);
    }

    public function testUpdateReturnsReviewNotFound(): void
    {
        $this->assertNull($this->repository->update(999, ['rating' => 5]));
    }

    public function testDeleteReview(): void
    {
        $review = $this->createModel(Review::class);

        $deleted = $this->repository->delete($review->id);

        $this->assertTrue($deleted);
        $this->assertDatabaseMissing('reviews', ['id' => $review->id]);
    }

    public function testDeleteReturnsReviewNotFound(): void
    {
        $this->assertFalse($this->repository->delete(999));
    }

    public function testFindByIdWithRelations(): void
    {
        $review = $this->createModel(Review::class);

        $found = $this->repository->findById($review->id, ['profile']);

        $this->assertTrue($found->relationLoaded('profile'));
    }
}
