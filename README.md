# 🚀 Eduente Monitoring

**Eduente Monitoring**, sunucu ve uygulama durumunu gerçek zamanlı olarak izlemek, sistem kaynaklarını takip etmek ve uygulama isteklerini merkezi bir log ekranında görüntülemek amacıyla geliştirilmiş bir **web tabanlı monitoring sistemi**dir.

Proje kapsamında sunucunun **CPU, RAM, disk, işletim sistemi, load average ve servis durumları** takip edilebilmekte; uygulama içerisinde gerçekleşen API istekleri loglanarak kullanıcıya sunulmaktadır.

Dashboard verileri otomatik olarak güncellenerek sistemin güncel durumu anlık olarak takip edilebilir.

---

## ✨ Özellikler

### 📊 System Monitoring

Dashboard üzerinden sunucunun temel sistem metrikleri görüntülenebilir:

* CPU kullanım oranı
* CPU modeli ve çekirdek sayısı
* RAM kullanım oranı
* Disk kullanım oranı
* Load Average

  * 1 dakika
  * 5 dakika
  * 15 dakika
* İşletim sistemi bilgileri
* Kernel bilgisi
* Sistem uptime
* Sunucunun boot zamanı
* Laravel ve PHP bilgileri
* Redis durumu
* Redis bellek kullanımı
* Redis bağlı client sayısı
* Genel sistem health durumu

Dashboard üzerindeki sistem verileri **5 saniyede bir otomatik olarak güncellenmektedir.**

---

### 📝 Request Logging

Sistemde gerçekleşen API istekleri merkezi olarak loglanmaktadır.

Her log kaydında:

* HTTP Method
* URL
* Controller
* HTTP Status Code
* İşlem sonucu
* IP adresi
* Request bilgileri
* Response time
* Created at

gibi bilgiler tutulmaktadır.

Hassas bilgilerin loglanmasını önlemek amacıyla password ve password confirmation gibi alanlar filtrelenmektedir.

---

### 📋 Logs Dashboard

Frontend üzerinde oluşturulan Logs sayfası sayesinde sistemde oluşan istek kayıtları görüntülenebilir.

* En güncel log kayıtları görüntülenir.
* HTTP methodlarına göre kayıtlar incelenebilir.
* Status code ve işlem sonucu takip edilebilir.
* Response time görüntülenebilir.
* Log oluşturulma zamanı kullanıcının yerel saatine çevrilerek gösterilir.

---

### 🔐 Authentication

Kullanıcı yönetimi için authentication yapısı bulunmaktadır.

Desteklenen işlemler:

* Register
* Login
* Logout
* Kullanıcı bilgilerinin görüntülenmesi
* Authenticated API erişimi

Authentication işlemlerinde **Laravel Sanctum** kullanılmıştır.

---

### 🔑 API Key

Her kullanıcı için monitoring API'sine erişimde kullanılabilecek özel bir API Key bulunmaktadır.

API Key:

* Kullanıcıya özeldir.
* Settings ekranından görüntülenebilir.
* Maskeli olarak gösterilebilir.
* Tek tıklamayla kopyalanabilir.
* Harici servislerin monitoring sistemine log göndermesi için kullanılabilir.

Örneğin harici bir uygulama aşağıdaki yapıyla monitoring sistemine log gönderebilir:

```http
POST /api/log
X-API-KEY: YOUR_API_KEY
Content-Type: application/json
```

Bu yapı sayesinde monitoring sistemi yalnızca kendi frontend'inden değil, farklı uygulama ve servislerden de log alabilecek şekilde tasarlanmıştır.

---

### ⚙️ Settings

Settings sayfasında kullanıcıya ait:

* API Key
* Kullanıcı adı
* E-posta
* Kullanıcı ID
* Oturum durumu

görüntülenebilir.

Ayrıca kullanıcı sistemden logout olabilir.

---

### ❤️ Health Monitoring

Sistem kaynaklarının belirlenen eşiklere göre durumu kontrol edilmektedir.

CPU, RAM ve disk kullanımı belirlenen seviyelere göre:

* `healthy`
* `warning`
* `critical`

olarak değerlendirilir.

Redis ve Laravel servislerinin durumları da health bilgisine dahil edilmektedir.

---

## 🏗️ Proje Mimarisi

Proje frontend ve backend olmak üzere iki ana bölümden oluşmaktadır.

```text
                    ┌─────────────────────┐
                    │      Frontend       │
                    │      React + Vite   │
                    └──────────┬──────────┘
                               │
                         REST API / JSON
                               │
                    ┌──────────▼──────────┐
                    │       Backend       │
                    │   Laravel 13 API    │
                    └───────┬───────┬──────┘
                            │       │
                    ┌───────▼───┐ ┌─▼────────┐
                    │ PostgreSQL│ │  Redis   │
                    └───────────┘ └──────────┘
```

Backend tarafında sistem metrikleri işletim sisteminden alınarak API üzerinden frontend'e aktarılmaktadır.

Request logging yapısı middleware üzerinden çalışmaktadır.

---

## 🛠️ Kullanılan Teknolojiler

### Backend

* **PHP 8.4**
* **Laravel 13**
* **Laravel Sanctum**
* **Laravel REST API**
* **Eloquent ORM**

### Frontend

* **React**
* **Vite**
* **JavaScript**
* **CSS**

### Database & Cache

* **PostgreSQL**
* **Redis**

### DevOps / Development

* **Docker**
* **Docker Compose**
* **Git**
* **GitHub**
* **Postman**
* **DBeaver**
* **VS Code**

---

## 🐳 Docker

