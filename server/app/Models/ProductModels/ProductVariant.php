<?php

namespace App\Models\ProductModels;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductVariant extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'price',
        'product_variant_label_id',
        'active'
    ];

    public function products(): BelongsTo
    {
        return $this->BelongsTo(ProductVariantLabel::class, 'product_variant_label_id', 'id');
    }
}
