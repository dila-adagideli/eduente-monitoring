import "./ServerOverview.css";
import { isOnlineStatus } from "../utils/systemFormat";

function ServerOverview({ server, updated }) {
  if (!server) return null;

  const online = isOnlineStatus(server.status);
  const statusLabel = server.status
    ? String(server.status).toUpperCase()
    : "—";

  return (
    <div className="server-overview glass-panel glass-panel--glow">
      <div className="server-header">
        <h2>{server.name ?? "—"}</h2>

        <span className={`status ${online ? "online" : "offline"}`}>
          ● {statusLabel}
        </span>
      </div>

      <div className="server-grid stagger-children">
        <div>
          <span>Environment</span>
          <strong>{server.environment ?? "—"}</strong>
        </div>

        <div>
          <span>Uptime</span>
          <strong>{server.uptime ?? "—"}</strong>
        </div>

        <div>
          <span>Last Update</span>
          <strong>{updated ?? "—"}</strong>
        </div>
      </div>
    </div>
  );
}

export default ServerOverview;
