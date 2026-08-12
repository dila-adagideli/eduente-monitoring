import { useState } from "react";
import { HiOutlineServer } from "react-icons/hi2";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

function Register({ onNavigate }) {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setFieldErrors({});

    if (password.length < 6) {
      setFieldErrors({ password: "Şifre en az 6 karakter olmalı." });
      return;
    }

    if (password !== passwordConfirm) {
      setFieldErrors({ password_confirmation: "Şifreler eşleşmiyor." });
      return;
    }

    setLoading(true);
    const result = await register({
      name: name.trim(),
      email: email.trim(),
      password,
    });
    setLoading(false);

    if (!result.ok) {
      setError(result.message);
      if (result.errors) {
        const mapped = {};
        Object.entries(result.errors).forEach(([key, messages]) => {
          mapped[key] = Array.isArray(messages) ? messages[0] : String(messages);
        });
        setFieldErrors(mapped);
      }
      return;
    }

    sessionStorage.setItem("auth_flash", "registered");
    onNavigate?.("login");
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
            <h1>Register</h1>
            <p>Create an account to open the monitoring console.</p>
          </div>

          {error ? (
            <div className="auth-alert auth-alert-error" role="alert">
              {error}
            </div>
          ) : null}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="reg-name">Name</label>
              <input
                id="reg-name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                disabled={loading}
              />
              {fieldErrors.name ? (
                <span className="auth-field-error">{fieldErrors.name}</span>
              ) : null}
            </div>

            <div className="auth-field">
              <label htmlFor="reg-email">Email</label>
              <input
                id="reg-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                disabled={loading}
              />
              {fieldErrors.email ? (
                <span className="auth-field-error">{fieldErrors.email}</span>
              ) : null}
            </div>

            <div className="auth-field">
              <label htmlFor="reg-password">Password</label>
              <input
                id="reg-password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                required
                minLength={6}
                disabled={loading}
              />
              {fieldErrors.password ? (
                <span className="auth-field-error">{fieldErrors.password}</span>
              ) : null}
            </div>

            <div className="auth-field">
              <label htmlFor="reg-password-confirm">Confirm password</label>
              <input
                id="reg-password-confirm"
                type="password"
                autoComplete="new-password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="Repeat password"
                required
                minLength={6}
                disabled={loading}
              />
              {fieldErrors.password_confirmation ? (
                <span className="auth-field-error">
                  {fieldErrors.password_confirmation}
                </span>
              ) : null}
            </div>

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <div className="auth-footer">
            Already registered?{" "}
            <button
              type="button"
              onClick={() => onNavigate?.("login")}
              disabled={loading}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
