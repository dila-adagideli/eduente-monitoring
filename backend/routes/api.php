<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\SystemController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ApiLogController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/log', [ApiLogController::class, 'store'])
    ->middleware('apikey');
Route::get('/logs', [ApiLogController::class, 'index']);

Route::get('/system-status', [SystemController::class, 'status']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});