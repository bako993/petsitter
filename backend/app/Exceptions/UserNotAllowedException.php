<?php

namespace App\Exceptions;

use Exception;

class UserNotAllowedException extends Exception
{
    public function __construct(string $message = "You are not authorized to perform this action.", int $code = 403)
    {
        parent::__construct($message, $code);
    }
}
