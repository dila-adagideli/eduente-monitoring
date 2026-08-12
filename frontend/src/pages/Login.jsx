import { useState } from "react";
import { HiOutlineServer } from "react-icons/hi2";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

function Login({ onNavigate }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(() => {
    const flash = sessionStorage.getItem("auth_flash");
    if (flash === "registered") {
      sessionStorage.removeItem("auth_flash");
      return "Kayıt başarılı. Giriş yapabilirsiniz.";
    }
    return "";
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setSuccess("");
    setLoading(true);

    const result = await login(email.trim(), password);
    setLoading(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    onNavigate?.("dashboard");
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <div className="auth-brand">
          <div className="auth-brand-icon">
            <HiOutlineServer size={22} />
          </div>
          <div className="auth-brand-text">
            <span className="auth-brand-title">Eduente Monitoring</span>
            <span className="auth-brand-sub">Infrastructure Observability</span>
          </div>
        </div>

        <div className="auth-card glass-panel glass-panel--glow">
          <div className="auth-card-header">
            <h1>Login</h1>
            <p>Sign in to access the monitoring dashboard.</p>
          </div>

          {success ? (
            <div className="auth-alert auth-alert-success" role="status">
              {success}
            </div>
          ) : null}

          {error ? (
            <div className="auth-alert auth-alert-error" role="alert">
              {error}
            </div>
          ) : null}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="login-email">Email</label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                disabled={loading}
              />
            </div>

            <div className="auth-field">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div className="auth-footer">
            No account?{" "}
            <button
              type="button"
              onClick={() => onNavigate?.("register")}
              disabled={loading}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
