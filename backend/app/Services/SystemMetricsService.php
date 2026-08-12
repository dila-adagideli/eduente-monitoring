<?php

namespace App\Services;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Redis;
use App\Models\RequestLog;

class SystemMetricsService
{
    public function getSystemStatus(): array
{
    $start = microtime(true);
    $cpu = $this->getCpu();
    $memory = $this->getMemory();
    $disk = $this->getDisk();
    $services = $this->getServices();
    $responseTime = round((microtime(true) - $start) * 1000, 2);

    return [

        'server' => [
            'name' => 'Eduente Server',
            'hostname' => env('APP_HOSTNAME', gethostname()),
            'status' => 'online',
            'environment' => app()->environment(),
            'boot_time' => $this->getBootTime(),
            'uptime' => $this->getUptime(),
        ],

        'os' => $this->getOperatingSystem(),

        'cpu' => $cpu,

        'load_average' => $this->getLoadAverage(),

        'memory' => $memory,

        'disk' => $disk,

        'services' => $services,

        'health' => $this->getHealth(
            $cpu,
            $memory,
            $disk,
            $services
        ),

        'response_time' => $responseTime . ' ms',

        'updated_at' => now()->toDateTimeString(),

    ];
}

    private function getMemory(): array
{
    $content = File::get('/proc/meminfo');

    $lines = explode("\n", $content);

    $memory = [];

    foreach ($lines as $line) {

        if (trim($line) === '') {
            continue;
        }

        [$key, $value] = explode(':', $line);

        $memory[$key] = (int) filter_var($value, FILTER_SANITIZE_NUMBER_INT);
    }

    $total = $memory['MemTotal'];

    $available = $memory['MemAvailable'];

    $used = $total - $available;

    return [

        'used' => round($used / 1024 / 1024, 2) . ' GB',

        'total' => round($total / 1024 / 1024, 2) . ' GB',

        'usage' => round(($used / $total) * 100, 2)

    ];
}
private function getUptime(): string
{
    $content = trim(File::get('/proc/uptime'));

    $seconds = (int) explode(' ', $content)[0];

    $days = floor($seconds / 86400);
    $hours = floor(($seconds % 86400) / 3600);
    $minutes = floor(($seconds % 3600) / 60);

    return "{$days} gün {$hours} saat {$minutes} dakika";
}

private function getBootTime(): string
{
    $uptimeContent = trim(File::get('/proc/uptime'));

    $uptimeSeconds = (int) explode(' ', $uptimeContent)[0];

    $bootTimestamp = now()->subSeconds($uptimeSeconds);

    return $bootTimestamp->format('Y-m-d H:i:s');
}


private function getDisk(): array
{
    $total = disk_total_space('/');
    $free = disk_free_space('/');

    $used = $total - $free;

    return [
        'used' => round($used / 1024 / 1024 / 1024, 2) . ' GB',
        'total' => round($total / 1024 / 1024 / 1024, 2) . ' GB',
        'usage' => round(($used / $total) * 100, 2),
    ];
}
private function readCpuStat(): array
{
    $stat = file('/proc/stat')[0];

    $values = preg_split('/\s+/', trim($stat));

    array_shift($values);

    return array_map('intval', $values);
}


private function getCpu(): array
{
    $first = $this->readCpuStat();

    usleep(100000); // 0.5 saniye bekle

    $second = $this->readCpuStat();

    $idle1 = $first[3] + $first[4];
    $idle2 = $second[3] + $second[4];

    $total1 = array_sum($first);
    $total2 = array_sum($second);

    $totalDiff = $total2 - $total1;
    $idleDiff = $idle2 - $idle1;

    $usage = 100 * ($totalDiff - $idleDiff) / $totalDiff;

    return [
        'model' => $this->getCpuModel(),
        'usage' => round($usage, 2),
        'cores' => (int) trim(shell_exec('nproc')),
    ];
}

private function getServices(): array
{
    try {

        $info = Redis::command('INFO');

        return [
            'laravel' => [
                'status' => 'online',
                'version' => app()->version(),
                'php' => PHP_VERSION,
                'environment' => app()->environment(),
                'debug' => config('app.debug'),
    ],


            'redis' => [
                'status' => 'online',
                'version' => $info['Server']['redis_version'] ?? 'unknown',
                'clients' => (int) ($info['Clients']['connected_clients'] ?? 0),
                'memory' => $info['Memory']['used_memory_human'] ?? '0B',
            ],
        ];

    } catch (\Exception $e) {

        return [
            'laravel' => 'online',

            'redis' => [
                'status' => 'offline',
            ],
        ];
    }
}

private function getLoadAverage(): array
{
    $load = sys_getloadavg();

    return [
        '1min' => round($load[0], 2),
        '5min' => round($load[1], 2),
        '15min' => round($load[2], 2),
    ];
}

private function getCpuModel(): string
{
    $cpuInfo = File::get('/proc/cpuinfo');

    foreach (explode("\n", $cpuInfo) as $line) {

        if (str_starts_with($line, 'model name')) {

            return trim(explode(':', $line)[1]);
        }

    }

    return 'Unknown';
}

private function getOperatingSystem(): array
{
    $osName = php_uname('s');

    if (File::exists('/etc/os-release')) {

        $content = File::get('/etc/os-release');

        foreach (explode("\n", $content) as $line) {

            if (str_starts_with($line, 'PRETTY_NAME=')) {

                $osName = trim(explode('=', $line, 2)[1], "\"");

                break;
            }
        }
    }

    return [

        'name' => $osName,

        'architecture' => php_uname('m'),

        'kernel' => php_uname('r'),

    ];
}
private function getHealth(
    array $cpu,
    array $memory,
    array $disk,
    array $services
): array
{
    $redis = $services['redis'];

    $laravel = $services['laravel'];

    $cpuHealth = $this->calculateHealth($cpu['usage'], 70, 90);

    $memoryHealth = $this->calculateHealth($memory['usage'], 75, 90);

    $diskHealth = $this->calculateHealth($disk['usage'], 80, 95);

    $redisHealth = $redis['status'] === 'online'
        ? 'healthy'
        : 'critical';

    $laravelHealth = $laravel['status'] === 'online'
        ? 'healthy'
        : 'critical';

    $overall = 'healthy';

    foreach ([
        $cpuHealth,
        $memoryHealth,
        $diskHealth,
        $redisHealth,
        $laravelHealth
    ] as $status) {

        if ($status === 'critical') {
            $overall = 'critical';
            break;
        }

        if ($status === 'warning') {
            $overall = 'warning';
        }
    }

    return [

        'overall' => $overall,

        'cpu' => $cpuHealth,

        'memory' => $memoryHealth,

        'disk' => $diskHealth,

        'redis' => $redisHealth,

        'laravel' => $laravelHealth,
    ];
}

private function calculateHealth(
    float $usage,
    float $warningLimit,
    float $criticalLimit
): string {

    if ($usage >= $criticalLimit) {
        return 'critical';
    }

    if ($usage >= $warningLimit) {
        return 'warning';
    }

    return 'healthy';
}

}