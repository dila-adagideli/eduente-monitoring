import {
  FaLaravel,
  FaDatabase,
  FaCircle,
} from "react-icons/fa";
import "./ServicesSection.css";
import { displayValue, isOnlineStatus } from "../utils/systemFormat";

function normalizeLaravel(laravel) {
  if (!laravel || typeof laravel !== "object") {
    return {
      name: "Laravel",
      online: false,
      status: displayValue(null),
      version: displayValue(null),
      php: displayValue(null),
      environment: displayValue(null),
      debug: displayValue(null),
    };
  }

  const status = laravel.status;
  return {
    name: "Laravel",
    online: isOnlineStatus(status),
    status: displayValue(status),
    version: displayValue(laravel.version),
    php: displayValue(laravel.php),
    environment: displayValue(laravel.environment),
    debug: displayValue(laravel.debug),
  };
}

function normalizeRedis(redis) {
  if (!redis || typeof redis !== "object") {
    return {
      name: "Redis",
      online: false,
      status: displayValue(null),
      version: displayValue(null),
      clients: displayValue(null),
      memory: displayValue(null),
    };
  }

  const status = redis.status;
  return {
    name: "Redis",
    online: isOnlineStatus(status),
    status: displayValue(status),
    version: displayValue(redis.version),
    clients: displayValue(redis.clients),
    memory: displayValue(redis.memory),
  };
}

function ServiceCard({ service, type }) {
  const isLaravel = type === "laravel";
  const accent = isLaravel ? "#f87171" : "#fbbf24";
  const Icon = isLaravel ? FaLaravel : FaDatabase;

  return (
    <article
      className={`service-card glass-panel glass-panel--glow ${
        service.online ? "is-online" : "is-offline"
      }`}
      style={{ "--panel-accent": accent }}
    >
      <div className="service-card-top">
        <div className="service-icon" style={{ color: accent }}>
          <Icon />
        </div>

        <div className="service-identity">
          <h3>{service.name}</h3>
          <span className={`service-badge ${service.online ? "online" : "offline"}`}>
            <FaCircle size={7} />
            {service.status}
          </span>
        </div>
      </div>

      <div className="service-fields">
        {isLaravel ? (
          <>
            <div className="service-field">
              <span>Laravel Version</span>
              <strong>{service.version}</strong>
            </div>
            <div className="service-field">
              <span>PHP Version</span>
              <strong>{service.php}</strong>
            </div>
            <div className="service-field">
              <span>Environment</span>
              <strong className="env-tag">{service.environment}</strong>
            </div>
            <div className="service-field">
              <span>Status</span>
              <strong>{service.status}</strong>
            </div>
          </>
        ) : (
          <>
            <div className="service-field">
              <span>Redis Version</span>
              <strong>{service.version}</strong>
            </div>
            <div className="service-field">
              <span>Connected Clients</span>
              <strong>{service.clients}</strong>
            </div>
            <div className="service-field">
              <span>Memory Usage</span>
              <strong>{service.memory}</strong>
            </div>
            <div className="service-field">
              <span>Status</span>
              <strong>{service.status}</strong>
            </div>
          </>
        )}
      </div>
    </article>
  );
}

function ServicesSection({ services }) {
  const laravel = normalizeLaravel(services?.laravel);
  const redis = normalizeRedis(services?.redis);

  return (
    <section className="dash-section services-section">
      <div className="dash-section-header">
        <span className="dash-section-eyebrow">Dependencies</span>
        <h2>Dependencies / Services</h2>
        <p>Application runtime and cache layer health.</p>
      </div>

      <div className="services-grid stagger-children">
        <ServiceCard service={laravel} type="laravel" />
        <ServiceCard service={redis} type="redis" />
      </div>
    </section>
  );
}

export default ServicesSection;
