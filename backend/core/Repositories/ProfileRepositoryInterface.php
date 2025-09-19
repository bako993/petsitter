<?php

namespace Core\Repositories;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ProfileRepositoryInterface
{
    public function paginate(int $perPage = 15, array $with =[]): LengthAwarePaginator;
    public function findById(int $id, array $with =[]);
    public function create(array $data);
    public function update(int $id, array $data);
    public function delete(int $id);
}
