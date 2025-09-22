<?php

namespace Service;

use App\Models\Offering;
use Core\Repositories\OfferingRepositoryInterface;
use Core\Services\OfferingService;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Mockery;
use RuntimeException;
use Tests\Fixtures\FixtureHelpers;
use Tests\TestCase;

class OfferingServiceTest extends TestCase
{
    use FixtureHelpers;

    protected OfferingService $service;
    protected OfferingRepositoryInterface $offeringRepoMock;

    protected function setUp(): void
    {
        parent::setUp();

        $this->offeringRepoMock = $this->mockRepository(OfferingRepositoryInterface::class);
        $this->service = new OfferingService($this->offeringRepoMock);
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

    public function test_creates_offering(): void
    {
        $data = [
            'profile_id' => 1,
            'offering_type' => 'dog_walking',
            'price' => 25.00,
            'conditions' => ['special_instructions' => 'No aggressive dogs'],
            'duration' => 60,
        ];

        $mockOffering = $this->makeModel(Offering::class, $data);

        $this->offeringRepoMock
            ->shouldReceive('create')
            ->once()
            ->with($data)
            ->andReturn($mockOffering);

        $result = $this->service->create($data);
        $this->assertSame($mockOffering, $result);
    }

    public function test_create_throws_exception_when_profile_id_missing(): void
    {
        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('Profile ID is required to create an offering.');

        $data = [
            'offering_type' => 'dog_walking',
            'price' => 25.00,
        ];

        $this->service->create($data);
    }

    public function test_updates_offering(): void
    {
        $data = ['price' => 50.00];
        $mockOffering = $this->makeModel(Offering::class, ['id' => 123, 'price' => 50.00]);

        $this->offeringRepoMock
            ->shouldReceive('update')
            ->once()
            ->with($mockOffering->id, $data)
            ->andReturn($mockOffering);

        $result = $this->service->update($mockOffering->id, $data);
        $this->assertSame($mockOffering, $result);
    }

    public function test_deletes_offering(): void
    {
        $mockOfferingId = 123;

        $this->offeringRepoMock
            ->shouldReceive('delete')
            ->once()
            ->with($mockOfferingId)
            ->andReturnTrue();

        $result = $this->service->delete($mockOfferingId);
        $this->assertTrue($result);
    }
}
