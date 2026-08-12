import { HiOutlineServer } from "react-icons/hi2";
import { useAuth } from "../context/AuthContext";

function Navbar({ onLogout }) {
  const { user, logout } = useAuth();

  const displayName = user?.name || user?.email || "User";
  const initials = String(displayName)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "U";

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
      return;
    }
    logout();
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <div className="logo-icon">
          <HiOutlineServer size={20} />
        </div>
        <div className="logo-text">
          <span className="logo-title">Eduente Monitoring</span>
          <span className="logo-subtitle">Infrastructure Observability</span>
        </div>
      </div>

      <div className="navbar-actions">
        <div className="live-badge">
          <span className="live-dot" />
          LIVE
        </div>

        <div className="user">
          <div className="user-avatar">{initials}</div>
          <div className="user-meta">
            <span className="user-name">{displayName}</span>
            <span className="user-role">Operator</span>
          </div>
        </div>

        <button
          type="button"
          className="navbar-logout"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
