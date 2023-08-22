<?php

namespace Database\Factories\ProductModels;

use App\Models\ProductModels\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProductVariantLabel>
 */
class ProductVariantLabelFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->words(random_int(1, 3), true),
            'product_id' => Product::factory(),
        ];
    }
}
