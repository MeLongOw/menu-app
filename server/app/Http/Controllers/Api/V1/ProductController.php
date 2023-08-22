<?php

namespace App\Http\Controllers\Api\V1;

use App\Filters\V1\ProductsFilter;
use App\Http\Controllers\Controller;
use App\Models\ProductModels\Product;
use App\Http\Requests\V1\UpdateProductRequest;
use App\Http\Requests\V1\StoreProductRequest;
use App\Http\Resources\V1\ProductCollection;
use App\Http\Resources\V1\ProductResource;
use App\Models\ProductModels\CategoryProduct;
use App\Models\ProductModels\ProductCategory;
use App\Models\ProductModels\ProductGallery;
use App\Models\ProductModels\ProductVariant;
use App\Models\ProductModels\ProductVariantLabel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $data = $request->validate(['id' => 'required']);
        // return response()->json($data);
        $category = $request->category;
        $query = (new ProductsFilter)->transform($request);

        $products = Product::with(['categories', 'images', 'variantLabels.variants', 'reviews'])
            // ->whereHas('categories', function ($query) use ($category) {
            //     $query->where('name', $category);
            // })
            // ->where($query)
            ->where('user_id', $data['id'])
            ->orderBy('created_at', 'desc')->get();

        return response()->json(
            [
                'success' => true,
                'data' => new ProductCollection($products),
            ],
            200
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request)
    {
        $data = $request->validated();

        // Begin the transaction
        DB::beginTransaction();

        try {
            $newProduct = Product::create([
                'name' => $data["name"],
                'description' => $data["description"],
                'user_id' => $request->user()->id
            ]);

            //create relation product and category
            $newProduct->categories()->sync($data['categories']);

            // save image
            foreach ($data['images'] as $image) {
                ProductGallery::create(
                    [
                        'path' =>  $image['path'],
                        'order' =>  $image['order'],
                        'product_id' => $newProduct->id
                    ]
                );
            }

            //create variant and subvariant
            if ($request->has('variants') && is_array($data['variants'])) {
                foreach ($data['variants'] as $variantData) {
                    $variant = $newProduct->variantLabels()->create([
                        'name' => $variantData['name'],
                    ]);

                    if (isset($variantData['variants']) && is_array($variantData['variants'])) {
                        foreach ($variantData['variants'] as $subVariantData) {
                            $variant->variants()->create([
                                'name' => $subVariantData['name'],
                                'price' => $subVariantData['price'],
                            ]);
                        }
                    }
                }
            }

            DB::commit();
            return response()->json(
                [
                    'success' => true,
                    'newProduct' => $newProduct,
                    'message' => 'Create product successfully'
                ],
                200
            );
        } catch (\Exception $e) {
            // If any part of the transaction fails, catch the exception and rollback the transaction
            DB::rollback();

            // Return an error response or do any other necessary actions
            return response()->json(['sucess' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        $product->with(['categories', 'images', 'variantLabels.variants', 'reviews']);

        return new ProductResource($product);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, Product $product)
    {
        $data = $request->validated();
        // $user = $request->user();
        if ($product->user_id !== $request->user()->id) {
            return response()->json(['success' => false, 'message' => 'Not allow to do this action', 403]);
        }

        // Begin the transaction
        DB::beginTransaction();
        try {

            //create relation product and category
            $product->categories()->sync($data['categories']);


            // save update images
            $product->images()->delete();
            foreach ($data['images'] as $image) {
                ProductGallery::create(
                    [
                        'path' =>  $image['path'],
                        'order' =>  $image['order'],
                        'product_id' => $product->id
                    ]
                );
            }

            //remove old and create new variant and subvariant
            if ($request->has('variants') && is_array($data['variants'])) {
                $product->variantLabels()->delete();
                foreach ($data['variants'] as $variantData) {
                    $variant = $product->variantLabels()->create([
                        'name' => $variantData['name'],
                    ]);

                    if (isset($variantData['variants']) && is_array($variantData['variants'])) {
                        foreach ($variantData['variants'] as $subVariantData) {
                            $variant->variants()->create([
                                'name' => $subVariantData['name'],
                                'price' => $subVariantData['price'],
                                'active' => $subVariantData['active']
                            ]);
                        }
                    }
                }
            }

            DB::commit();
            return response()->json(
                [
                    'success' => true,
                    'message' => 'Update product successfully'
                ],
                200
            );
        } catch (\Exception $e) {
            // If any part of the transaction fails, catch the exception and rollback the transaction
            DB::rollback();

            // Return an error response or do any other necessary actions
            return response()->json(['sucess' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function toggleActiveProduct(Request $request, $id)
    {
        $product = Product::find($id);

        if ($product->user_id !== $request->user()->id) {
            return response()->json(['success' => false, 'message' => 'Not allow to do this action', 403]);
        }

        if ($product) {
            $product->active = !$product->active;
            $product->save();
            return response()->json(['success' => true, 'message' => 'Update product successfully', 'product' => $product]);
        } else {
            return response()->json(['success' => false, 'message' => 'Product not found', 400]);
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Product $product)
    {
        if ($product->user_id !== $request->user()->id) {
            return response()->json(['success' => false, 'message' => 'Not allow to do this action', 403]);
        }

        $result = $product->delete();
        if ($result) {
            return response()->json(
                [
                    'success' => true,
                    "deletedProduct" => new ProductResource($product),
                    'message' => 'Delete product successfully'
                ],
                200
            );
        } else {
            return response([
                'success' => false,
                'message' => "Product was not found"
            ], 404);
        }
    }
}
