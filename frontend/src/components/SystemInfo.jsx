import {
  FaMicrochip,
  FaMemory,
  FaHdd,
  FaServer,
  FaClock,
  FaRedo,
  FaLayerGroup,
} from "react-icons/fa";
import "./SystemInfo.css";
import { displayValue, formatUtcToLocal } from "../utils/systemFormat";

const INFO_ITEMS = [
  {
    key: "cores",
    label: "CPU Cores",
    icon: FaMicrochip,
    color: "#34d399",
    get: (s) => displayValue(s.cpu?.cores),
  },
  {
    key: "memUsed",
    label: "Memory Used",
    icon: FaMemory,
    color: "#60a5fa",
    get: (s) => displayValue(s.memory?.used),
  },
  {
    key: "memTotal",
    label: "Memory Total",
    icon: FaMemory,
    color: "#93c5fd",
    get: (s) => displayValue(s.memory?.total),
  },
  {
    key: "diskUsed",
    label: "Disk Used",
    icon: FaHdd,
    color: "#fbbf24",
    get: (s) => displayValue(s.disk?.used),
  },
  {
    key: "diskTotal",
    label: "Disk Total",
    icon: FaHdd,
    color: "#fcd34d",
    get: (s) => displayValue(s.disk?.total),
  },
  {
    key: "env",
    label: "Environment",
    icon: FaLayerGroup,
    color: "#38bdf8",
    get: (s) => displayValue(s.server?.environment),
  },
  {
    key: "updated",
    label: "Last Update",
    icon: FaRedo,
    color: "#94a3b8",
    get: (s) => formatUtcToLocal(s.updated_at),
  },
  {
    key: "uptime",
    label: "Uptime",
    icon: FaClock,
    color: "#2dd4bf",
    get: (s) => displayValue(s.server?.uptime),
  },
];

function SystemInfo({ system }) {
  return (
    <section className="dash-section system-info-section">
      <div className="dash-section-header">
        <span className="dash-section-eyebrow">Host</span>
        <h2>System Information</h2>
        <p>Hardware, storage, and runtime context at a glance.</p>
      </div>

      <div className="system-info-panel glass-panel glass-panel--glow">
        <div className="system-info-banner">
          <div className="system-info-banner-icon">
            <FaServer />
          </div>
          <div>
            <h3>{displayValue(system.server?.name, "Server")}</h3>
            <p>
              {system.server?.status
                ? String(system.server.status).toUpperCase()
                : "UNKNOWN"}{" "}
              · Full host inventory
            </p>
          </div>
        </div>

        <div className="system-info-grid stagger-children">
          {INFO_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.key}
                className="system-info-card"
                style={{ "--info-accent": item.color }}
              >
                <div className="system-info-card-top">
                  <div
                    className="system-info-icon"
                    style={{ color: item.color }}
                  >
                    <Icon />
                  </div>
                  <span>{item.label}</span>
                </div>
                <strong>{item.get(system)}</strong>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default SystemInfo;
