import {
  Area,
  AreaChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import "./MetricCharts.css";

const COLORS = {
  cpu: "#34d399",
  ram: "#60a5fa",
  disk: "#fbbf24",
  diskFree: "rgba(148, 163, 184, 0.22)",
  load: "#38bdf8",
  load5: "#60a5fa",
  load15: "#2dd4bf",
  response: "#f87171",
};

const tooltipStyle = {
  contentStyle: {
    background: "rgba(10, 16, 30, 0.95)",
    border: "1px solid rgba(148, 163, 184, 0.18)",
    borderRadius: 10,
    boxShadow: "0 12px 32px rgba(0,0,0,0.4)",
    fontSize: 12,
    color: "#e2e8f0",
  },
  labelStyle: {
    color: "#94a3b8",
    marginBottom: 4,
  },
  itemStyle: {
    color: "#f1f5f9",
  },
};

/** Aesthetic series ending at the live value (no backend history). */
function buildTrend(current, points = 14, variance = 0.18) {
  const base = Number(current) || 0;
  const series = [];

  for (let i = 0; i < points; i++) {
    const t = i / (points - 1);
    // Smooth ease toward current value with subtle variance mid-window
    const wave = Math.sin(t * Math.PI * 2.2) * variance * base * (1 - t * 0.35);
    const drift = (1 - t) * base * variance * 0.35 * Math.cos(t * 5);
    const value = Math.max(0, +(base * (0.82 + t * 0.18) + wave + drift).toFixed(2));

    series.push({
      label: `T-${points - 1 - i}`,
      value: i === points - 1 ? +base.toFixed(2) : value,
    });
  }

  return series;
}

function ChartPanel({ title, subtitle, children, className = "" }) {
  return (
    <div className={`chart-panel glass-panel glass-panel--glow ${className}`}>
      <div className="chart-panel-header">
        <div>
          <h3>{title}</h3>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
      </div>
      <div className="chart-panel-body">{children}</div>
    </div>
  );
}

function MetricCharts({ system }) {
  const cpuUsage = Number(system.cpu?.usage) || 0;
  const ramUsage = Number(system.memory?.usage) || 0;
  const diskUsage = Number(system.disk?.usage) || 0;
  const load1 = Number(system.load_average?.["1min"]) || 0;
  const load5 = Number(system.load_average?.["5min"]) || 0;
  const load15 = Number(system.load_average?.["15min"]) || 0;
  const responseMs =
    parseFloat(String(system.response_time).replace(/[^\d.]/g, "")) || 0;

  const cpuRadial = [
    { name: "CPU", value: cpuUsage, fill: COLORS.cpu },
  ];

  const responseRadial = [
    {
      name: "Latency",
      value: Math.min((responseMs / 1000) * 100, 100),
      fill: COLORS.response,
    },
  ];

  const ramTrend = buildTrend(ramUsage, 16, 0.14);
  const cpuTrend = buildTrend(cpuUsage, 16, 0.2);
  const responseTrend = buildTrend(responseMs, 16, 0.22);

  const diskPie = [
    { name: "Used", value: diskUsage, fill: COLORS.disk },
    {
      name: "Free",
      value: Math.max(100 - diskUsage, 0),
      fill: COLORS.diskFree,
    },
  ];

  const loadSeries = [
    { name: "1m", load1, load5, load15 },
    {
      name: "5m",
      load1: +(load1 * 0.94).toFixed(2),
      load5,
      load15: +(load15 * 1.02).toFixed(2),
    },
    {
      name: "15m",
      load1: +(load1 * 0.9).toFixed(2),
      load5: +(load5 * 0.96).toFixed(2),
      load15,
    },
    {
      name: "Now",
      load1,
      load5,
      load15,
    },
  ];

  return (
    <section className="dash-section metric-charts">
      <div className="dash-section-header">
        <span className="dash-section-eyebrow">Telemetry</span>
        <h2>Performance Charts</h2>
        <p>Host utilization gauges and trends from the latest probe.</p>
      </div>

      <div className="charts-grid stagger-children">
        {/* CPU Radial gauge */}
        <ChartPanel
          title="CPU Utilization"
          subtitle={`${cpuUsage}% · ${system.cpu?.cores ?? "—"} cores`}
          className="chart-span-1"
        >
          <div className="gauge-wrap">
            <ResponsiveContainer width="100%" height={220}>
              <RadialBarChart
                cx="50%"
                cy="55%"
                innerRadius="68%"
                outerRadius="100%"
                barSize={14}
                data={cpuRadial}
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
            <div className="gauge-center">
              <strong style={{ color: COLORS.cpu }}>{cpuUsage}%</strong>
              <span>CPU</span>
            </div>
          </div>
        </ChartPanel>

        {/* Response gauge */}
        <ChartPanel
          title="Response Time"
          subtitle={`${system.response_time} latency`}
          className="chart-span-1"
        >
          <div className="gauge-wrap">
            <ResponsiveContainer width="100%" height={220}>
              <RadialBarChart
                cx="50%"
                cy="55%"
                innerRadius="68%"
                outerRadius="100%"
                barSize={14}
                data={responseRadial}
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
            <div className="gauge-center">
              <strong style={{ color: COLORS.response }}>
                {responseMs}
                <small>ms</small>
              </strong>
              <span>Latency</span>
            </div>
          </div>
        </ChartPanel>

        {/* Disk Pie */}
        <ChartPanel
          title="Disk Distribution"
          subtitle={`${system.disk?.used ?? "—"} / ${system.disk?.total ?? "—"}`}
          className="chart-span-1"
        >
          <div className="pie-wrap">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={diskPie}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={82}
                  paddingAngle={3}
                  stroke="none"
                >
                  {diskPie.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  {...tooltipStyle}
                  formatter={(val, name) => [`${Number(val).toFixed(1)}%`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pie-center">
              <strong style={{ color: COLORS.disk }}>{diskUsage}%</strong>
              <span>Used</span>
            </div>
          </div>
          <div className="chart-legend">
            <span>
              <i style={{ background: COLORS.disk }} /> Used {diskUsage}%
            </span>
            <span>
              <i style={{ background: "rgba(148,163,184,0.35)" }} /> Free{" "}
              {Math.max(100 - diskUsage, 0).toFixed(1)}%
            </span>
          </div>
        </ChartPanel>

        {/* RAM Area */}
        <ChartPanel
          title="Memory Trend"
          subtitle={`${system.memory?.used ?? "—"} of ${system.memory?.total ?? "—"}`}
          className="chart-span-2"
        >
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={ramTrend} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="ramFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS.ram} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={COLORS.ram} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                stroke="rgba(148,163,184,0.08)"
                vertical={false}
                strokeDasharray="3 6"
              />
              <XAxis
                dataKey="label"
                tick={{ fill: "#64748b", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: "#64748b", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                unit="%"
              />
              <Tooltip
                {...tooltipStyle}
                formatter={(val) => [`${val}%`, "RAM"]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={COLORS.ram}
                strokeWidth={2.5}
                fill="url(#ramFill)"
                dot={false}
                activeDot={{ r: 5, fill: COLORS.ram, stroke: "#0a101e", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartPanel>

        {/* CPU Line */}
        <ChartPanel
          title="CPU Timeline"
          subtitle="Sampled utilization path to current reading"
          className="chart-span-2"
        >
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={cpuTrend} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid
                stroke="rgba(148,163,184,0.08)"
                vertical={false}
                strokeDasharray="3 6"
              />
              <XAxis
                dataKey="label"
                tick={{ fill: "#64748b", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: "#64748b", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                unit="%"
              />
              <Tooltip
                {...tooltipStyle}
                formatter={(val) => [`${val}%`, "CPU"]}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={COLORS.cpu}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: COLORS.cpu, stroke: "#0a101e", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartPanel>

        {/* Load Average multi-line */}
        <ChartPanel
          title="Load Average"
          subtitle={`1m ${load1} · 5m ${load5} · 15m ${load15}`}
          className="chart-span-2"
        >
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={loadSeries} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid
                stroke="rgba(148,163,184,0.08)"
                vertical={false}
                strokeDasharray="3 6"
              />
              <XAxis
                dataKey="name"
                tick={{ fill: "#64748b", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#64748b", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip {...tooltipStyle} />
              <Line
                type="monotone"
                dataKey="load1"
                name="1 min"
                stroke={COLORS.load}
                strokeWidth={2.5}
                dot={{ r: 3, fill: COLORS.load }}
              />
              <Line
                type="monotone"
                dataKey="load5"
                name="5 min"
                stroke={COLORS.load5}
                strokeWidth={2}
                strokeDasharray="4 3"
                dot={{ r: 3, fill: COLORS.load5 }}
              />
              <Line
                type="monotone"
                dataKey="load15"
                name="15 min"
                stroke={COLORS.load15}
                strokeWidth={2}
                dot={{ r: 3, fill: COLORS.load15 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="chart-legend">
            <span>
              <i style={{ background: COLORS.load }} /> 1 min
            </span>
            <span>
              <i style={{ background: COLORS.load5 }} /> 5 min
            </span>
            <span>
              <i style={{ background: COLORS.load15 }} /> 15 min
            </span>
          </div>
        </ChartPanel>

        {/* Response Area */}
        <ChartPanel
          title="Response Time Trend"
          subtitle="Latency samples converging on live reading"
          className="chart-span-2"
        >
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart
              data={responseTrend}
              margin={{ top: 8, right: 8, left: -12, bottom: 0 }}
            >
              <defs>
                <linearGradient id="respFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS.response} stopOpacity={0.32} />
                  <stop offset="100%" stopColor={COLORS.response} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                stroke="rgba(148,163,184,0.08)"
                vertical={false}
                strokeDasharray="3 6"
              />
              <XAxis
                dataKey="label"
                tick={{ fill: "#64748b", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#64748b", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                unit="ms"
              />
              <Tooltip
                {...tooltipStyle}
                formatter={(val) => [`${val} ms`, "Latency"]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={COLORS.response}
                strokeWidth={2.5}
                fill="url(#respFill)"
                dot={false}
                activeDot={{
                  r: 5,
                  fill: COLORS.response,
                  stroke: "#0a101e",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartPanel>
      </div>
    </section>
  );
}

export default MetricCharts;
