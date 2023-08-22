<?php

namespace App\Filters\V1;

use App\Filters\ApiFilter;

class   ProductsFilter extends ApiFilter
{
    protected $safeParams = [
        'name' => ['regexp'],
        'price' => ['eq', 'lt', 'lte', 'gt', 'gte'],
    ];

    protected $columnMap = [];
    protected $operatorMap = [
        'eq' => '=',
        'lt' => '<',
        'lte' => '<=',
        'gt' => '>',
        'gte' => '>=',
        'regexp' => 'REGEXP',
    ];
}
