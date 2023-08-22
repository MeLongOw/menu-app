<?php

namespace App\Filters\V1;

use App\Filters\ApiFilter;

class ProductCategoriesFilter extends ApiFilter
{
    protected $safeParams = [
        'name' => ['regexp'],
    ];

    protected $columnMap = [];
    protected $operatorMap = [
        'eq' => '=',
        'lt' => '<',
        'lte' => '<=',
        'gt' => '>',
        'gte' => '>=',
        'ne' => '!=',
        'regexp' => 'REGEXP',
    ];
}
