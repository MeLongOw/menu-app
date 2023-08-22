<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ProductModels\ProductCategory;
use App\Http\Requests\V1\StoreProductCategoryRequest;
use App\Http\Requests\V1\UpdateProductCategoryRequest;
use App\Http\Resources\V1\ProductCategoryCollection;
use App\Http\Resources\V1\ProductCategoryResource;
use Illuminate\Http\Request;


class ProductCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $data = $request->validate(['userId' => 'numeric|nullable']);
        if (isset($data['userId'])) {
            $productCategories = ProductCategory::where('user_id', $data['userId'])->orderBy('order')->get();
            return response()->json(
                [
                    'success' => true,
                    'data' => new ProductCategoryCollection($productCategories),
                ],
                200
            );
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductCategoryRequest $request)
    {
        $data = $request->validated();
        $userId = $request->user()->id;
        $newProductCategory = ProductCategory::create(
            [
                'name' => $data['name'],
                'user_id' => $userId
            ]
        );
        return response()->json(
            [
                'success' => true,
                'newProductCategory' => new ProductCategoryResource($newProductCategory),
            ],
            200
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(ProductCategory $productCategory)
    {
        return new ProductCategoryResource($productCategory);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductCategoryRequest $request, ProductCategory $productCategory)
    {
        $request->validated();

        $user = $request->user();

        //check category whether or not belong to user
        if ($user['id'] === $productCategory['user_id']) {
            $productCategory->update($request->all());

            $updatedProductCategory = ProductCategory::find($productCategory->id);

            return response()->json(
                [
                    'success' => true,
                    'updatedProductCategory' => new ProductCategoryResource($updatedProductCategory),
                ],
                200
            );
        } else {
            return response()->json(
                [
                    'success' => false,
                    'message' => 'not allow to do this action',
                ],
                403
            );
        }
    }


    public function updateOrder(Request $request)
    {
        $data =  $request->validate(['categories' => "array"]);

        $categories = $data['categories'];

        $newCategories = [];

        if ($categories) {
            //check category whether or not belong to user
            foreach ($categories as $category) {
                $result = ProductCategory::find($category['id']);

                if ($result && $result['user_id'] !== $request->user()->id) {
                    return response()->json(
                        [
                            'success' => false,
                            'message' => 'not allow to do this action',

                        ],
                        403
                    );
                }

                //update order
                $result->order = $category['order'];
                $result->save();

                $newCategories[] = $result;
            };
        }

        return response()->json(
            [
                'success' => true,
                'message' => 'Update category order is successful',
                'new' => $newCategories
            ],
            200
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductCategory $productCategory)
    {
        $result = $productCategory->delete();

        if ($result) {
            return response()->json(
                [
                    'success' => true,
                    "deletedProductCategory" => new ProductCategoryResource($productCategory),
                    'message' => 'Delete product category successfully'
                ],
                200
            );
        } else {
            return response([
                'success' => false,
                'message' => "Product category was not found"
            ], 404);
        }
    }
}
