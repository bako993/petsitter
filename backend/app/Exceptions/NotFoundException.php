<?php

namespace App\Exceptions;

use RuntimeException;

class NotFoundException extends RuntimeException
{
    public function __construct(string $resource, int $id)
    {
        parent::__construct("$resource not found [id=$id]");
    }
}
