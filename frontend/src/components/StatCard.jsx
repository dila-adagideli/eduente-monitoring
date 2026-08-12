import "./StatCard.css";

import {
  HiOutlineCpuChip,
  HiOutlineCircleStack,
  HiOutlineServerStack,
  HiOutlineBolt,
} from "react-icons/hi2";
import {
  getResponseTimeStatus,
  parseResponseTimeMs,
} from "../utils/systemFormat";

function StatCard({ title, value, color, subtitle }) {
  const getIcon = () => {
    switch (title) {
      case "CPU Usage":
        return <HiOutlineCpuChip />;
      case "RAM Usage":
        return <HiOutlineCircleStack />;
      case "Disk Usage":
        return <HiOutlineServerStack />;
      default:
        return <HiOutlineBolt />;
    }
  };

  const numericValue = parseFloat(String(value).replace(/[^\d.]/g, ""));

  const getPercentage = () => {
    if (isNaN(numericValue)) return 0;

    if (title === "Response Time") {
      // Visual scale against critical threshold (1000 ms)
      return Math.min((numericValue / 1000) * 100, 100);
    }

    return Math.min(Math.max(numericValue, 0), 100);
  };

  const getStatus = () => {
    if (title === "Response Time") {
      return getResponseTimeStatus(value);
    }

    if (isNaN(numericValue)) {
      return { label: "Unknown", tone: "neutral" };
    }

    if (numericValue < 50) return { label: "Healthy", tone: "healthy" };
    if (numericValue < 80) return { label: "Warning", tone: "warning" };
    return { label: "Critical", tone: "critical" };
  };

  const status = getStatus();
  const percentage = getPercentage();
  const responseMs = parseResponseTimeMs(value);

  return (
    <div
      className="stat-card glass-panel glass-panel--glow"
      style={{ "--panel-accent": color, "--card-accent": color }}
    >
      <div className="stat-header">
        <div className="stat-icon" style={{ color, borderColor: `${color}44` }}>
          {getIcon()}
        </div>

        <div className="stat-header-meta">
          <span className="stat-title">{title}</span>
          {subtitle ? <span className="stat-subtitle">{subtitle}</span> : null}
        </div>

        <span className={`stat-status-pill tone-${status.tone}`}>
          <span className="stat-status-dot" />
          {status.label}
        </span>
      </div>

      <div className="stat-value-row">
        <h1 className="stat-value" style={{ color }}>
          {value}
        </h1>
      </div>

      <div className="progress-meta">
        <span>Utilization</span>
        <span className="progress-pct" style={{ color }}>
          {title === "Response Time"
            ? Number.isNaN(responseMs)
              ? "—"
              : `${responseMs} ms`
            : `${percentage.toFixed(0)}%`}
        </span>
      </div>

      <div className="progress">
        <div
          className="progress-fill"
          style={{
            width: `${percentage}%`,
            background: `linear-gradient(90deg, ${color}aa, ${color})`,
            boxShadow: `0 0 14px ${color}55`,
          }}
        />
      </div>
    </div>
  );
}

export default StatCard;
