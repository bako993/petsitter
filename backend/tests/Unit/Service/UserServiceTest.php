<?php

namespace Service;

use App\Models\User;
use Core\Repositories\UserRepositoryInterface;
use Core\Services\UserService;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Hash;
use Mockery;
use Tests\Fixtures\FixtureHelpers;
use Tests\TestCase;

class UserServiceTest extends TestCase
{
    use FixtureHelpers;

    protected UserService $service;
    protected UserRepositoryInterface $userRepoMock;

    protected function setUp(): void
    {
        parent::setUp();

        $this->userRepoMock = $this->mockRepository(UserRepositoryInterface::class);
        $this->service = new UserService($this->userRepoMock);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_paginate_users(): void
    {
        $items = new Collection([]);
        $mockResult = new LengthAwarePaginator(
            $items,
            $items->count(),
            15,
            1
        );

        $this->userRepoMock
            ->shouldReceive('paginate')
            ->once()
            ->with(15, [])
            ->andReturn($mockResult);

        $result = $this->service->paginate();
        $this->assertSame($mockResult, $result);
    }

    public function test_find_user_by_id(): void
    {
        $mockUser = $this->makeModel(User::class, ['id' => 123, 'name' => 'Bako']);

        $this->userRepoMock
            ->shouldReceive('findById')
            ->once()
            ->with($mockUser->id, [])
            ->andReturn($mockUser);

        $result = $this->service->findById($mockUser->id);
        $this->assertSame($mockUser, $result);
    }

    public function test_hashes_password_when_creating_user(): void
    {
        $data = [
            'name' => 'bako',
            'email' => 'bako@test.com',
            'password' => 'secret123',
            'role' => 'sitter'
        ];

        $expectedUser = $this->makeModel(User::class, [
            'name' => 'bako',
            'email' => 'bako@test.com',
        ]);

        $this->userRepoMock
            ->shouldReceive('create')
            ->once()
            ->with(Mockery::on(function ($arg) {
                return Hash::check('secret123', $arg['password']);
            }))
            ->andReturn($expectedUser);

        $result = $this->service->create($data);

        $this->assertSame($expectedUser, $result);
    }

    public function test_removes_password_when_updating_user(): void
    {
        $data = [
            'name' => 'Updated Name',
            'password' => 'newpassword',
        ];
        $mockUser = $this->makeModel(User::class, ['id' => 123, 'name' => 'Updated Name']);


        $this->userRepoMock
            ->shouldReceive('update')
            ->once()
            ->with($mockUser->id, ['name' => 'Updated Name'])
            ->andReturn($mockUser);

        $result = $this->service->update($mockUser->id, $data);
        $this->assertSame($mockUser, $result);
    }

    public function test_deletes_user(): void
    {
        $mockUserId = 123;

        $this->userRepoMock
            ->shouldReceive('delete')
            ->once()
            ->with($mockUserId)
            ->andReturnTrue();

        $result = $this->service->delete($mockUserId);
        $this->assertTrue($result);
    }
}