Proje geliştirme ortamı Docker ve Docker Compose kullanılarak hazırlanmıştır.

Temel servisler:

```text
Frontend
   │
   └── React / Vite

Backend
   │
   └── Laravel / PHP

Database
   │
   └── PostgreSQL

Cache
   │
   └── Redis
```

Projenin çalıştırılması için Docker'ın sistemde kurulu olması gerekir.

### Projeyi Başlatma

Repository klonlandıktan sonra:

```bash
git clone <repository-url>

cd Eduente-staj
```

Ardından:

```bash
docker compose up --build
```

Docker container'ları çalışmaya başladıktan sonra frontend ve backend servisleri üzerinden uygulamaya erişilebilir.

---

## 🔌 API Endpoints

### Authentication

```http
POST /api/register
POST /api/login
```

### System Monitoring

```http
GET /api/system-status
```

### Logs

```http
GET /api/logs
POST /api/log
```

`POST /api/log` endpoint'i API Key ile korunmaktadır.

### User

```http
GET /api/user
```

Bu endpoint authentication gerektirir.

---

## 📡 Monitoring Data

`/api/system-status` endpoint'i sistem hakkında aşağıdaki bilgileri döndürmektedir:

```json
{
  "server": {},
  "os": {},
  "cpu": {},
  "load_average": {},
  "memory": {},
  "disk": {},
  "services": {},
  "health": {},
  "response_time": "ms",
  "updated_at": "UTC"
}
```

`updated_at` backend tarafında UTC olarak tutulurken frontend tarafında kullanıcının yerel saatine dönüştürülmektedir.

---

## 🔒 Güvenlik

Projede temel güvenlik önlemleri uygulanmıştır:

* Laravel Sanctum authentication
* API Key doğrulama
* Hassas request alanlarının loglanmaması
* Password bilgilerinin loglardan çıkarılması
* Authenticated endpoint'lerin korunması
* API erişiminin kontrollü gerçekleştirilmesi

> **Not:** Gerçek production ortamında `.env` dosyası ve API Key gibi hassas bilgiler kesinlikle repository'ye gönderilmemelidir.

---

## 🧪 Test

API geliştirme ve kontrol süreçlerinde **Postman** kullanılmıştır.

Test edilen temel işlemler:

* Register
* Login
* Logout
* API Key doğrulama
* System Status
* Log gönderme
* Log listeleme
* Request logging
* Dashboard sistem metrikleri

Frontend tarafında ise Dashboard, Logs ve Settings ekranlarının kullanıcı akışları test edilmiştir.

Ayrıca proje geliştirme sürecinde farklı bir eğitim uygulaması geliştiren ekibe destek amacıyla çeşitli testler gerçekleştirilmiş ve test sonuçları doğrultusunda geri bildirimlerde bulunulmuştur.

---

## 📸 Screenshots

### Dashboard

><img width="1901" height="897" alt="image" src="https://github.com/user-attachments/assets/92d93dbc-ae3a-40b1-84b8-beaa92d5de29" />
<img width="1907" height="892" alt="image" src="https://github.com/user-attachments/assets/e1492568-275f-4771-98ba-2f7d28b7c891" />
<img width="1912" height="876" alt="image" src="https://github.com/user-attachments/assets/c9d08426-5119-40b8-bef8-292d3b661a1e" />
<img width="1912" height="900" alt="image" src="https://github.com/user-attachments/assets/7d9ba6c7-e0a7-4ad8-87ca-69e546cb04f5" />

### Logs

> Buraya Logs ekran görüntüsü eklenebilir.

### Settings

> Buraya Settings ekran görüntüsü eklenebilir.

---

## 🎯 Projenin Amacı

Bu proje yalnızca sistem bilgilerinin ekranda gösterilmesi amacıyla değil, **gerçek bir monitoring sisteminin temel mimarisini oluşturmak** amacıyla geliştirilmiştir.

Proje ile:

* Sistem kaynaklarının izlenmesi
* API isteklerinin merkezi olarak kaydedilmesi
* Kullanıcı authentication işlemleri
* API Key tabanlı servis iletişimi
* Harici uygulamalardan log alınabilmesi
* Sistem health durumunun takip edilmesi

gibi temel monitoring ihtiyaçlarının tek bir platform üzerinden yönetilmesi hedeflenmiştir.

---

## 🔮 Gelecekte Eklenebilecek Özellikler

Projenin ilerleyen aşamalarında aşağıdaki özellikler eklenebilir:

* 📈 Daha gelişmiş CPU / RAM / Disk grafik geçmişi
* 🚨 Threshold aşımında alarm sistemi
* 📧 E-mail bildirimleri
* 🔔 Real-time notification
* 🤖 Monitoring Agent
* 📊 Daha gelişmiş log filtreleme
* 🔎 Log search
* 📅 Tarih aralığına göre log filtreleme
* 🔑 API Key yenileme / revoke işlemleri
* 👥 Kullanıcı ve proje bazlı monitoring
* 📡 WebSocket ile gerçek zamanlı veri aktarımı

---

## 👩‍💻 Development

**Eduente Monitoring**, staj sürecinde gerçek bir monitoring uygulamasının temel yapılarını öğrenmek ve uygulamak amacıyla geliştirilmiştir.

Proje boyunca **Laravel REST API, React, PostgreSQL, Redis, Docker, authentication, API Key yönetimi, request logging ve sistem metriklerinin işletim sistemi üzerinden okunması** gibi konularda çalışmalar gerçekleştirilmiştir.

---

## 📄 License

This project was developed for educational and internship purposes.
