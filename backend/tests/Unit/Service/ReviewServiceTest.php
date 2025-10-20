<?php

namespace Service;

use App\Exceptions\UserNotAllowedException;
use App\Models\Profile;
use App\Models\Review;
use App\Models\User;
use Core\Policies\ReviewPolicy;
use Core\Repositories\ReviewRepositoryInterface;
use Core\Services\ReviewService;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Mockery;
use Tests\Fixtures\FixtureHelpers;
use Tests\TestCase;

class ReviewServiceTest extends TestCase
{
    use FixtureHelpers;

    protected ReviewService $service;
    protected ReviewRepositoryInterface $reviewRepoMock;
    protected ReviewPolicy $reviewPolicyMock;
    protected User $authUser;

    protected function setUp(): void
    {
        parent::setUp();

        $this->reviewRepoMock = $this->mockRepository(ReviewRepositoryInterface::class);
        $this->reviewPolicyMock = Mockery::mock(ReviewPolicy::class);

        $this->reviewPolicyMock->shouldReceive('viewAny')->andReturn(true);
        $this->reviewPolicyMock->shouldReceive('view')->andReturn(true);
        $this->reviewPolicyMock->shouldReceive('create')->andReturn(true);
        $this->reviewPolicyMock->shouldReceive('update')->andReturn(true);
        $this->reviewPolicyMock->shouldReceive('delete')->andReturn(true);

        $this->service = new ReviewService($this->reviewRepoMock, $this->reviewPolicyMock);

        $this->authUser = $this->makeModel(User::class, [
            'id' => 1,
            'role' => 'admin',
        ]);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_paginate_reviews(): void
    {
        $items = new Collection([]);
        $mockResult = new LengthAwarePaginator($items, $items->count(), 15, 1);

        $this->reviewRepoMock
            ->shouldReceive('paginate')
            ->once()
            ->with(15, [])
            ->andReturn($mockResult);

        $result = $this->service->paginate();
        $this->assertSame($mockResult, $result);
    }

    public function test_find_review_by_id(): void
    {
        $mockReview = $this->makeModel(Review::class, ['id' => 123]);

        $this->reviewRepoMock
            ->shouldReceive('findById')
            ->once()
            ->with($mockReview->id, [])
            ->andReturn($mockReview);

        $result = $this->service->findById($mockReview->id);
        $this->assertSame($mockReview, $result);
    }

    /**
     * @throws UserNotAllowedException
     */
    public function test_creates_review(): void
    {
        $profile = $this->makeModel(Profile::class, ['user_id' => $this->authUser->id]);
        $this->authUser->setRelation('profile', $profile);

        $data = [
            'profile_id' => $profile->id,
            'rating' => 5,
            'comment' => 'Excellent sitter!',
        ];

        $mockReview = $this->makeModel(Review::class, $data);

        $this->reviewRepoMock
            ->shouldReceive('create')
            ->once()
            ->with(array_merge($data, ['user_id' => $this->authUser->id]))
            ->andReturn($mockReview);

        $result = $this->service->create($data, $this->authUser);
        $this->assertSame($mockReview, $result);
    }

    /**
     * @throws UserNotAllowedException
     */
    public function test_updates_review(): void
    {
        $data = ['rating' => 3];
        $mockReview = $this->makeModel(Review::class, ['id' => 123, 'rating' => 3]);

        $profile = $this->makeModel(Profile::class, ['user_id' => $this->authUser->id]);
        $mockReview->setRelation('profile', $profile);

        $this->reviewRepoMock
            ->shouldReceive('findById')
            ->once()
            ->with($mockReview->id)
            ->andReturn($mockReview);

        $this->reviewRepoMock
            ->shouldReceive('update')
            ->once()
            ->with($mockReview->id, $data)
            ->andReturn($mockReview);

        $result = $this->service->update($mockReview->id, $data, $this->authUser);
        $this->assertSame($mockReview, $result);
    }

    /**
     * @throws UserNotAllowedException
     */
    public function test_deletes_review(): void
    {
        $mockReview = $this->makeModel(Review::class, ['id' => 123]);
        $this->reviewRepoMock
            ->shouldReceive('findById')
            ->once()
            ->with($mockReview->id)
            ->andReturn($mockReview);

        $this->reviewRepoMock
            ->shouldReceive('delete')
            ->once()
            ->with($mockReview->id)
            ->andReturnTrue();

        $result = $this->service->delete($mockReview->id, $this->authUser);
        $this->assertTrue($result);
    }
}
