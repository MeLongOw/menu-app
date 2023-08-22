<?php

use App\Http\Controllers\Api\V1\OrderController;
use App\Http\Controllers\Api\V1\ProductCategoryController;
use App\Http\Controllers\Api\V1\ProductController;
use App\Http\Controllers\Api\V1\UserController;
use App\Http\Controllers\Api\V1\UserPostController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->prefix('v1')->group(function () {

    Route::put('product-categories/sort', [ProductCategoryController::class, 'updateOrder']);
    Route::apiResource('product-categories', ProductCategoryController::class)->except('index');

    Route::apiResource('products', ProductController::class)->except('index');
    Route::put('products/toggle-active/{id}', [ProductController::class, 'toggleActiveProduct']);

    Route::get('auth/user', [UserController::class, 'getUser']);
    Route::put('auth/logout', [UserController::class, 'logoutUser']);

    Route::apiResource('user/posts', UserPostController::class)->except('index', 'show');
    Route::put('user/avatar', [UserController::class, 'updateUserAvatar']);
    Route::put('user/background', [UserController::class, 'updateUserBackground']);
    Route::put('user/about', [UserController::class, 'updateUserAbout']);
    Route::get('user/guests', [UserController::class, 'getGuests']);
    Route::put('user/guests', [UserController::class, 'updateGuests']);
    Route::get('user/orders', [OrderController::class, 'index']);
    Route::put('user/orders/read/{id}', [OrderController::class, 'updateRead']);
    Route::put('user/orders/status/{id}', [OrderController::class, 'updateStatus']);
});




Route::prefix('v1')->group(function () {
    Route::get('product-categories', [ProductCategoryController::class, 'index']);

    Route::get('products', [ProductController::class, 'index']);

    Route::post('orders', [OrderController::class, 'store']);
    Route::get('orders/status/{id}', [OrderController::class, 'status']);

    Route::get('users/{slug}', [UserController::class, 'getUserBySlug']);

    Route::post('/auth/register', [UserController::class, 'createUser']);
    Route::post('/auth/login', [UserController::class, 'loginUser']);
});
