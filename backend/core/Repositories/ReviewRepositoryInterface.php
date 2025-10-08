<?php

namespace Core\Repositories;

interface ReviewRepositoryInterface
{
    public function paginate(int $perPage = 15, array $with = []): mixed;
    public function findById(int $id, array $with = []);
    public function create(array $data);
    public function update(int $id, array $data);
    public function delete(int $id): bool;
}
