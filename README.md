# EKİNAY

## Proje Hakkında

![Ekinay Tanıtım Görseli](Ekinaypromo.png)

**Ekinay**, tarımsal üretim yapan kullanıcıların tarlalarını, ürünlerini, sulama planlarını, hasat dönemlerini ve hava riski uyarılarını takip edebilmelerini sağlayan akıllı tarım destek sistemidir.

Uygulama; kullanıcının tarla konumu, ekilen ürün, ekim tarihi ve üretim türü gibi bilgilerini alır. Bu bilgiler hava durumu verileri ve ürün bazlı tarımsal bilgi kurallarıyla birlikte değerlendirilir. Böylece kullanıcıya sulama, hasat ve hava riski konularında anlaşılır öneriler sunulur.

Sistem hem web arayüzü hem de mobil uygulama üzerinden kullanılabilir. Mobil uygulamada gerçek Android telefon üzerinde giriş, tarla görüntüleme, takvim takibi ve push bildirim alma özellikleri desteklenmektedir.

---

## Proje Kategorisi

**Tarım / Akıllı Tarım / Mobil Destek Sistemi**

---

## Canlı Proje Linkleri

- **REST API Adresi:**  
  https://ekinay-smart-agriculture-system.onrender.com

- **Web Frontend Adresi:**  
  https://ekinay-smart-agriculture-system.vercel.app

---

## Proje Ekibi

**Grup Adı:** TENGYAMİ

**Ekip Üyesi:**

- Ali Sarısu

---

## Kullanılan Teknolojiler

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- REST API
- dotenv
- CORS

### Web Frontend
- HTML
- CSS
- JavaScript
- Fetch API
- Vercel

### Mobil Uygulama
- React Native
- Expo
- EAS Build
- Expo Notifications
- Firebase Cloud Messaging
- Google Services yapılandırması

### DevOps ve Ek Teknolojiler
- Docker
- Docker Compose
- Jenkins
- Jenkinsfile
- RabbitMQ
- Redis
- Render
- GitHub
- Postman

---

## Öne Çıkan Özellikler

- Kullanıcı kayıt ve giriş işlemleri
- Profil görüntüleme ve güncelleme
- Tarla ekleme, güncelleme, silme ve listeleme
- Harita üzerinden tarla konumu seçme
- Tarla bazlı ürün bilgisi yönetimi
- Domates, biber, salatalık ve fasulye için ürün bazlı tarımsal öneriler
- Bugünün sulama özeti
- Ekim tarihinden tahmini hasat tarihine kadar takvim gösterimi
- Hava durumu verisine göre sulama önerisi
- Don, fırtına, yoğun yağış ve kuraklık stresi gibi hava riski uyarıları
- Gerçek telefona push bildirim gönderimi
- RabbitMQ ile asenkron bildirim kuyruğu
- Redis ile hava durumu verisi cache sistemi
- Docker Compose ile backend, frontend, Redis, RabbitMQ ve alert-worker çalıştırma
- Jenkins CI/CD pipeline ile Docker build, container başlatma ve health check

---

## Dokümantasyon

Proje dokümantasyonuna aşağıdaki dosyalardan erişilebilir:

1. [Gereksinim Analizi](Gereksinim-Analizi.md)
2. [REST API Tasarımı](API-Tasarimi.md)
3. [REST API](Rest-API.md)
4. [Web Front-End](WebFrontEnd.md)
5. [Mobil Front-End](MobilFrontEnd.md)
6. [Mobil Backend](MobilBackEnd.md)
7. [Video Sunum ve Kanıt Videoları](Sunum.md)

---

## Kurulum ve Çalıştırma

### Backend

```bash
cd backend
npm install
npm start
```

Backend varsayılan olarak `.env` dosyasındaki `PORT` değerine göre çalışır. Lokal geliştirme ortamında `3000`, Render ortamında `10000` portu kullanılmaktadır.

Backend için gerekli environment değişkenleri:

```env
MONGO_URI=mongodb-atlas-baglanti-adresi
AUTO_ALERT_SECRET=otomatik-alarm-secret-degeri
```

