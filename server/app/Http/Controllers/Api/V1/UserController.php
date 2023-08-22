<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\UserResource;
use Illuminate\Http\Request;
use App\Models\UserModels\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;


class UserController extends Controller
{
    /**
     * Create User
     * @param Request $request
     * @return User
     */
    public function createUser(Request $request)
    {
        try {
            //Validated
            $validateUser = Validator::make(
                $request->all(),
                [
                    'name'  => 'required',
                    'phone' => 'required|regex:/^([0-9\s\-\+\(\)]*)$/|min:10|unique:users',
                    'email' => 'required|email|unique:users',
                    'password' => 'required'
                ],
                ['phone.regex' => 'Invalid phone number']
            );

            if ($validateUser->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => $validateUser->errors()
                ], 401);
            }


            //create slug
            $slug = Str::slug($request->name);
            $counter = 2;

            while (User::where('slug', $slug)->exists()) {
                // If a record with the same slug exists, append a counter to the slug.
                $slug = Str::slug($request->name) . '-' . $counter;
                $counter++;
            }

            $user = User::create([
                'name' => $request->name,
                'slug' => $slug,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'phone' => $request->phone
            ]);

            return response()->json([
                'success' => true,
                'message' => 'User Created Successfully',
                'slug' => $user->slug,
                'token' => $user->createToken("API TOKEN")->plainTextToken
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Login The User
     * @param Request $request
     * @return User
     */
    public function loginUser(Request $request)
    {
        try {
            $validateUser = Validator::make(
                $request->all(),
                [
                    'email' => 'required|email',
                    'password' => 'required'
                ]
            );

            if ($validateUser->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => $validateUser->errors()
                ], 401);
            }

            $user = User::where('email', $request->email)->first();

            if (!$user || !Hash::check($request->password, $user->password, [])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Email or password is incorrect',
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Logged In Successfully',
                'slug' => $user->slug,
                'id' => $user->id,
                'token' => $user->createToken("API TOKEN")->plainTextToken
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => $th->getMessage()
            ], 500);
        }
    }


    public function logoutUser(Request $request)
    {
        // Revoke the token that was used to authenticate the current request...
        Auth::user()->currentAccessToken()->delete();
        return response()->json(['success' => true, 'message' => 'Logout Successfully']);
    }

    public function getUser(Request $request)
    {
        return response()->json([
            'success' => true,
            'user' =>  $request->user(),
        ]);
    }

    public function getUserBySlug(Request $request, $slug)
    {
        $user = User::where('slug', $slug)->first();
        if ($user) {
            return response()->json([
                'success' => true,
                'data' =>  UserResource::make($user),
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' =>  'User is not found',
            ]);
        }
    }

    public function updateUserAvatar(Request $request)
    {
        $user =  $request->user();
        $request->validate(['avatar' => 'string']);

        if ($user) {
            $user->avatar = $request->avatar;
            $user->save();
            return response()->json([
                'success' => true,
                'message' =>  "Update avatar is successfully",
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' =>  'User is not found',
            ]);
        }
    }
    public function updateUserBackground(Request $request)
    {
        $user =  $request->user();
        $request->validate(['background' => 'string']);

        if ($user) {
            $user->background = $request->background;
            $user->save();
            return response()->json([
                'success' => true,
                'message' =>  "Update background is successfully",
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' =>  'User is not found',
            ]);
        }
    }

    public function updateUserAbout(Request $request)
    {
        $user =  $request->user();
        $request->validate(['about' => 'string']);

        if ($user) {
            $user->about = $request->about;
            $user->save();
            return response()->json([
                'success' => true,
                'message' =>  "Update about is successfully",
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' =>  'User is not found',
            ]);
        }
    }

    public function getGuests(Request $request)
    {
        $user =  $request->user();
        if ($user) {
            return response()->json([
                'success' => true,
                'message' =>  "Get guest data is successfully",
                'data' => json_decode($user->guest_list)
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' =>  'User is not found',
            ]);
        }
    }

    public function updateGuests(Request $request)
    {
        $data = $request->validate(['guests' => 'required|json']);
        $user =  $request->user();
        if ($user) {
            $user->guest_list = $data['guests'];
            $user->save();
            return response()->json([
                'success' => true,
                'message' =>  "Update guest data is successfully",
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' =>  'User is not found',
            ]);
        }
    }
        }
