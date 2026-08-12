<?php

namespace App\Http\Middleware;

use Closure;
use Throwable;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;
use App\Models\RequestLog;

class RequestLogger
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->is('api/system-status') || $request->is('api/logs')) {
             return $next($request);
    } 
        $start = microtime(true);

        try {

    $response = $next($request);

} catch (Throwable $e) {

    Log::error('APPLICATION ERROR', [

        'user_id' => auth()->id() ?? 'guest',

        'method' => $request->method(),

        'url' => $request->path(),

        'controller' => optional($request->route())->getActionName(),

        'ip' => $request->ip(),

        'message' => $e->getMessage(),

        'file' => $e->getFile(),

        'line' => $e->getLine(),

    ]);

    throw $e;
}

        $responseTime = round((microtime(true) - $start) * 1000, 2);

        $result = $response->isSuccessful() ? 'SUCCESS' : 'FAILED';

        $action = match ($request->method()) {
            'GET' => 'READ',
            'POST' => 'CREATE',
            'PUT', 'PATCH' => 'UPDATE',
            'DELETE' => 'DELETE',
             default => 'OTHER',
        };

        $route = $request->route();

        $controller = $route && $route->getActionName()
            ? $route->getActionName()
            : 'Closure';

        RequestLog::create([
    'user_id' => auth()->id() ?? 'guest',
    'method' => $request->method(),
    'url' => $request->path(),
    'controller' => $controller,
    'status' => $response->getStatusCode(),
    'result' => $result,
    'ip' => $request->ip(),
    'request' => $request->except(['password', 'password_confirmation']),
    'response_time' => $responseTime,
]);

        Log::info("CRUD {$action}", [
            'user_id' => auth()->id() ?? 'guest',
            'method' => $request->method(),
            'url' => $request->path(),
            'controller' => $controller,
            'status' => $response->getStatusCode(),
            'result' => $result,
            'ip' => $request->ip(),
            'request' => $request->except(['password', 'password_confirmation']),
            'response_time' => $responseTime . ' ms',
        ]);

        return $response;
    }
}