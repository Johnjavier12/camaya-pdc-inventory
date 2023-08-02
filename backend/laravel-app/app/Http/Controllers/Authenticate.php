<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\UserAuthenticate;

class Authenticate extends Controller
{
    public function login(UserAuthenticate $request) 
    {

        $user = User::where('email', $request['email'])->first(); //CHECK USER

        if(!$user || !Hash::check($request['password'], $user->password)) {
            return response()->json(['error' => trans('auth.failed')],400);
        }

        $token = $user->createToken('user-tokens')->plainTextToken;

        $response = [
            'user' => $user,
            'token' => $token,
            'roles' => [],
            'permissions' => []
        ];

        return response($response,201);
    }

    public function logout(Request $request) 
    {
        auth()->user()->tokens()->delete();

        return [
            'message' => 'logout'
        ];
    }
}