---

### Web Frontend

Web frontend statik HTML, CSS ve JavaScript dosyalarından oluşur. Canlı ortamda Vercel üzerinden yayınlanmaktadır.

Lokal çalıştırma için `frontend` klasörü bir statik sunucu veya Docker üzerinden çalıştırılabilir.

---

### Mobil Uygulama

Mobil uygulama `mobile` klasörü içinde yer almaktadır.

```bash
cd mobile
npm install
npx expo start
```

Android production/internal build işlemleri EAS Build üzerinden yapılmıştır.

```bash
eas build -p android --profile preview
```

---

### Docker Compose

Proje Docker Compose ile backend, frontend, Redis, RabbitMQ ve alert-worker servislerini birlikte çalıştırabilir.

```bash
docker compose up --build
```

Servisler:

- Backend: `http://localhost:3000`
- Frontend: `http://localhost:8080`
- RabbitMQ Panel: `http://localhost:15672`
- Redis: `localhost:6379`

RabbitMQ giriş bilgileri:

```txt
username: guest
password: guest
```

Docker Compose ile çalışan servisler:

```txt
ekinay-backend
ekinay-frontend
ekinay-redis
ekinay-rabbitmq
ekinay-alert-worker
```

---

## CI/CD

Projede Jenkins tabanlı CI/CD pipeline bulunmaktadır.

Pipeline akışı:

1. GitHub reposundan kodu çeker.
2. Jenkins credentials ile gerekli `.env` dosyasını oluşturur.
3. Docker image build işlemini yapar.
4. Docker Compose ile servisleri ayağa kaldırır.
5. Backend health check yapar.
6. Frontend health check yapar.
7. Redis ve RabbitMQ servis durumlarını kontrol eder.
8. Pipeline sonunda containerları kapatır.

CI/CD yapılandırması `Jenkinsfile` içinde bulunmaktadır.

---

## RabbitMQ Kullanımı

Projede RabbitMQ, otomatik hava riski bildirimlerinin asenkron şekilde işlenmesi için kullanılmıştır.

Akış:

```txt
Backend / Producer
      ↓
RabbitMQ Queue
      ↓
Alert Worker / Consumer
      ↓
Expo Push Notification
      ↓
Gerçek Android Telefon
```

Test endpointi:

```txt
POST /rabbit-test/push
```

---

## Redis Kullanımı

Projede Redis, hava durumu verilerinin önbelleğe alınması için kullanılmıştır.

Akış:

```txt
İlk istek
  → Redis cache MISS
  → Open-Meteo API
  → Redis cache SET

İkinci istek
  → Redis cache HIT
  → Dış API’ye tekrar gitmeden cache’den veri okuma
```

Test endpointi:

```txt
POST /auto-alerts/run
```

---

## Canlı Render Uyumluluğu

Render ortamında RabbitMQ ve Redis containerları çalışmadığı için sistem fallback mantığı ile hazırlanmıştır.

- Docker ortamında RabbitMQ ve Redis aktif çalışır.
- Render ortamında Redis yoksa cache pas geçilir.
- Render ortamında RabbitMQ yoksa bildirim direkt Expo Push ile gönderilir.
- Böylece canlı backend servisi bozulmadan çalışmaya devam eder.

---

## Güvenlik Notları

- `.env` dosyaları repoya eklenmez.
- Firebase Admin SDK private key dosyaları repoya eklenmez.
- MongoDB bağlantı bilgisi Jenkins credentials ve Render environment variables üzerinden yönetilir.
- `AUTO_ALERT_SECRET` değeri otomatik alarm endpointlerini korumak için kullanılır.
- JWT kullanılmamıştır; bu yüzden JWT kaynaklı güvenlik riski oluşturulmamıştır.

---

## Final Teslim Notu

Bu proje; mobil frontend, mobil REST API bağlantısı, RabbitMQ/Kafka, Redis/Memcache, Docker, CI/CD, gerçek telefon testi ve demo gösterimi başlıkları için kanıt videoları ile desteklenecek şekilde hazırlanmıştır.