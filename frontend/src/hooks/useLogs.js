import { useEffect, useState } from "react";
import axios from "axios";
import { REFRESH_INTERVAL } from "./useSystemStatus";

const LOGS_URL = "http://localhost:8000/api/logs";

/**
 * Normalize common list wrappers from the logs API.
 */
function extractLogsArray(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.logs)) return payload.logs;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  return [];
}

/**
 * Fetches logs immediately, then polls every REFRESH_INTERVAL ms.
 * Clears interval on unmount.
 */
export function useLogs() {
  const [logs, setLogs] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchLogs = () => {
      axios
        .get(LOGS_URL)
        .then((response) => {
          if (cancelled) return;
          setLogs(extractLogsArray(response.data));
          setError(null);
          setLoading(false);
        })
        .catch((err) => {
          if (cancelled) return;
          console.error(err);
          setError(err);
          // Keep previous logs on refresh failure after first load
          setLoading(false);
        });
    };

    fetchLogs();

    const intervalId = setInterval(fetchLogs, REFRESH_INTERVAL);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, []);

  return { logs, error, loading };
}
