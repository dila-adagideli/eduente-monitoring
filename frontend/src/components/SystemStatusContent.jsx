import {
  HiOutlineCpuChip,
  HiOutlineCircleStack,
  HiOutlineServerStack,
  HiOutlineServer,
  HiOutlineCodeBracket,
  HiOutlineCube,
  HiOutlineClock,
  HiOutlineGlobeAlt,
} from "react-icons/hi2";
import { FaLaravel, FaDatabase } from "react-icons/fa";

import ServerOverview from "./ServerOverview";
import ServicesSection from "./ServicesSection";
import {
  displayValue,
  formatUtcToLocal,
  mapHealthStatus,
} from "../utils/systemFormat";
import "./SystemStatus.css";

function InfoCard({ label, value, icon: Icon, color = "var(--accent)" }) {
  return (
    <article
      className="status-info-card glass-panel glass-panel--glow"
      style={{ "--panel-accent": color }}
    >
      <div className="status-info-card-top">
        <div
          className="status-info-icon"
          style={{ color, borderColor: `${color}44` }}
        >
          <Icon />
        </div>
      </div>
      <span className="status-info-label">{label}</span>
      <strong className="status-info-value">{value}</strong>
    </article>
  );
}

function HealthCard({ label, valueLabel, tone, icon: Icon, color }) {
  return (
    <article
      className="status-info-card health-card glass-panel glass-panel--glow"
      style={{ "--panel-accent": color }}
    >
      <div className="status-info-card-top">
        <div
          className="status-info-icon"
          style={{ color, borderColor: `${color}44` }}
        >
          <Icon />
        </div>
        <span className={`status-mini-badge tone-${tone}`}>
          <i />
          {valueLabel}
        </span>
      </div>
      <span className="status-info-label">{label}</span>
      <strong className="status-info-value" style={{ color }}>
        {valueLabel}
      </strong>
    </article>
  );
}

function SystemStatusContent({ system }) {
  const localUpdated = formatUtcToLocal(system.updated_at);
  const health = system.health || {};

  const cpuHealth = mapHealthStatus(health.cpu);
  const memHealth = mapHealthStatus(health.memory);
  const diskHealth = mapHealthStatus(health.disk);
  const redisHealth = mapHealthStatus(health.redis);
  const laravelHealth = mapHealthStatus(health.laravel);

  const laravel = system.services?.laravel || {};
  const os = system.os || {};
  const server = system.server || {};

  const systemInfoItems = [
    {
      key: "os",
      label: "Operating System",
      value: displayValue(os.name),
      icon: HiOutlineGlobeAlt,
      color: "#94a3b8",
    },
    {
      key: "hostname",
      label: "Hostname",
      value: displayValue(server.hostname ?? server.name),
      icon: HiOutlineServer,
      color: "#38bdf8",
    },
    {
      key: "cores",
      label: "CPU Cores",
      value: displayValue(system.cpu?.cores),
      icon: HiOutlineCpuChip,
      color: "#34d399",
    },
    {
      key: "ram",
      label: "Total RAM",
      value: displayValue(system.memory?.total),
      icon: HiOutlineCircleStack,
      color: "#60a5fa",
    },
    {
      key: "disk",
      label: "Total Disk",
      value: displayValue(system.disk?.total),
      icon: HiOutlineServerStack,
      color: "#fbbf24",
    },
    {
      key: "php",
      label: "PHP Version",
      value: displayValue(laravel.php),
      icon: HiOutlineCodeBracket,
      color: "#38bdf8",
    },
    {
      key: "arch",
      label: "Architecture",
      value: displayValue(os.architecture),
      icon: HiOutlineCpuChip,
      color: "#2dd4bf",
    },
    {
      key: "kernel",
      label: "Kernel",
      value: displayValue(os.kernel),
      icon: HiOutlineCube,
      color: "#94a3b8",
    },
    {
      key: "cpuModel",
      label: "CPU Model",
      value: displayValue(system.cpu?.model),
      icon: HiOutlineCpuChip,
      color: "#34d399",
    },
    {
      key: "boot",
      label: "Boot Time",
      value: formatUtcToLocal(server.boot_time),
      icon: HiOutlineClock,
      color: "#60a5fa",
    },
    {
      key: "laravelEnv",
      label: "Laravel Environment",
      value: displayValue(laravel.environment),
      icon: FaLaravel,
      color: "#f87171",
    },
    {
      key: "app",
      label: "Application Version",
      value: displayValue(laravel.version),
      icon: FaLaravel,
      color: "#f87171",
    },
  ];

  return (
    <>
      <section className="dash-section status-overview-section section-reveal">
        <div className="dash-section-header">
          <span className="dash-section-eyebrow">Host</span>
          <h2>System Overview</h2>
          <p>Server identity, uptime, and online status.</p>
        </div>
        <ServerOverview server={system.server} updated={localUpdated} />
      </section>

      <div className="section-reveal">
        <ServicesSection services={system.services} />
      </div>

      <section className="dash-section status-block section-reveal">
        <div className="dash-section-header">
          <span className="dash-section-eyebrow">Checks</span>
          <h2>Health Summary</h2>
          <p>Resource and service health from the latest probe.</p>
        </div>
        <div className="status-card-grid health-grid stagger-children">
          <HealthCard
            label="CPU Status"
            valueLabel={cpuHealth.label}
            tone={cpuHealth.tone}
            icon={HiOutlineCpuChip}
            color="#34d399"
          />
          <HealthCard
            label="Memory Status"
            valueLabel={memHealth.label}
            tone={memHealth.tone}
            icon={HiOutlineCircleStack}
            color="#60a5fa"
          />
          <HealthCard
            label="Disk Status"
            valueLabel={diskHealth.label}
            tone={diskHealth.tone}
            icon={HiOutlineServerStack}
            color="#fbbf24"
          />
          <HealthCard
            label="Redis Status"
            valueLabel={redisHealth.label}
            tone={redisHealth.tone}
            icon={FaDatabase}
            color="#fbbf24"
          />
          <HealthCard
            label="Laravel Status"
            valueLabel={laravelHealth.label}
            tone={laravelHealth.tone}
            icon={FaLaravel}
            color="#f87171"
          />
        </div>
      </section>

      <section className="dash-section status-block section-reveal">
        <div className="dash-section-header">
          <span className="dash-section-eyebrow">Inventory</span>
          <h2>System Information</h2>
          <p>Technical host and runtime details available from the API.</p>
        </div>
        <div className="status-card-grid stagger-children">
          {systemInfoItems.map((item) => (
            <InfoCard
              key={item.key}
              label={item.label}
              value={item.value}
              icon={item.icon}
              color={item.color}
            />
          ))}
        </div>
      </section>

      <footer className="last-refresh section-reveal">
        <span className="last-refresh-label">Last Refresh</span>
        <strong className="last-refresh-value">{localUpdated}</strong>
      </footer>
    </>
  );
}

export default SystemStatusContent;
