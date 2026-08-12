import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import LogsTable from "../components/LogsTable";
import { useLogs } from "../hooks/useLogs";
import {
  takeLatestLogs,
} from "../utils/systemFormat";

const LOGS_LIMIT = 20;

function Logs({ activePage = "logs", onNavigate, onLogout }) {
  const { logs, error, loading } = useLogs();
  const latest = takeLatestLogs(logs ?? [], LOGS_LIMIT);
  const isInitialLoad = loading && logs == null;

  return (
    <div className="app">
      <Navbar onLogout={onLogout} />

      <div className="content">
        <Sidebar activePage={activePage} onNavigate={onNavigate} />

        <main className="dashboard">
          <header className="dashboard-header">
            <div className="dashboard-header-text">
              <span className="dashboard-eyebrow">Observability</span>
              <h1>Logs</h1>
              <p>
                Latest request and response history from the monitoring API.
              </p>
            </div>

            <div className="dashboard-header-meta">
              <div className="meta-chip">
                Showing <strong>{latest.length}</strong>
              </div>
              <div className="meta-chip">
                Latest <strong>{LOGS_LIMIT}</strong>
              </div>
            </div>
          </header>

          {isInitialLoad ? (
            <div className="logs-state glass-panel">
              <div className="logs-loading-spinner" />
              <h3>Loading logs…</h3>
              <p>Fetching the latest request history.</p>
            </div>
          ) : null}

          {!isInitialLoad && error && logs == null ? (
            <div className="logs-state glass-panel">
              <h3>Failed to load logs</h3>
              <p>
                Could not reach the logs API. Check connectivity and try again.
              </p>
            </div>
          ) : null}

          {!isInitialLoad && !error && latest.length === 0 ? (
            <div className="logs-state glass-panel">
              <h3>No logs yet</h3>
              <p>
                When requests are recorded by the backend, the latest entries
                will appear here.
              </p>
            </div>
          ) : null}

          {latest.length > 0 ? <LogsTable logs={latest} /> : null}
        </main>
      </div>
    </div>
  );
}

export default Logs;
