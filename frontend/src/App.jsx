import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import SystemStatus from "./pages/SystemStatus";
import Logs from "./pages/Logs";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "./App.css";
import "./pages/Auth.css";

function AppRoutes() {
  const { isAuthenticated, logout } = useAuth();
  const [page, setPage] = useState(() =>
    localStorage.getItem("eduente_auth_token") ? "dashboard" : "login"
  );

  const handleNavigate = (next) => {
    if (!isAuthenticated && next !== "login" && next !== "register") {
      setPage("login");
      return;
    }
    if (isAuthenticated && (next === "login" || next === "register")) {
      setPage("dashboard");
      return;
    }
    setPage(next);
  };

  const handleLogout = () => {
    logout();
    setPage("login");
  };

  if (!isAuthenticated) {
    if (page === "register") {
      return <Register onNavigate={handleNavigate} />;
    }
    return <Login onNavigate={handleNavigate} />;
  }

  if (page === "system-status") {
    return (
      <SystemStatus
        activePage={page}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
    );
  }

  if (page === "logs") {
    return (
      <Logs
        activePage={page}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
    );
  }

  if (page === "settings") {
    return (
      <Settings
        activePage={page}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <Dashboard
      activePage="dashboard"
      onNavigate={handleNavigate}
      onLogout={handleLogout}
    />
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
