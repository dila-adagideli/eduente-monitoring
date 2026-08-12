import {
  HiOutlineChartBar,
  HiOutlineServerStack,
  HiOutlineDocumentText,
  HiOutlineCog6Tooth,
} from "react-icons/hi2";

const MENU = [
  { id: "dashboard", label: "Dashboard", icon: HiOutlineChartBar },
  { id: "system-status", label: "System Status", icon: HiOutlineServerStack },
  { id: "logs", label: "Logs", icon: HiOutlineDocumentText },
  { id: "settings", label: "Settings", icon: HiOutlineCog6Tooth },
];

function Sidebar({ activePage = "dashboard", onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <div className="sidebar-label">Navigation</div>

        {MENU.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === activePage;

          return (
            <div
              key={item.id}
              className={`menu-item${isActive ? " active" : ""}${
                item.disabled ? " disabled" : ""
              }`}
              role="button"
              tabIndex={item.disabled ? -1 : 0}
              onClick={() => {
                if (!item.disabled && onNavigate) onNavigate(item.id);
              }}
              onKeyDown={(e) => {
                if (item.disabled) return;
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onNavigate?.(item.id);
                }
              }}
            >
              <Icon />
              {item.label}
            </div>
          );
        })}
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-footer-label">Environment</div>
        <div className="sidebar-footer-value">Production · v1.0</div>
      </div>
    </aside>
  );
}

export default Sidebar;
