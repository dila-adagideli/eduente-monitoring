<div align="center">

# Eduente Monitoring

**Modern altyapı izleme ve sistem sağlığı paneli**

Grafana, Datadog ve New Relic tarzında dark theme bir monitoring deneyimi — sunucu metrikleri, servis durumu, log takibi ve API key yönetimi tek panelde.

<br />

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Laravel](https://img.shields.io/badge/Laravel-13-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)

</div>

---

## İçindekiler

- [Proje Hakkında](#proje-hakkında)
- [Öne Çıkan Özellikler](#öne-çıkan-özellikler)
- [Ekran Görüntüleri](#ekran-görüntüleri)
- [Teknoloji Yığını](#teknoloji-yığını)
- [Mimari](#mimari)
- [Kurulum](#kurulum)
- [API Özeti](#api-özeti)
- [Proje Yapısı](#proje-yapısı)
- [Geliştirici Notları](#geliştirici-notları)

---

## Proje Hakkında

**Eduente Monitoring**, sunucu ve uygulama altyapısının anlık durumunu izlemek için geliştirilmiş full-stack bir monitoring projesidir.

Panel üzerinden:

- CPU, RAM, disk ve response time gibi **canlı sistem metriklerini** takip edebilirsiniz.
- Laravel ve Redis gibi **servis bağımlılıklarının** durumunu görebilirsiniz.
- **Load average** ve **performans grafikleri** ile host yükünü analiz edebilirsiniz.
- API üzerinden gelen **istek loglarını** son kayıtlar halinde inceleyebilirsiniz.
- Kayıt sırasında oluşturulan **API Key** ile harici servislerden log gönderimi yapılabilir.

Frontend; glassmorphism, dark theme ve neon vurgularla modern bir SaaS monitoring arayüzü sunar. Veriler **5 saniyede bir** otomatik yenilenir.

---

## Öne Çıkan Özellikler

| Alan | Açıklama |
|------|----------|
| **Dashboard** | Üst seviye sistem sağlığı — metrik kartları, load average, Recharts grafikleri |
| **System Status** | Detaylı altyapı envanteri — host, hardware, software, health summary |
| **Logs** | Son 20 API isteği — method, URL, status, response time |
| **Settings** | API Key göster/gizle, kopyala; hesap ve güvenlik bilgileri |
| **Auth** | Register / Login / Logout — Laravel Sanctum token tabanlı oturum |
| **Canlı yenileme** | Dashboard, System Status ve Logs sayfalarında 5 sn polling |
| **Responsive** | Masaüstü tablo + mobil kart görünümü |

---

## Ekran Görüntüleri

> Screenshot'ları `docs/screenshots/` klasörüne ekleyin. Dosya adları aşağıdaki yollarla eşleşmelidir.

### Login

Giriş ekranı — email ve şifre ile oturum açma.

![Login ekranı](./docs/screenshots/login.png)

<!-- SS yolu: docs/screenshots/login.png -->

---

### Register

Yeni kullanıcı kaydı.

![Register ekranı](./docs/screenshots/register.png)

<!-- SS yolu: docs/screenshots/register.png -->

---

### Dashboard

Ana monitoring paneli — sunucu özeti, key metrics, load average ve performance charts.

![Dashboard](./docs/screenshots/dashboard.png)

<!-- SS yolu: docs/screenshots/dashboard.png -->

---

### System Status

Altyapı detayları — system overview, dependencies, health summary, system information.

![System Status](./docs/screenshots/system-status.png)

<!-- SS yolu: docs/screenshots/system-status.png -->

---

### Logs

Son API istek logları — method badge, HTTP status, result, response time.

![Logs](./docs/screenshots/logs.png)

<!-- SS yolu: docs/screenshots/logs.png -->

---

### Settings

API Key yönetimi, hesap bilgileri ve oturum güvenliği.

![Settings](./docs/screenshots/settings.png)

<!-- SS yolu: docs/screenshots/settings.png -->

---

## Teknoloji Yığını

### Frontend

| Teknoloji | Kullanım |
|-----------|----------|
| **React 19** | UI component yapısı |
| **Vite 8** | Build tool ve dev server |
| **Axios** | REST API istekleri |
| **Recharts** | CPU, RAM, disk, load ve latency grafikleri |
| **React Icons** | Heroicons & Font Awesome ikon seti |
| **CSS (Custom)** | Dark theme, glassmorphism, responsive grid |

### Backend

| Teknoloji | Kullanım |
|-----------|----------|
| **Laravel 13** | REST API ve iş mantığı |
| **PHP 8.3** | Sunucu tarafı |
| **Laravel Sanctum** | API token authentication |
| **PostgreSQL 17** | Kullanıcı ve log veritabanı |
| **Redis 7** | Cache / servis metrikleri |

### DevOps

| Teknoloji | Kullanım |
|-----------|----------|
| **Docker Compose** | Frontend, backend, PostgreSQL, Redis orchestration |

---

## Mimari

```
┌─────────────────────────────────────────────────────────────┐
│                     React Frontend (Vite)                    │
│  Login · Register · Dashboard · System Status · Logs · Settings │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTP / REST
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Laravel API (Port 8000)                    │
│  Auth · System Metrics · Request Logs · API Key Middleware   │
└───────────────┬─────────────────────────┬───────────────────┘
                │                         │
                ▼                         ▼
         ┌──────────────┐          ┌──────────────┐
         │  PostgreSQL  │          │    Redis     │
         └──────────────┘          └──────────────┘
```

**Veri akışı (özet):**

1. Kullanıcı **Register/Login** ile Sanctum token alır.
2. **Dashboard** `/api/system-status` üzerinden host metriklerini çeker.
3. **Logs** `/api/logs` üzerinden istek geçmişini listeler.
4. Harici servisler **API Key** ile `POST /api/log` endpoint'ine log gönderir.

---

## Kurulum

### Gereksinimler

- Docker & Docker Compose  
**veya**
- Node.js 20+, PHP 8.3+, Composer, PostgreSQL, Redis

### Docker ile (önerilen)

```bash
# Proje kök dizininde
docker compose up --build
```

| Servis | Adres |
|--------|-------|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| PostgreSQL | localhost:5432 |
| Redis | localhost:6379 |

### Manuel kurulum

**Backend:**

```bash
cd backend
composer install
cp .env.example .env   # gerekirse
php artisan key:generate
php artisan migrate
php artisan serve
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

Frontend varsayılan olarak `http://localhost:8000/api` adresine istek atar (`frontend/src/api/config.js`).

---

## API Özeti

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| `POST` | `/api/register` | Kullanıcı kaydı + API Key |
| `POST` | `/api/login` | Giriş + Sanctum token |
| `GET` | `/api/user` | Oturum açık kullanıcı (Sanctum) |
| `GET` | `/api/system-status` | Sunucu metrikleri ve health |
| `GET` | `/api/logs` | İstek log listesi |
| `POST` | `/api/log` | Log kaydı (API Key gerekli) |

---

## Proje Yapısı

```
Eduente-staj/
├── frontend/                 # React + Vite uygulaması
│   ├── src/
│   │   ├── pages/            # Dashboard, SystemStatus, Logs, Settings, Login...
│   │   ├── components/       # Navbar, Sidebar, StatCard, MetricCharts...
│   │   ├── context/          # AuthContext
│   │   ├── hooks/            # useSystemStatus, useLogs (5 sn polling)
│   │   └── utils/            # Tarih formatlama, auth storage
│   └── package.json
│
├── backend/                  # Laravel API
│   ├── app/Http/Controllers/
│   ├── routes/api.php
│   └── ...
│
├── docs/
│   └── screenshots/          # README ekran görüntüleri (buraya SS koy)
│
├── docker-compose.yml
└── README.md
```

---

## Geliştirici Notları

- **Tasarım dili:** Dark background, cyan/green neon vurgular, glass panel kartlar, Outfit + IBM Plex Mono fontları.
- **Otomatik yenileme:** `REFRESH_INTERVAL = 5000` ms (`frontend/src/hooks/useSystemStatus.js`).
- **Tarih formatı:** Backend UTC gönderir; frontend kullanıcı yerel saatine dönüştürür.
- **API Key:** Register sırasında oluşturulur; Settings sayfasından görüntülenir ve kopyalanır.
- **Response Time eşikleri:** 0–300 ms Healthy · 301–1000 ms Warning · 1000+ ms Critical.

---

<div align="center">

**Eduente Monitoring** — Infrastructure Observability

*Staj / eğitim amaçlı geliştirilmiş modern monitoring paneli*

</div>
