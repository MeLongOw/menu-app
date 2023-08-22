<?php

namespace Database\Factories\ProductModels;

use App\Models\UserModels\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->words(random_int(1, 4), true),
            'description' => $this->faker->paragraph(4),
            'user_id' => User::factory(),
        ];
    }
}
