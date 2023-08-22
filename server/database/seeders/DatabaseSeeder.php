<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\ProductModels\Product;
use App\Models\ProductModels\ProductCategory;
use App\Models\ProductModels\ProductGallery;
use App\Models\ProductModels\ProductVariant;
use App\Models\ProductModels\ProductVariantLabel;
use App\Models\UserModels\User;
use App\Models\UserModels\UserPost;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory(5)
            ->create()->each(function ($user) {
                UserPost::factory(random_int(4, 7))->create(['user_id' => $user->id]);
                $productCategories = ProductCategory::factory(random_int(3, 10))->create(['user_id' => $user->id]);
                $productCategories->each(function ($category, $index) {
                    $category->update(['order' => $index + 1]);
                });
                Product::factory(60)
                    ->has(ProductVariantLabel::factory(random_int(2, 3))
                        ->has(ProductVariant::factory(random_int(2, 4)), 'variants'), 'variantLabels')
                    ->create(['user_id' => $user->id])
                    ->each(function ($product) use ($productCategories) {
                        $productCategories->pluck('id')->toArray();
                        $product->categories()->sync($productCategories->random(3));
                    });


                // $productCategoriesIds = $productCategories->pluck('id')->toArray();

                // Product::factory(random_int(10, 30))
                //     ->hasAttached($productCategoriesIds, ['user_id' => $user->id])
                //     ->has(ProductVariantLabel::factory(random_int(2, 3))
                //         ->has(ProductVariant::factory(random_int(2, 4)), 'variants'), 'variantLabels')
                //     ->create(['user_id' => $user->id]);
            });
    }
}
