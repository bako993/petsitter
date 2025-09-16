<?php

namespace Core\Repositories;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface UserRepositoryInterface
{
    public function paginate(int $perPage = 15): LengthAwarePaginator;
    public function findById(int $id);
    public function findByEmail(string $email);
    public function create(array $data);
    public function update(int $id, array $data);
    public function delete(int $id);
}
