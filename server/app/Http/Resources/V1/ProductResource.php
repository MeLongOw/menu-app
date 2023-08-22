<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public static $wrap = false;

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'isActive' => $this->active,
            'rating' => $this->rating,
            'images' => $this->images->map(function ($image) {
                return [
                    'path' => $image->path,
                    'order' => $image->order,
                    'id' => $image->id,
                ];
            }),
            'variants' => $this->variantLabels->map(function ($variantLabel) {
                $arr = $variantLabel->variants->map(function ($variant) {
                    return [
                        'id' => $variant->id,
                        'name' => $variant->name,
                        'price' => $variant->price,
                        'active' => $variant->active
                    ];
                });
                return [
                    'id' => $variantLabel->id,
                    "name" => $variantLabel->name,
                    "variants" => $arr,
                ];
            }),
            'reviews' => $this->reviews,
            'categories' => $this->categories->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                ];
            }),

        ];
    }
}
