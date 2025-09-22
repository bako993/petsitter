<?php

namespace Repository;

use App\Models\User;
use Core\Repositories\UserRepositoryInterface;
use Tests\Helpers\UserTestData;
use Tests\TestCase;

class UserRepositoryTest extends TestCase
{
    use UserTestData;

    private UserRepositoryInterface $repository;

    protected function setUp(): void
    {
        parent::setUp();
        $this->repository = app(UserRepositoryInterface::class);
    }

    public function testPaginateUsers(): void
    {
        $this->createUsers(20);

        $result = $this->repository->paginate();

        $this->assertCount(15, $result->items());
        $this->assertEquals(20, $result->total());
        $this->assertEquals(1, $result->currentPage());
        $this->assertEquals(2, $result->lastPage());
    }

    public function testFindByIdReturnsUser(): void
    {
        $user = $this->createUser();

        $found = $this->repository->findById($user->id);

        $this->assertInstanceOf(User::class, $found);
        $this->assertEquals($user->id, $found->id);
    }

    public function testFindByIdReturnsUserNotFound(): void
    {
        $this->assertNull($this->repository->findById(999));
    }

    public function testCreateUser(): void
    {
        $data = [
            'name' => 'bako',
            'email' => 'bako@gmail.com',
            'password' => bcrypt('password'),
            'role' => 'sitter'
        ];

        $user = $this->repository->create($data);
        $this->assertInstanceOf(User::class, $user);
        $this->assertEquals($user->id, $user->id);
        $this->assertDatabaseHas('users', ['email' => 'bako@gmail.com']);
    }

    public function testUpdateUser(): void
    {
        $user = $this->createUser(['name' => 'bako']);

        $updated = $this->repository->update($user->id, ['name' => 'updated name']);

        $this->assertInstanceOf(User::class, $updated);
        $this->assertEquals($user->id, $updated->id);
        $this->assertEquals('updated name', $updated->name);
        $this->assertDatabaseHas('users', ['name' => 'updated name']);
    }

    public function testUpdateReturnsUserNotFound(): void
    {
        $this->assertNull($this->repository->update(999, ['name' => 'test']));
    }

    public function testDeleteUser(): void
    {
        $user = $this->createUser();

        $deleted = $this->repository->delete($user->id);

        $this->assertTrue($deleted);
        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }

    public function testDeleteReturnsUserNotFound(): void
    {
        $this->assertFalse($this->repository->delete(999));
    }
}
