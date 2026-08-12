<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
{
    $request->validate([
        'name' => ['required', 'string', 'max:255'],
        'email' => ['required', 'email', 'unique:users,email'],
        'password' => ['required', 'min:6'],
    ]);

    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
    ]);

    $token = $user->createToken('dashboard-token')->plainTextToken;

    return response()->json([
        'message' => 'Kayıt başarılı.',
        'token' => $token,
        'api_key' => $user->api_key,
        'user' => $user,
    ], 201);
}
    public function login(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required']
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Email veya şifre hatalı.'
            ], 401);
        }

        $token = $user->createToken('dashboard-token')->plainTextToken;

        return response()->json([
            'message' => 'Giriş başarılı.',
            'token' => $token,
            'user' => $user
        ]);
    }
}