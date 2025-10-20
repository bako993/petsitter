<?php

namespace Service;

use App\Exceptions\UserNotAllowedException;
use App\Models\Offering;
use App\Models\Profile;
use App\Models\User;
use Core\Policies\OfferingPolicy;
use Core\Repositories\OfferingRepositoryInterface;
use Core\Services\OfferingService;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Mockery;
use PHPUnit\Framework\InvalidDataProviderException;
use Tests\Fixtures\FixtureHelpers;
use Tests\TestCase;

class OfferingServiceTest extends TestCase
{
    use FixtureHelpers;

    protected OfferingService $service;
    protected OfferingRepositoryInterface $offeringRepoMock;
    protected OfferingPolicy $offeringPolicyMock;
    protected User $authUser;

    protected function setUp(): void
    {
        parent::setUp();

        $this->offeringRepoMock = $this->mockRepository(OfferingRepositoryInterface::class);

        $this->offeringPolicyMock = Mockery::mock(OfferingPolicy::class);

        $this->offeringPolicyMock->shouldReceive('viewAny')->andReturn(true);
        $this->offeringPolicyMock->shouldReceive('view')->andReturn(true);
        $this->offeringPolicyMock->shouldReceive('create')->andReturn(true);
        $this->offeringPolicyMock->shouldReceive('update')->andReturn(true);
        $this->offeringPolicyMock->shouldReceive('delete')->andReturn(true);

        $this->service = new OfferingService($this->offeringRepoMock, $this->offeringPolicyMock);

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

    public function test_paginate_offerings(): void
    {
        $items = new Collection([]);
        $mockResult = new LengthAwarePaginator($items, $items->count(), 15, 1);

        $this->offeringRepoMock
            ->shouldReceive('paginate')
            ->once()
            ->with(15, [])
            ->andReturn($mockResult);

        $result = $this->service->paginate();
        $this->assertSame($mockResult, $result);
    }

    public function test_find_offering_by_id(): void
    {
        $mockOffering = $this->makeModel(Offering::class, ['id' => 123]);

        $this->offeringRepoMock
            ->shouldReceive('findById')
            ->once()
            ->with($mockOffering->id, [])
            ->andReturn($mockOffering);

        $result = $this->service->findById($mockOffering->id);
        $this->assertSame($mockOffering, $result);
    }

    /**
     * @throws UserNotAllowedException
     */
    public function test_creates_offering(): void
    {
        $data = [
            'offering_type' => 'dog_walking',
            'price' => 25.00,
            'conditions' => ['special_instructions' => 'No aggressive dogs'],
            'duration' => 60,
        ];

        $profile = $this->makeModel(Profile::class, ['user_id' => $this->authUser->id]);
        $this->authUser->setRelation('profile', $profile);

        $mockOffering = $this->makeModel(Offering::class, $data);

        $this->offeringRepoMock
            ->shouldReceive('create')
            ->once()
            ->with(array_merge($data, ['profile_id' => $profile->id]))
            ->andReturn($mockOffering);

        $result = $this->service->create($data, $this->authUser);
        $this->assertSame($mockOffering, $result);
    }

    /**
     * @throws UserNotAllowedException
     */
    public function test_create_throws_exception_when_profile_id_missing(): void
    {
        $this->expectException(InvalidDataProviderException::class);
        $this->expectExceptionMessage('User does not have a profile.');

        $data = [
            'offering_type' => 'dog_walking',
            'price' => 25.00,
        ];

        $this->service->create($data, $this->authUser);
    }

    /**
     * @throws UserNotAllowedException
     */
    public function test_updates_offering(): void
    {
        $data = ['price' => 50.00];
        $mockOffering = $this->makeModel(Offering::class, ['id' => 123, 'price' => 50.00]);

        $this->offeringRepoMock
            ->shouldReceive('findById')
            ->once()
            ->with($mockOffering->id)
            ->andReturn($mockOffering);

        $this->offeringRepoMock
            ->shouldReceive('update')
            ->once()
            ->with($mockOffering->id, $data)
            ->andReturn($mockOffering);

        $result = $this->service->update($mockOffering->id, $data, $this->authUser);
        $this->assertSame($mockOffering, $result);
    }

    /**
     * @throws UserNotAllowedException
     */
    public function test_deletes_offering(): void
    {
        $mockOffering = $this->makeModel(Offering::class, [
            'id' => 123,
        ]);

        $this->offeringRepoMock
            ->shouldReceive('findById')
            ->once()
            ->with($mockOffering->id)
            ->andReturn($mockOffering);

        $this->offeringRepoMock
            ->shouldReceive('delete')
            ->once()
            ->with($mockOffering->id)
            ->andReturnTrue();

        $result = $this->service->delete($mockOffering->id, $this->authUser);
        $this->assertTrue($result);
    }
}
