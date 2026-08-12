import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import ServerOverview from "../components/ServerOverview";
import MetricCharts from "../components/MetricCharts";
import LoadAverageSection from "../components/LoadAverageSection";
import DashboardSkeleton from "../components/DashboardSkeleton";
import { useSystemStatus } from "../hooks/useSystemStatus";
import {
  displayValue,
  formatUtcToLocal,
} from "../utils/systemFormat";

function Dashboard({ activePage = "dashboard", onNavigate, onLogout }) {
  const system = useSystemStatus();

  if (!system) {
    return <DashboardSkeleton />;
  }

  const localUpdated = formatUtcToLocal(system.updated_at);
  const cpuUsage = system.cpu?.usage;
  const memUsage = system.memory?.usage;
  const diskUsage = system.disk?.usage;
  const responseTime = system.response_time;

  return (
    <div className="app">
      <Navbar onLogout={onLogout} />

      <div className="content">
        <Sidebar activePage={activePage} onNavigate={onNavigate} />

        <main className="dashboard">
          <header className="dashboard-header">
            <div className="dashboard-header-text">
              <span className="dashboard-eyebrow">Monitoring</span>
              <h1>System Dashboard</h1>
              <p>Host health at a glance — metrics, load, and live performance.</p>
            </div>

            <div className="dashboard-header-meta">
              <div className="meta-chip">
                Host <strong>{displayValue(system.server?.hostname)}</strong>
              </div>
              <div className="meta-chip">
                Status{" "}
                <strong>
                  {system.server?.status
                    ? String(system.server.status).toUpperCase()
                    : "—"}
                </strong>
              </div>
              <div className="meta-chip">
                Updated <strong>{localUpdated}</strong>
              </div>
            </div>
          </header>

          <div className="section-reveal">
            <ServerOverview
              server={system.server}
              updated={localUpdated}
            />
          </div>

          <section className="dash-section metrics-section section-reveal">
            <div className="dash-section-header">
              <span className="dash-section-eyebrow">Live</span>
              <h2>Key Metrics</h2>
              <p>Current CPU, memory, disk, and latency readings.</p>
            </div>

            <div className="cards stagger-children">
              <StatCard
                title="CPU Usage"
                value={
                  cpuUsage != null && cpuUsage !== ""
                    ? `${cpuUsage}%`
                    : "—"
                }
                color="#34d399"
                subtitle={
                  system.cpu?.cores != null
                    ? `${system.cpu.cores} cores`
                    : system.cpu?.model
                      ? displayValue(system.cpu.model)
                      : undefined
                }
              />

              <StatCard
                title="RAM Usage"
                value={
                  memUsage != null && memUsage !== ""
                    ? `${memUsage}%`
                    : "—"
                }
                color="#60a5fa"
                subtitle={
                  system.memory?.used != null && system.memory?.total != null
                    ? `${system.memory.used} / ${system.memory.total}`
                    : undefined
                }
              />

              <StatCard
                title="Disk Usage"
                value={
                  diskUsage != null && diskUsage !== ""
                    ? `${diskUsage}%`
                    : "—"
                }
                color="#fbbf24"
                subtitle={
                  system.disk?.used != null && system.disk?.total != null
                    ? `${system.disk.used} / ${system.disk.total}`
                    : undefined
                }
              />

              <StatCard
                title="Response Time"
                value={
                  responseTime != null && responseTime !== ""
                    ? String(responseTime).includes("ms")
                      ? String(responseTime)
                      : `${responseTime} ms`
                    : "—"
                }
                color="#f87171"
                subtitle="Latency"
              />
            </div>
          </section>

          <div className="section-reveal">
            <LoadAverageSection
              loadAverage={system.load_average}
              cores={system.cpu?.cores}
            />
          </div>

          <div className="section-reveal">
            <MetricCharts system={system} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
