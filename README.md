# EKİNAY

## Proje Hakkında

![Ekinay Tanıtım Görseli](Ekinaypromo.png)

**Ekinay**, tarımsal üretim yapan kullanıcıların tarlalarını, ürünlerini, sulama planlarını, hasat dönemlerini ve hava riski uyarılarını takip edebilmelerini sağlayan akıllı tarım destek sistemidir.

Sistem hem web arayüzü hem de mobil uygulama üzerinden kullanılabilir. Web tarafında canlı Vercel frontend, backend tarafında Render üzerinde çalışan REST API, mobil tarafta ise gerçek Android telefona kurulabilen Expo/EAS APK yapısı kullanılmıştır.

---

## Canlı Proje Linkleri

- **REST API Adresi:**  
  https://ekinay-smart-agriculture-system.onrender.com

- **Web Frontend Adresi:**  
  https://ekinay-smart-agriculture-system.vercel.app

---

## Proje Ekibi

- **Grup Adı:** TENGYAMİ
- **Öğrenci:** Ali SARISU

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
- Expo Push Notification API

### Web Frontend
- HTML
- CSS
- JavaScript
- Fetch API
- Vercel
- Harita üzerinden tarla alanı seçimi

### Mobil Uygulama
- React Native
- Expo
- Expo Router
- EAS Build
- React Native Maps
- Google Maps SDK for Android
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
- Profil güncellemede şifre boş bırakılırsa eski şifrenin korunması
- Tarla ekleme, güncelleme, silme ve listeleme
- Web ve mobil uygulamada harita üzerinden tarla alanı seçme
- Mobilde Google Maps üzerinde en az 3 nokta seçerek tarla poligonu oluşturma
- Tarla bazlı ürün bilgisi yönetimi
- Domates, biber, salatalık ve fasulye için ürün bazlı tarımsal öneriler
- Ürün ekim tarihinin mobilde otomatik `yyyy-aa-gg` formatına çevrilmesi
- Mobilde Bugün, 1 Hafta Önce, 1 Ay Önce, Hasada 30 Gün ve Hasada 7 Gün hızlı tarih seçenekleri
- Bugünün sulama özeti
- Ekim tarihinden tahmini hasat tarihine kadar takvim gösterimi
- Hasat tarihi geçmiş ürünlerde boş takvim yerine kullanıcı uyarısı
- Hava durumu verisine göre sulama önerisi
- Hava riski uyarıları
- Expo / FCM ile gerçek telefona push bildirimi
- Otomatik hava riski taraması
- RabbitMQ ile bildirim kuyruğu
- Redis ile hava verisi cache desteği
- Docker Compose ile backend, frontend, Redis ve RabbitMQ servisleri
- Jenkins ile Docker tabanlı CI/CD pipeline

---

## Güvenlik ve Environment Değerleri

Secret ve API key değerleri repoya yazılmaz.

Backend tarafında kullanılan önemli environment değerleri:

```txt
MONGO_URI
AUTO_ALERT_SECRET
RABBITMQ_URL
REDIS_URL
```

Mobil harita özelliği için Google Maps API key değeri EAS üzerinde environment variable olarak saklanır:

```txt
GOOGLE_MAPS_API_KEY
```

Google Cloud tarafında API key, Android uygulama kısıtlaması ile korunur.

```txt
Package name: com.ekinay.mobile
```

Gerçek API key veya Firebase Admin SDK secret dosyaları repoya eklenmez.

---

## Temel REST API Endpointleri

```txt
POST /auth/register
POST /auth/login
GET /users/{userId}
PUT /users/{userId}
DELETE /users/{userId}
PUT /users/{userId}/push-token
GET /fields?userId={userId}
POST /fields
PUT /fields/{fieldId}
DELETE /fields/{fieldId}?userId={userId}
GET /crops?userId={userId}
POST /crops
PUT /crops/{cropId}
DELETE /crops/{cropId}?userId={userId}
GET /recommendations/irrigation/{fieldId}?userId={userId}
GET /recommendations/alerts/{fieldId}?userId={userId}
POST /test-push/run
POST /auto-alerts/run
POST /rabbit-test/push
```

---

## Veri Tutarlılığı

- Kullanıcı silindiğinde kullanıcıya bağlı tarla ve ürün kayıtları temizlenir.
- Tarla silindiğinde tarlaya bağlı ürün kayıtları da silinir.
- Ürün listeleme endpointi, silinmiş tarlaya bağlı `fieldId: null` ürünleri istemciye döndürmez.
- Bu yapı mobil uygulamada `Cannot read property '_id' of null` benzeri hataların oluşmasını engeller.

---

## Proje Dokümantasyonu

- [Gereksinim Analizi](Gereksinim-Analizi.md)
- [API Tasarımı](API-Tasarimi.md)
- [REST API](Rest-API.md)
- [Web Frontend](WebFrontEnd.md)
- [Mobil Frontend](MobilFrontEnd.md)
- [Mobil Backend / REST API Bağlantısı](MobilBackEnd.md)
- [Sunum ve Kanıt Videoları](Sunum.md)

---

## Final Kanıt Videoları

Final teslimi için aşağıdaki kanıt videoları hazırlanacaktır:

- Backend / REST API kanıt videosu
- Web frontend kanıt videosu
- Mobil frontend gerçek telefon kanıt videosu
- Mobil backend / REST API bağlantısı kanıt videosu
- Docker kanıt videosu
- Jenkins CI/CD kanıt videosu
- RabbitMQ kanıt videosu
- Redis kanıt videosu
- İkinci Android cihaz / hedef kullanıcı testi videosu

---

## Sonuç

Ekinay; web, mobil, REST API, MongoDB, Docker, Jenkins, RabbitMQ, Redis ve gerçek telefon push bildirimi içeren uçtan uca çalışan bir akıllı tarım destek sistemidir.
