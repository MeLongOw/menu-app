<?php

namespace Database\Factories\UserModels;

use App\Models\UserModels\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UserModels\UserPost>
 */
class UserPostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $text =  $this->faker->paragraph(4);
        return [
            'content' => "<p>$text</p>",
            'user_id' => User::factory(),
            'created_at' => $this->faker->date()
        ];
    }
}
