<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\User;

class ApiKeyMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $apiKey = $request->header('X-API-KEY');

        if (!$apiKey) {
            return response()->json([
                'message' => 'API Key gerekli.'
            ], 401);
        }

        $user = User::where('api_key', $apiKey)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Geçersiz API Key.'
            ], 401);
       }

// API Key sahibi kullanıcıyı giriş yapmış gibi tanıt
        auth()->login($user);

        return $next($request);
    }
}