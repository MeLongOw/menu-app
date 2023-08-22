<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\OrderResource;
use App\Models\ProductModels\Product;
use App\Models\ProductModels\ProductVariant;
use App\Models\ProductModels\ProductVariantLabel;
use App\Models\UserModels\Order;
use App\Models\UserModels\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $data = $request->validate(['date' => 'required|date', 'status' => 'required|in:processing,accepted,success,cancelled']);
        $user = $request->user();

        $orderDate = $data['date'];
        $status = $data['status'];

        $orders = Order::where('user_id', $user->id)
            ->where('status', $status)
            ->whereDate('created_at', $orderDate)
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json(['success' => true, 'data' => OrderResource::collection($orders)]);
    }

    public function status(Request $request, string $id)
    {
        $order = Order::find($id);
        if ($order) {
            return response()->json(['success' => true, 'status' => $order->status]);
        } else {
            return response()->json(['success' => false, 'message' => 'Order not found'], 404);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data =  $request->validate([
            'id' => 'required|numeric',
            'name' => 'required|string',
            'note' => 'string|nullable',
            'phone' => 'required|string',
            'cart' => 'required|array',
            'cart.*.qty' => 'required|numeric',
            "cart.*.product.id" => 'required|numeric',
            "cart.*.product.variants" => 'required|array',
            "cart.*.product.variants.*.id" => 'required|numeric',
            "cart.*.product.variants.*.subVariant" => 'required|numeric'
        ]);

        DB::beginTransaction();
        try {
            $user = User::find($data['id']);

            //get guest list [{phone: string, isBlocked: boolean}]
            $guestList = json_decode($user->guest_list);

            //find guest base on data['phone']
            $guest = null;
            foreach ($guestList as $guestItem) {
                if ($guestItem->phone === $data['phone']) {
                    $guest = $guestItem;
                    break;
                }
            }

            // new guest && push to guestList
            if (!$guest) {
                $guestList[] = ['phone' => $data['phone'], 'isBlocked' => false];
                $user->guest_list = json_encode($guestList);
                $user->save();
            };


            if ($guest && $guest->isBlocked) {
                return response()->json(['success' => false, 'message' => 'You have been blocked by this store'], 403);
            } else {
                $cart = $data['cart'];
                $products = [];
                foreach ($cart as $item) {
                    $variants = $item['product']['variants'];
                    $product = Product::find($item['product']['id']);
                    $res =  [];
                    foreach ($variants as $variant) {
                        $variantLabel = ProductVariantLabel::find($variant['id']);
                        $subVariant = ProductVariant::find($variant['subVariant']);
                        $res[] = [
                            'id' =>  $variantLabel->id,
                            'name' =>  $variantLabel->name,
                            'subVariant' => ['id' => $subVariant->id, 'name' => $subVariant->name, 'price' => $subVariant->price]
                        ];
                    }
                    $product->variants = $res;
                    $product['qty'] = $item['qty'];
                    $products[] = $product;
                }

                $order = Order::create([
                    'user_id' => $data['id'],
                    'guest_name' => $data['name'],
                    'guest_phone' => $data['phone'],
                    'guest_note' => $data['note'],
                    'products' => json_encode($products),
                ]);

                DB::commit();
                return response()->json([
                    'success' => true,
                    'message' => 'Take order successfully. Please wait for accepting from store',
                    'order' => $order,
                ]);
            }
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
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    public function updateRead(Request $request, string $id)

    {
        $user = $request->user();
        $order = Order::find($id);
        if ($order) {
            if ($order->user_id === $user->id) {
                $order->is_read = true;
                $order->save();
                return response()->json(['success' => true, 'message' => 'Update read order successfully']);
            }
            return response()->json(['success' => false, 'message' => 'Can not do this action'], 403);
        }
        return response()->json(['success' => false, 'message' => 'Order not found'], 404);
    }

    public function updateStatus(Request $request, string $id)

    {
        $data = $request->validate(['status' => 'required|string|in:accepted,success,cancelled']);
        $user = $request->user();
        $order = Order::find($id);
        if ($order) {
            if ($order->user_id === $user->id) {
                $order->status = $data['status'];
                $order->save();
                return response()->json(['success' => true, 'message' => 'Update status order successfully']);
            }
            return response()->json(['success' => false, 'message' => 'Can not do this action'], 403);
        }
        return response()->json(['success' => false, 'message' => 'Order not found'], 404);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
