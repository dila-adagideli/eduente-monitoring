/**
 * Parse backend UTC datetime and format in the user's local timezone.
 */
export function formatUtcToLocal(utcValue) {
  if (utcValue == null || utcValue === "") return "—";

  const raw = String(utcValue).trim();
  // Ensure UTC parsing when backend omits timezone suffix
  const hasTz = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(raw);
  const normalized = hasTz ? raw : `${raw.replace(" ", "T")}Z`;

  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) {
    const fallback = new Date(raw);
    if (Number.isNaN(fallback.getTime())) return raw;
    return formatLocalDateTime(fallback);
  }

  return formatLocalDateTime(date);
}

function formatLocalDateTime(date) {
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

/**
 * Local datetime as DD.MM.YYYY HH:mm:ss (e.g. 10.08.2026 17:19:42).
 */
export function formatUtcToLocalLog(utcValue) {
  if (utcValue == null || utcValue === "") return "—";

  const raw = String(utcValue).trim();
  const hasTz = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(raw);
  const normalized = hasTz ? raw : `${raw.replace(" ", "T")}Z`;

  let date = new Date(normalized);
  if (Number.isNaN(date.getTime())) {
    date = new Date(raw);
    if (Number.isNaN(date.getTime())) return raw;
  }

  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

/** Sort newest first by created_at and take first `limit` items. */
export function takeLatestLogs(logs, limit = 20) {
  if (!Array.isArray(logs) || logs.length === 0) return [];

  const parseCreatedAt = (value) => {
    if (value == null || value === "") return 0;
    const raw = String(value).trim();
    const hasTz = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(raw);
    const normalized = hasTz ? raw : `${raw.replace(" ", "T")}Z`;
    const t = Date.parse(normalized);
    if (!Number.isNaN(t)) return t;
    const t2 = Date.parse(raw);
    return Number.isNaN(t2) ? 0 : t2;
  };

  return [...logs]
    .sort(
      (a, b) => parseCreatedAt(b?.created_at) - parseCreatedAt(a?.created_at)
    )
    .slice(0, limit);
}

/** Extract milliseconds from response_time (number or "12.5 ms"). */
export function parseResponseTimeMs(responseTime) {
  if (responseTime == null || responseTime === "") return NaN;
  if (typeof responseTime === "number") return responseTime;
  const n = parseFloat(String(responseTime).replace(/[^\d.]/g, ""));
  return Number.isNaN(n) ? NaN : n;
}

export function formatResponseTimeMs(value) {
  const ms = parseResponseTimeMs(value);
  if (Number.isNaN(ms)) return "—";
  return `${ms} ms`;
}

/**
 * Response time thresholds:
 * 0–300 ms → Healthy
 * 301–1000 ms → Warning
 * >1000 ms → Critical
 */
export function getResponseTimeStatus(responseTime) {
  const ms = parseResponseTimeMs(responseTime);
  if (Number.isNaN(ms)) return { label: "Unknown", tone: "neutral" };
  if (ms <= 300) return { label: "Healthy", tone: "healthy" };
  if (ms <= 1000) return { label: "Warning", tone: "warning" };
  return { label: "Critical", tone: "critical" };
}

/** Map API health string (e.g. healthy, warning) to UI tone + display label. */
export function mapHealthStatus(value) {
  if (value == null || value === "") {
    return { label: "Unknown", tone: "neutral" };
  }

  const raw = String(value).trim();
  const lower = raw.toLowerCase();

  const toneMap = {
    healthy: "healthy",
    ok: "healthy",
    good: "healthy",
    online: "healthy",
    up: "healthy",
    warning: "warning",
    warn: "warning",
    degraded: "warning",
    elevated: "warning",
    critical: "critical",
    error: "critical",
    down: "critical",
    offline: "critical",
    failed: "critical",
  };

  const tone = toneMap[lower] || "neutral";
  const label =
    raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();

  return { label, tone };
}

export function displayValue(value, fallback = "—") {
  if (value == null || value === "") return fallback;
  return String(value);
}

export function isOnlineStatus(status) {
  return String(status || "").toLowerCase() === "online";
}
