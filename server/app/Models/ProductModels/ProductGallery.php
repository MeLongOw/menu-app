<?php

namespace App\Models\ProductModels;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductGallery extends Model
{
    use HasFactory;

    protected $fillable = ['path', 'order', 'product_id'];

    public function products(): BelongsTo
    {
        return $this->BelongsTo(Product::class, 'product_id', 'id');
    }
}
