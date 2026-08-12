<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RequestLog;

class ApiLogController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'method' => 'required|string',
            'url' => 'required|string',
            'status' => 'required|integer',
            'response_time' => 'required|numeric',
        ]);

        RequestLog::create([
            'user_id' => auth()->id(),
            'method' => $request->method,
            'url' => $request->url,
            'controller' => $request->controller,
            'status' => $request->status,
            'result' => $request->status >= 200 && $request->status < 300
                ? 'SUCCESS'
                : 'FAILED',
            'ip' => $request->ip(),
            'request' => $request->except([
                'method',
                'url',
                'status',
                'response_time',
                'controller'
            ]),
            'response_time' => $request->response_time,
        ]);

        return response()->json([
            'message' => 'Log başarıyla kaydedildi.'
        ]);
    }
    public function index()
{
    $logs = RequestLog::latest()->get();

    return response()->json([
        'data' => $logs
    ]);
}
}
