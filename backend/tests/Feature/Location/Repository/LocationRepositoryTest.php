<?php

namespace Location\Repository;

use App\Models\Location;
use App\Models\User;
use Core\Repositories\LocationRepositoryInterface;
use Tests\Feature\Location\LocationTestCase;

class LocationRepositoryTest extends LocationTestCase
{

    protected function setUp(): void
    {
        parent::setUp();
        $this->repository = app(LocationRepositoryInterface::class);
    }

    public function testPaginateLocations(): void
    {
        $this->createModels(Location::class,20);

        $result = $this->repository->paginate();

        $this->assertCount(15, $result->items());
        $this->assertEquals(20, $result->total());
        $this->assertEquals(1, $result->currentPage());
        $this->assertEquals(2, $result->lastPage());
    }

    public function testFindByIdReturnsLocation(): void
    {
        $location = $this->createModel(Location::class);

        $found = $this->repository->findById($location->id);

        $this->assertInstanceOf(Location::class, $found);
        $this->assertEquals($location->id, $found->id);
    }

    public function testFindByIdReturnsLocationNotFound(): void
    {
        $this->assertNull($this->repository->findById(999));
    }

    public function testCreateLocation(): void
    {
        $user = $this->createModel(User::class);

        $data = [
            'user_id' => $user->id,
            'latitude' => '65',
            'longitude' => '140',
            'city' => 'Arnhem',
            'postal_code' => '6865 GG',
            'street' => 'Richter',
            'house_number' => '120',
        ];

        $location = $this->repository->create($data);

        $this->assertInstanceOf(Location::class, $location);
        $this->assertEquals($user->id, $location->user_id);
        $this->assertDatabaseHas('locations', ['street' => 'Richter']);
    }

    public function testUpdateLocation(): void
    {
        $location = $this->createModel(Location::class, ['street' => 'Richter']);

        $updated = $this->repository->update($location->id, ['street' => 'Richterweg']);

        $this->assertInstanceOf(Location::class, $updated);
        $this->assertEquals($location->id, $updated->id);
        $this->assertEquals('Richterweg', $updated->street);
        $this->assertDatabaseHas('locations', ['street' => 'Richterweg']);
    }

    public function testUpdateReturnsLocationNotFound(): void
    {
        $this->assertNull($this->repository->update(999, ['street' => 'test']));
    }

    public function testDeleteLocation(): void
    {
        $location = $this->createModel(Location::class);

        $deleted = $this->repository->delete($location->id);

        $this->assertTrue($deleted);
        $this->assertDatabaseMissing('locations', ['id' => $location->id]);
    }

    public function testDeleteReturnsLocationNotFound(): void
    {
        $this->assertFalse($this->repository->delete(999));
    }

    public function testFindByIdWithRelations(): void
    {
        $user = $this->createModel(User::class);
        $location = $this->createModel(Location::class, ['user_id' => $user->id]);

        $found = $this->repository->findById($location->id, ['user']);

        $this->assertTrue($found->relationLoaded('user'));
    }
}
