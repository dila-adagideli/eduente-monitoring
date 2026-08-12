import "./DashboardSkeleton.css";

function SkBlock({ className = "", style }) {
  return <div className={`skeleton ${className}`} style={style} />;
}

function DashboardSkeleton() {
  return (
    <div className="app skeleton-app">
      <div className="skel-navbar glass-panel" style={{ borderRadius: 0 }}>
        <div className="skel-nav-left">
          <SkBlock className="skel-avatar" />
          <div className="skel-nav-text">
            <SkBlock className="skeleton-line" style={{ width: 160 }} />
            <SkBlock className="skeleton-line" style={{ width: 110, marginTop: 8 }} />
          </div>
        </div>
        <div className="skel-nav-right">
          <SkBlock className="skeleton-line" style={{ width: 72, height: 28, borderRadius: 999 }} />
          <SkBlock className="skel-avatar" />
        </div>
      </div>

      <div className="content">
        <aside className="skel-sidebar">
          <SkBlock className="skeleton-line" style={{ width: 80, marginBottom: 16 }} />
          {[1, 2, 3, 4].map((i) => (
            <SkBlock
              key={i}
              className="skeleton-line"
              style={{ height: 40, marginBottom: 8, borderRadius: 10 }}
            />
          ))}
        </aside>

        <main className="dashboard skel-main">
          <div className="skel-header">
            <div>
              <SkBlock className="skeleton-line" style={{ width: 90, marginBottom: 12 }} />
              <SkBlock className="skeleton-line xl" style={{ width: 240, marginBottom: 10 }} />
              <SkBlock className="skeleton-line" style={{ width: 320, maxWidth: "100%" }} />
            </div>
            <div className="skel-chips">
              <SkBlock className="skeleton-line" style={{ width: 120, height: 34, borderRadius: 999 }} />
              <SkBlock className="skeleton-line" style={{ width: 140, height: 34, borderRadius: 999 }} />
            </div>
          </div>

          <div className="skeleton-block skel-overview">
            <div className="skel-overview-top">
              <SkBlock className="skeleton-line xl" style={{ width: 200 }} />
              <SkBlock className="skeleton-line" style={{ width: 90, height: 32, borderRadius: 999 }} />
            </div>
            <div className="skel-overview-grid">
              {[1, 2, 3].map((i) => (
                <SkBlock key={i} className="skel-tile" />
              ))}
            </div>
          </div>

          <div className="skel-section-label">
            <SkBlock className="skeleton-line" style={{ width: 70, marginBottom: 10 }} />
            <SkBlock className="skeleton-line lg" style={{ width: 140 }} />
          </div>

          <div className="cards skel-cards">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton-block skel-card">
                <div className="skel-card-top">
                  <SkBlock className="skel-icon" />
                  <SkBlock className="skeleton-line" style={{ width: 80 }} />
                </div>
                <SkBlock className="skeleton-line xl" style={{ width: 100, margin: "18px 0" }} />
                <SkBlock className="skeleton-line" style={{ height: 7, borderRadius: 999 }} />
              </div>
            ))}
          </div>

          <div className="skel-section-label" style={{ marginTop: 36 }}>
            <SkBlock className="skeleton-line" style={{ width: 90, marginBottom: 10 }} />
            <SkBlock className="skeleton-line lg" style={{ width: 140 }} />
          </div>

          <div className="skel-load-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton-block skel-card" style={{ minHeight: 200 }}>
                <SkBlock className="skeleton-line" style={{ width: 100, marginBottom: 16 }} />
                <SkBlock
                  className="skel-icon"
                  style={{
                    width: 96,
                    height: 96,
                    borderRadius: "50%",
                    margin: "12px auto",
                  }}
                />
                <SkBlock className="skeleton-line" style={{ height: 7, borderRadius: 999, marginTop: 16 }} />
              </div>
            ))}
          </div>

          <div className="skel-loading-caption">
            <span className="skel-pulse-dot" />
            Loading system telemetry…
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardSkeleton;
