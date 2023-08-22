<?php

namespace Database\Factories\UserModels;

use App\Models\UserModels\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->name();

        $slug = Str::slug($name);
        $counter = 2;

        while (User::where('slug', $slug)->exists()) {
            // If a record with the same slug exists, append a counter to the slug.
            $slug = Str::slug($name) . '-' . $counter;
            $counter++;
        }
        return [
            'name' =>  $name,
            'slug' => $slug,
            'about' => '<h1 style="text-align: center;"><em><strong>HELLO! Meow!</strong></em></h1>
            <h1 style="text-align: center;"><em><strong>Let your client know anything about your store!</strong></em></h1>
            <p><em><strong><img style="display: block; margin-left: auto; margin-right: auto;" src="data:image/jpeg;base64,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"></strong></em></p>',
            'phone' => fake()->phoneNumber(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}