<?php

namespace Service;

use App\Exceptions\UserNotAllowedException;
use App\Models\User;
use App\Policies\UserPolicy;
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
    protected UserPolicy $userPolicyMock;
    protected User $authUser;

    protected function setUp(): void
    {
        parent::setUp();

        $this->userRepoMock = $this->mockRepository(UserRepositoryInterface::class);

        $this->userPolicyMock = Mockery::mock(UserPolicy::class);

        $this->userPolicyMock->shouldReceive('viewAny')->andReturn(true);
        $this->userPolicyMock->shouldReceive('view')->andReturn(true);
        $this->userPolicyMock->shouldReceive('create')->andReturn(true);
        $this->userPolicyMock->shouldReceive('update')->andReturn(true);
        $this->userPolicyMock->shouldReceive('delete')->andReturn(true);

        $this->service = new UserService($this->userRepoMock, $this->userPolicyMock);

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

    /**
     * @throws UserNotAllowedException
     */
    public function test_paginate_users(): void
    {
        $items = new Collection([]);
        $mockResult = new LengthAwarePaginator($items, $items->count(), 15, 1);

        $this->userRepoMock
            ->shouldReceive('paginate')
            ->once()
            ->with(15, Mockery::any())
            ->andReturn($mockResult);

        $result = $this->service->paginate(15, $this->authUser);
        $this->assertSame($mockResult, $result);
    }

    /**
     * @throws UserNotAllowedException
     */
    public function test_find_user_by_id(): void
    {
        $mockUser = $this->makeModel(User::class, ['id' => 123, 'name' => 'Bako']);

        $this->userRepoMock
            ->shouldReceive('findById')
            ->once()
            ->with($mockUser->id, Mockery::any())
            ->andReturn($mockUser);

        $result = $this->service->findById($mockUser->id, $this->authUser);
        $this->assertSame($mockUser, $result);
    }

    /**
     * @throws UserNotAllowedException
     */
    public function test_hashes_password_when_creating_user(): void
    {
        $data = [
            'name' => 'bako',
            'email' => 'bako@test.com',
            'password' => 'secret123',
            'type' => 'owner',
        ];

        $expectedUser = $this->makeModel(User::class, [
            'name' => 'bako',
            'email' => 'bako@test.com',
        ]);

        $this->userRepoMock
            ->shouldReceive('create')
            ->once()
            ->with(Mockery::on(fn($arg) => Hash::check('secret123', $arg['password'])))
            ->andReturn($expectedUser);

        $result = $this->service->create($data, $this->authUser);
        $this->assertSame($expectedUser, $result);
    }

    /**
     * @throws UserNotAllowedException
     */
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

        $result = $this->service->update($mockUser->id, $data, $this->authUser);
        $this->assertSame($mockUser, $result);
    }

    /**
     * @throws UserNotAllowedException
     */
    public function test_deletes_user(): void
    {
        $mockUserId = 123;

        $mockUser = $this->makeModel(User::class, ['id' => $mockUserId]);

        $mockUser->setRelation('tokens', collect());

        $this->userRepoMock
            ->shouldReceive('findById')
            ->once()
            ->with($mockUserId)
            ->andReturn($mockUser);

        $this->userRepoMock
            ->shouldReceive('delete')
            ->once()
            ->with($mockUserId)
            ->andReturnTrue();

        $result = $this->service->delete($mockUserId, $this->authUser);
        $this->assertTrue($result);
    }
}
