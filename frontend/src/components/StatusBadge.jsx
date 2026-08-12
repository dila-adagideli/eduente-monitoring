import "./StatusBadge.css";

function StatusBadge({ label, tone = "neutral" }) {
  return (
    <span className={`status-badge tone-${tone}`}>
      <i />
      {label}
    </span>
  );
}

export default StatusBadge;
