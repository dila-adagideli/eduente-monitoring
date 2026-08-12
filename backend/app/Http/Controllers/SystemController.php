<?php

namespace App\Http\Controllers;

use App\Services\SystemMetricsService;
use Illuminate\Http\JsonResponse;

class SystemController extends Controller
{
    public function __construct(
        private SystemMetricsService $systemMetricsService
    ) {}

    public function status(): JsonResponse
    {
        return response()->json(
            $this->systemMetricsService->getSystemStatus()
        );
    }
}