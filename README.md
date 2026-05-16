# EKİNAY

## Proje Hakkında

![Ekinay Tanıtım Görseli](Ekinaypromo.png)

**Ekinay**, tarımsal üretim yapan kullanıcıların tarlalarını, ürünlerini, sulama planlarını, hasat dönemlerini ve hava riski uyarılarını takip edebilmelerini sağlayan akıllı tarım destek sistemidir.

Uygulama; kullanıcının tarla konumu, ekilen ürün, ekim tarihi ve üretim türü gibi bilgilerini alır. Bu bilgiler hava durumu verileri ve ürün bazlı tarımsal bilgi kurallarıyla birlikte değerlendirilir. Böylece kullanıcıya sulama, hasat ve hava riski konularında anlaşılır öneriler sunulur.

Sistem hem web arayüzü hem de mobil uygulama üzerinden kullanılabilir. Mobil uygulamada gerçek cihaz üzerinde giriş, tarla görüntüleme, takvim takibi ve push bildirim alma özellikleri desteklenmektedir.

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

### DevOps / Ek Teknolojiler
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
- Profil güncelleme
- Tarla ekleme, güncelleme ve silme
- Harita üzerinden tarla konumu seçme
- Tarla bazlı ürün bilgisi yönetimi
- Domates, biber, salatalık ve fasulye için ürün bazlı tarımsal öneriler
- Bugünün sulama özeti
- Ekim tarihinden hasat tarihine kadar takvim gösterimi
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