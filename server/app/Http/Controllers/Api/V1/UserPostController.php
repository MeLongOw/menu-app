<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\UserModels\UserPost;
use Illuminate\Http\Request;

class UserPostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    // public function index()
    // {
    //     //
    // }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate(['content' => 'string|required']);
        $user = $request->user();
        $post = UserPost::create(
            [
                'content' => $data['content'],
                'user_id' => $user->id
            ]
        );
        if ($post) {
            return response()->json(['success' => true, 'message' => 'Create new post successfully'], 200);
        }
        return response()->json(['success' => false, 'message' => 'Something went wrong'], 400);
    }

    /**
     * Display the specified resource.
     */
    // public function show(string $id)
    // {
    //     //
    // }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, UserPost $post)
    {
        $data = $request->validate(['content' => 'string|required']);
        $user = $request->user();

        if ($user->id === $post['user_id']) {
            $post->content = $data['content'];
            $post->save();
        } else {
            return response()->json(['success' => false, 'message' => 'No permission to do this action'], 400);
        }

        if ($post) {
            return response()->json(['success' => true, 'message' => 'Update post successfully']);
        }
        return response()->json(['success' => false, 'message' => 'Something went wrong'], 400);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, UserPost $post)
    {
        $user = $request->user();

        if ($user->id === $post['user_id']) {
            $result = $post->delete();
            if ($result) {
                return response()->json(['success' => true, 'message' => 'Delete post successfully']);
            } else {
                return response()->json(['success' => false, 'message' => 'Something went wrong'], 400);
            }
        } else {
            return response()->json(['success' => false, 'message' => 'No permission to do this action'], 400);
        }
    }
}
