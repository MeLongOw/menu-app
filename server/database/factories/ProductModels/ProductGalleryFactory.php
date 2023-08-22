<?php

namespace Database\Factories\ProductModels;

use App\Models\ProductModels\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProductGallery>
 */
class ProductGalleryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'imgUrl' => $this->faker->text(),
            'product_id' => Product::factory(),
        ];
    }
}
