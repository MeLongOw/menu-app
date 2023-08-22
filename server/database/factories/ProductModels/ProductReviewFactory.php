<?php

namespace Database\Factories\ProductModels;

use App\Models\ProductModels\Product;
use App\Models\UserModels\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProductReview>
 */
class ProductReviewFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'imgUrl' => $this->faker->image(),
            'product_id' => Product::factory(),
            'user_id' => User::factory(),
        ];
    }
}
