import { useEffect, useState } from "react";
import {
  HiOutlineKey,
  HiOutlineUserCircle,
  HiOutlineShieldCheck,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineClipboardDocument,
  HiOutlineCheck,
} from "react-icons/hi2";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import "./Settings.css";

function Settings({ activePage = "settings", onNavigate, onLogout }) {
  const { user, apiKey, token } = useAuth();
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  // Prefer dedicated apiKey storage; also accept user.api_key if present
  const resolvedKey = apiKey || user?.api_key || "";

  useEffect(() => {
    if (!copied) return undefined;
    const t = setTimeout(() => setCopied(false), 2200);
    return () => clearTimeout(t);
  }, [copied]);

  const handleCopy = async () => {
    if (!resolvedKey) return;
    try {
      await navigator.clipboard.writeText(resolvedKey);
      setCopied(true);
    } catch {
      // Fallback for older browsers / insecure context
      const el = document.createElement("textarea");
      el.value = resolvedKey;
      el.setAttribute("readonly", "");
      el.style.position = "absolute";
      el.style.left = "-9999px";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
    }
  };

  const masked =
    resolvedKey.length > 0
      ? "•".repeat(Math.min(Math.max(resolvedKey.length, 24), 40))
      : "—";

  const displayName = user?.name || "—";
  const displayEmail = user?.email || "—";
  const displayId =
    user?.id != null && user?.id !== "" ? String(user.id) : "—";

  return (
    <div className="app">
      <Navbar onLogout={onLogout} />

      <div className="content">
        <Sidebar activePage={activePage} onNavigate={onNavigate} />

        <main className="dashboard">
          <header className="dashboard-header">
            <div className="dashboard-header-text">
              <span className="dashboard-eyebrow">Account</span>
              <h1>Settings</h1>
              <p>
                Manage your profile and the API key used by monitoring agents.
              </p>
            </div>
          </header>

          <div className="settings-grid section-reveal">
            {/* API Key */}
            <section className="settings-card glass-panel glass-panel--glow">
              <div className="settings-card-header">
                <div className="settings-card-icon" style={{ color: "#38bdf8" }}>
                  <HiOutlineKey />
                </div>
                <div>
                  <h2>API Key</h2>
                  <p>
                    Use this key when external services send logs to the
                    monitoring system. It is unique to your account and
                    permanent — no regenerate option here.
                  </p>
                </div>
              </div>

              <div className="api-key-row">
                <code className="api-key-value" title={visible ? resolvedKey : undefined}>
                  {visible && resolvedKey ? resolvedKey : masked}
                </code>

                <div className="api-key-actions">
                  <button
                    type="button"
                    className="settings-icon-btn"
                    onClick={() => setVisible((v) => !v)}
                    aria-label={visible ? "Hide API key" : "Show API key"}
                    disabled={!resolvedKey}
                  >
                    {visible ? (
                      <HiOutlineEyeSlash size={18} />
                    ) : (
                      <HiOutlineEye size={18} />
                    )}
                  </button>

                  <button
                    type="button"
                    className="settings-btn settings-btn-primary"
                    onClick={handleCopy}
                    disabled={!resolvedKey}
                  >
                    {copied ? (
                      <>
                        <HiOutlineCheck size={16} />
                        Copied
                      </>
                    ) : (
                      <>
                        <HiOutlineClipboardDocument size={16} />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              {!resolvedKey ? (
                <p className="settings-hint">
                  No API key found in the current session. Sign out and log in
                  again so the key can load from authentication.
                </p>
              ) : null}
            </section>

            {/* Account */}
            <section className="settings-card glass-panel glass-panel--glow">
              <div className="settings-card-header">
                <div className="settings-card-icon" style={{ color: "#34d399" }}>
                  <HiOutlineUserCircle />
                </div>
                <div>
                  <h2>Account</h2>
                  <p>Profile details from your current login session.</p>
                </div>
              </div>

              <div className="settings-fields">
                <div className="settings-field">
                  <span>Name</span>
                  <strong>{displayName}</strong>
                </div>
                <div className="settings-field">
                  <span>Email</span>
                  <strong>{displayEmail}</strong>
                </div>
                <div className="settings-field">
                  <span>User ID</span>
                  <strong className="settings-mono">{displayId}</strong>
                </div>
              </div>
            </section>

            {/* Security */}
            <section className="settings-card glass-panel glass-panel--glow">
              <div className="settings-card-header">
                <div className="settings-card-icon" style={{ color: "#fbbf24" }}>
                  <HiOutlineShieldCheck />
                </div>
                <div>
                  <h2>Security</h2>
                  <p>Session status and sign-out for this console.</p>
                </div>
              </div>

              <div className="settings-security-row">
                <div className="settings-session">
                  <span className="settings-session-badge">
                    <i />
                    {token ? "Signed in" : "Signed out"}
                  </span>
                  <p>
                    You are authenticated to Eduente Monitoring. Logging out
                    clears this browser session.
                  </p>
                </div>

                <button
                  type="button"
                  className="settings-btn settings-btn-danger"
                  onClick={() => onLogout?.()}
                >
                  Logout
                </button>
              </div>
            </section>
          </div>

          {copied ? (
            <div className="settings-toast" role="status">
              API Key copied
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
}

export default Settings;
