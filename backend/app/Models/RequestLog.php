<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RequestLog extends Model
{
    protected $fillable = [
        'user_id',
        'method',
        'url',
        'controller',
        'status',
        'result',
        'ip',
        'request',
        'response_time',
    ];

    protected $casts = [
        'request' => 'array',
    ];
}