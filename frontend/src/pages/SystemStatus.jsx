import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DashboardSkeleton from "../components/DashboardSkeleton";
import SystemStatusContent from "../components/SystemStatusContent";
import { useSystemStatus } from "../hooks/useSystemStatus";
import {
  displayValue,
  formatUtcToLocal,
  isOnlineStatus,
  mapHealthStatus,
} from "../utils/systemFormat";

function SystemStatus({ activePage, onNavigate, onLogout }) {
  const system = useSystemStatus();

  if (!system) {
    return <DashboardSkeleton />;
  }

  const hostOnline = isOnlineStatus(system.server?.status);
  const overall = mapHealthStatus(system.health?.overall);
  const localUpdated = formatUtcToLocal(system.updated_at);

  return (
    <div className="app">
      <Navbar onLogout={onLogout} />

      <div className="content">
        <Sidebar activePage={activePage} onNavigate={onNavigate} />

        <main className="dashboard">
          <header className="dashboard-header">
            <div className="dashboard-header-text">
              <span className="dashboard-eyebrow">Infrastructure</span>
              <h1>System Status</h1>
              <p>
                Host overview, service dependencies, health checks, and technical
                inventory.
              </p>
            </div>

            <div className="dashboard-header-meta">
              <div className="meta-chip">
                Host <strong>{displayValue(system.server?.hostname)}</strong>
              </div>
              <div className="meta-chip">
                Host{" "}
                <strong>
                  {system.server?.status
                    ? String(system.server.status).toUpperCase()
                    : hostOnline
                      ? "ONLINE"
                      : "—"}
                </strong>
              </div>
              <div className="meta-chip">
                Overall <strong>{overall.label}</strong>
              </div>
              <div className="meta-chip">
                Updated <strong>{localUpdated}</strong>
              </div>
            </div>
          </header>

          <SystemStatusContent system={system} />
        </main>
      </div>
    </div>
  );
}

export default SystemStatus;
