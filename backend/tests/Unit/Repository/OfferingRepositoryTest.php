<?php

namespace Repository;

use App\Models\Offering;
use Core\Repositories\OfferingRepositoryInterface;
use Tests\Helpers\OfferingTestData;
use Tests\Helpers\ProfileTestData;
use Tests\Helpers\UserTestData;
use Tests\TestCase;

class OfferingRepositoryTest extends TestCase
{
    use OfferingTestData;
    use UserTestData;
    use ProfileTestData;

    protected function setUp(): void
    {
        parent::setUp();
        $this->repository = app(OfferingRepositoryInterface::class);
    }

    public function testPaginateOfferings(): void
    {
        $this->createOfferings(20);

        $result = $this->repository->paginate();

        $this->assertCount(15, $result->items());
        $this->assertEquals(20, $result->total());
        $this->assertEquals(1, $result->currentPage());
        $this->assertEquals(2, $result->lastPage());
    }

    public function testFindByIdReturnsOffering(): void
    {
        $offering = $this->createOffering();

        $found = $this->repository->findById($offering->id);

        $this->assertInstanceOf(Offering::class, $found);
        $this->assertEquals($offering->id, $found->id);
    }

    public function testFindByIdReturnsOfferingNotFound(): void
    {
        $this->assertNull($this->repository->findById(999));
    }

    public function testCreateOffering(): void
    {
        $profile = $this->createProfile();

        $data = [
            'profile_id' => $profile->id,
            'offering_type' => 'dog_walking',
            'price' => '25',
            'conditions' => ['food is not included'],
            'duration' => '60',
        ];

        $offering = $this->repository->create($data);
        $this->assertInstanceOf(Offering::class, $offering);
        $this->assertDatabaseHas('offerings', ['offering_type' => 'dog_walking']);
    }

    public function testUpdateOffering(): void
    {
        $offering = $this->createOffering(['offering_type' => 'dog_walking']);

        $updated = $this->repository->update($offering->id, ['offering_type' => 'sitting']);

        $this->assertInstanceOf(Offering::class, $updated);
        $this->assertEquals('sitting', $updated->offering_type);
        $this->assertDatabaseHas('offerings', ['offering_type' => 'sitting']);
    }

    public function testUpdateReturnsOfferingNotFound(): void
    {
        $this->assertNull($this->repository->update(999, ['offering_type' => 'sitting']));
    }

    public function testDeleteOffering(): void
    {
        $offering = $this->createOffering();

        $deleted = $this->repository->delete($offering->id);

        $this->assertTrue($deleted);
        $this->assertDatabaseMissing('offerings', ['id' => $offering->id]);
    }

    public function testDeleteReturnsOfferingNotFound(): void
    {
        $this->assertFalse($this->repository->delete(999));
    }

    public function testFindByIdWithRelations(): void
    {
        $offering = $this->createOffering();

        $found = $this->repository->findById($offering->id, ['profile']);

        $this->assertTrue($found->relationLoaded('profile'));
    }
}
