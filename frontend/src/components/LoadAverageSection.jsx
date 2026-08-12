import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";
import "./LoadAverageSection.css";

const LOAD_CARDS = [
  {
    key: "1min",
    label: "1 Minute",
    short: "1m",
    color: "#38bdf8",
    description: "Immediate load",
  },
  {
    key: "5min",
    label: "5 Minutes",
    short: "5m",
    color: "#60a5fa",
    description: "Short-term load",
  },
  {
    key: "15min",
    label: "15 Minutes",
    short: "15m",
    color: "#2dd4bf",
    description: "Sustained load",
  },
];

function statusForLoad(value, cores) {
  const n = Number(value) || 0;
  const c = Math.max(Number(cores) || 1, 1);
  const ratio = n / c;

  if (ratio < 0.7) return { label: "Normal", tone: "healthy" };
  if (ratio < 1.0) return { label: "Elevated", tone: "warning" };
  return { label: "High", tone: "critical" };
}

function gaugePercent(value, cores) {
  const n = Number(value) || 0;
  const c = Math.max(Number(cores) || 1, 1);
  // Full scale at 2x cores
  return Math.min((n / (c * 2)) * 100, 100);
}

function LoadAverageSection({ loadAverage, cores }) {
  const load = loadAverage || {};

  return (
    <section className="dash-section load-avg-section">
      <div className="dash-section-header">
        <span className="dash-section-eyebrow">Capacity</span>
        <h2>Load Average</h2>
        <p>
          Host pressure over rolling windows
          {cores != null ? ` · ${cores} cores` : ""}.
        </p>
      </div>

      <div className="load-avg-grid stagger-children">
        {LOAD_CARDS.map((card) => {
          const raw = load[card.key];
          const value = raw != null ? Number(raw) : null;
          const display = value != null && !Number.isNaN(value) ? value.toFixed(2) : "—";
          const pct = gaugePercent(value ?? 0, cores);
          const status = statusForLoad(value ?? 0, cores);
          const data = [
            { name: card.short, value: pct, fill: card.color },
          ];

          return (
            <article
              key={card.key}
              className="load-card glass-panel glass-panel--glow"
              style={{ "--panel-accent": card.color }}
            >
              <div className="load-card-header">
                <div>
                  <h3>{card.label}</h3>
                  <p>{card.description}</p>
                </div>
                <span className={`load-status tone-${status.tone}`}>
                  <i />
                  {status.label}
                </span>
              </div>

              <div className="load-gauge">
                <ResponsiveContainer width="100%" height={160}>
                  <RadialBarChart
                    cx="50%"
                    cy="55%"
                    innerRadius="72%"
                    outerRadius="100%"
                    barSize={12}
                    data={data}
                    startAngle={210}
                    endAngle={-30}
                  >
                    <PolarAngleAxis
                      type="number"
                      domain={[0, 100]}
                      angleAxisId={0}
                      tick={false}
                    />
                    <RadialBar
                      background={{ fill: "rgba(148, 163, 184, 0.1)" }}
                      dataKey="value"
                      cornerRadius={10}
                      clockWise
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="load-gauge-center">
                  <strong style={{ color: card.color }}>{display}</strong>
                  <span>{card.short}</span>
                </div>
              </div>

              <div className="load-card-footer">
                <div className="load-bar">
                  <div
                    className="load-bar-fill"
                    style={{
                      width: `${pct}%`,
                      background: card.color,
                      boxShadow: `0 0 12px ${card.color}55`,
                    }}
                  />
                </div>
                <div className="load-footer-meta">
                  <span>Relative to capacity</span>
                  <span style={{ color: card.color }}>
                    {pct.toFixed(0)}%
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default LoadAverageSection;
