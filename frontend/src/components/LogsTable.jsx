import StatusBadge from "./StatusBadge";
import "./LogsTable.css";
import {
  displayValue,
  formatResponseTimeMs,
  formatUtcToLocalLog,
} from "../utils/systemFormat";

function methodClass(method) {
  const m = String(method || "").toUpperCase();
  if (m === "GET") return "method-get";
  if (m === "POST") return "method-post";
  if (m === "PUT") return "method-put";
  if (m === "PATCH") return "method-patch";
  if (m === "DELETE") return "method-delete";
  return "method-other";
}

function statusClass(status) {
  const code = Number(status);
  if (Number.isNaN(code)) return "status-code-neutral";
  if (code >= 200 && code < 300) return "status-code-ok";
  if (code >= 300 && code < 400) return "status-code-redirect";
  if (code >= 400 && code < 500) return "status-code-client";
  if (code >= 500) return "status-code-server";
  return "status-code-neutral";
}

function resultTone(result) {
  const r = String(result || "").toUpperCase();
  if (r === "SUCCESS") return "success";
  if (r === "FAILED") return "failed";
  return "neutral";
}

function LogRowCells({ log }) {
  const method = String(log.method || "—").toUpperCase();
  return (
    <>
      <td>
        <span className={`method-badge ${methodClass(method)}`}>{method}</span>
      </td>
      <td className="log-url" title={displayValue(log.url)}>
        {displayValue(log.url)}
      </td>
      <td className="log-mono">{displayValue(log.controller)}</td>
      <td>
        <span className={`status-code ${statusClass(log.status)}`}>
          {displayValue(log.status)}
        </span>
      </td>
      <td>
        <StatusBadge
          label={displayValue(log.result)}
          tone={resultTone(log.result)}
        />
      </td>
      <td className="log-mono">{displayValue(log.ip)}</td>
      <td className="log-mono log-rt">
        {formatResponseTimeMs(log.response_time)}
      </td>
      <td className="log-mono log-time">
        {formatUtcToLocalLog(log.created_at)}
      </td>
    </>
  );
}

function LogCard({ log }) {
  const method = String(log.method || "—").toUpperCase();
  return (
    <article className="log-card glass-panel">
      <div className="log-card-top">
        <span className={`method-badge ${methodClass(method)}`}>{method}</span>
        <StatusBadge
          label={displayValue(log.result)}
          tone={resultTone(log.result)}
        />
      </div>
      <p className="log-card-url" title={displayValue(log.url)}>
        {displayValue(log.url)}
      </p>
      <div className="log-card-grid">
        <div>
          <span>Controller</span>
          <strong>{displayValue(log.controller)}</strong>
        </div>
        <div>
          <span>Status</span>
          <strong className={statusClass(log.status)}>
            {displayValue(log.status)}
          </strong>
        </div>
        <div>
          <span>IP</span>
          <strong>{displayValue(log.ip)}</strong>
        </div>
        <div>
          <span>Response Time</span>
          <strong>{formatResponseTimeMs(log.response_time)}</strong>
        </div>
        <div className="log-card-full">
          <span>Created At</span>
          <strong>{formatUtcToLocalLog(log.created_at)}</strong>
        </div>
      </div>
    </article>
  );
}

function LogsTable({ logs }) {
  if (!logs?.length) return null;

  return (
    <>
      <div className="logs-table-wrap glass-panel">
        <table className="logs-table">
          <thead>
            <tr>
              <th>Method</th>
              <th>URL</th>
              <th>Controller</th>
              <th>Status</th>
              <th>Result</th>
              <th>IP</th>
              <th>Response Time</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={log.id ?? `${log.created_at}-${index}`}>
                <LogRowCells log={log} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="logs-cards">
        {logs.map((log, index) => (
          <LogCard
            key={log.id ?? `card-${log.created_at}-${index}`}
            log={log}
          />
        ))}
      </div>
    </>
  );
}

export default LogsTable;
