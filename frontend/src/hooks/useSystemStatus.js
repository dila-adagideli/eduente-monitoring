import { useEffect, useState } from "react";
import axios from "axios";

const SYSTEM_STATUS_URL = "http://localhost:8000/api/system-status";
export const REFRESH_INTERVAL = 5000;

/**
 * Fetches system status immediately, then polls every REFRESH_INTERVAL ms.
 * Clears interval on unmount.
 */
export function useSystemStatus() {
  const [system, setSystem] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchStatus = () => {
      axios
        .get(SYSTEM_STATUS_URL)
        .then((response) => {
          if (!cancelled) {
            setSystem(response.data);
          }
        })
        .catch((error) => {
          if (!cancelled) {
            console.error(error);
          }
        });
    };

    fetchStatus();

    const intervalId = setInterval(fetchStatus, REFRESH_INTERVAL);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, []);

  return system;
}
