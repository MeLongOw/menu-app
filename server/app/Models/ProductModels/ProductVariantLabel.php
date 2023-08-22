<?php

namespace App\Models\ProductModels;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductVariantLabel extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'product_id',
    ];

    public function products(): BelongsTo
    {
        return $this->BelongsTo(Product::class, 'product_id', 'id');
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class, 'product_variant_label_id', 'id');
    }
}
