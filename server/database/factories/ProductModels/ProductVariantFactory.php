<?php

namespace Database\Factories\ProductModels;

use App\Models\ProductModels\ProductVariantLabel;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProductVariant>
 */
class ProductVariantFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->words(random_int(2, 4), true),
            'price' => $this->faker->numberBetween(10000, 1000000000),
            'product_variant_label_id' => ProductVariantLabel::factory(),
        ];
    }
}
