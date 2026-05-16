# Ali SARISU REST API Görevleri

Bu dosyada Ekinay projesinde geliştirilen REST API endpointleri ve Ali SARISU tarafından yapılan REST API görevleri açıklanmaktadır.

- **Öğrenci:** Ali SARISU
- **Grup:** TENGYAMİ
- **Proje:** Ekinay
- **Canlı API:** https://ekinay-smart-agriculture-system.onrender.com

---

## Ali SARISU REST API Görevleri Adresi

**Canlı API Adresi:**  
https://ekinay-smart-agriculture-system.onrender.com

---

## Sorumlu Öğrenci

Proje tek kişi tarafından geliştirilmiştir.

1. [Ali SARISU REST API Görevleri](Ali-SARISU-Rest-API-Gorevleri.md)

---

## Ali SARISU REST API Görevleri Genel Yapısı

Backend tarafı Node.js ve Express.js kullanılarak geliştirilmiştir. Veritabanı olarak MongoDB Atlas kullanılmıştır. API istekleri JSON formatında veri alır ve JSON formatında cevap döndürür.

Kullanılan ana teknolojiler:

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- CORS
- dotenv
- RabbitMQ
- Redis
- Expo Push Notification API

---

## Ana API Grupları

### 1. Authentication

```txt
POST /auth/register
POST /auth/login
```

### 2. Users

```txt
GET /users/{userId}
PUT /users/{userId}
DELETE /users/{userId}
PUT /users/{userId}/push-token
```

**Notlar:**

- Profil güncelleme işleminde `name` ve `email` zorunludur.
- `password` alanı opsiyoneldir.
- `password` boş gönderilirse veya hiç gönderilmezse mevcut şifre korunur.
- Kullanıcı silindiğinde kullanıcıya bağlı tarla ve ürün kayıtları da temizlenir.
- Mobil uygulama Expo push token değerini `PUT /users/{userId}/push-token` endpointi ile backend'e kaydeder.

### 3. Fields

```txt
GET /fields?userId={userId}
POST /fields
PUT /fields/{fieldId}
DELETE /fields/{fieldId}?userId={userId}
```

**Notlar:**

- Tarla listeleme işleminde `userId` query parametresi zorunludur.
- Tarla ekleme ve güncelleme işlemlerinde `userId`, tarla adı, konum, koordinat ve poligon bilgisi kullanılır.
- Web ve mobil uygulama harita üzerinden seçilen alanı `polygon` dizisi olarak gönderir.
- Tarla silme işleminde `userId` query parametresi zorunludur.
- Tarla silindiğinde tarlaya bağlı ürün kayıtları da silinir.
- Bu işlem, silinmiş tarlaya bağlı `fieldId: null` ürünlerin oluşmasını engeller.

### 4. Crops

```txt
GET /crops?userId={userId}
POST /crops
PUT /crops/{cropId}
DELETE /crops/{cropId}?userId={userId}
```

**Notlar:**

- Ürün listeleme işleminde `userId` query parametresi zorunludur.
- Ürün ekleme ve güncelleme işlemlerinde `userId`, `fieldId`, ürün adı ve ekim tarihi gönderilir.
- Desteklenen ürünler: `domates`, `biber`, `salatalık`, `fasulye`
- Ürün listeleme endpointi, silinmiş tarlaya bağlı bozuk kayıtları istemciye döndürmez.
- Ürün silme işleminde `userId` query parametresi zorunludur.

### 5. Recommendations

```txt
GET /recommendations/irrigation/{fieldId}?userId={userId}
GET /recommendations/alerts/{fieldId}?userId={userId}
```

**Notlar:**

- `fieldId` path parametresi zorunludur.
- `userId` query parametresi zorunludur.
- Sulama önerisi tarla, ürün, ekim tarihi ve hava durumu verilerine göre oluşturulur.
- Hava riski uyarısı tarla konumuna göre oluşturulur.
- Mobil ve web frontend bu endpointleri kullanıcıya ait tarlalar için çağırır.

### 6. Push Notification

```txt
POST /test-push/run
```

Bu endpoint gizli anahtar ile korunur.

Önerilen kullanım:

```txt
x-auto-alert-secret: {AUTO_ALERT_SECRET}
```

Alternatif kullanım:

```txt
POST /test-push/run?secret={AUTO_ALERT_SECRET}
```

### 7. Auto Alerts

```txt
POST /auto-alerts/run
```

Bu endpoint push bildirimi açık kullanıcıların tarlalarını kontrol eder. Hava riski varsa bildirim oluşturur. Docker ortamında RabbitMQ varsa mesaj kuyruğuna gönderim yapılır. RabbitMQ yoksa sistem doğrudan Expo Push Notification API üzerinden fallback gönderim yapar.

### 8. RabbitMQ Test

```txt
POST /rabbit-test/push
```

RabbitMQ kuyruğu üzerinden test bildirimi göndermek için kullanılır.

---

## Veri Tutarlılığı

Ekinay backend tarafında kullanıcı, tarla ve ürün ilişkilerinin tutarlı kalması için ek kontroller yapılmıştır.

- Kullanıcı silindiğinde kullanıcıya bağlı tarla ve ürünler silinir.
- Tarla silindiğinde o tarlaya bağlı ürünler de silinir.
- Ürün listeleme işleminde `fieldId` değeri boşa düşmüş ürünler istemciye döndürülmez.
- Ürün ekleme/güncelleme sırasında ürünün bağlandığı tarlanın kullanıcıya ait olup olmadığı kontrol edilir.
- Profil güncellemede başka kullanıcıya ait e-posta adresi kullanılamaz.
- Profil güncellemede boş şifre gönderilirse eski şifre korunur.

---

## Postman Final Testleri

Final teslimi öncesi Postman üzerinde aşağıdaki kontroller yapılmıştır:

```txt
GET /
POST /auth/register
POST /auth/login
GET /users/{userId}
PUT /users/{userId}
POST /fields
GET /fields?userId={userId}
PUT /fields/{fieldId}
POST /crops
GET /crops?userId={userId}
PUT /crops/{cropId}
GET /recommendations/irrigation/{fieldId}?userId={userId}
GET /recommendations/alerts/{fieldId}?userId={userId}
POST /auto-alerts/run
POST /test-push/run
DELETE /crops/{cropId}?userId={userId}
DELETE /fields/{fieldId}?userId={userId}
GET /crops?userId={userId}
```

Özellikle `GET /crops?userId={userId}` testinde `fieldId: null` olan ürün dönmediği kontrol edilmiştir.

---

## API Test Kanıtı

**Backend / REST API Kanıt Videosu:**  
> Eklenecek

Bu videoda Postman üzerinden API endpointleri test edilecek, MongoDB Atlas kayıtları gösterilecek ve Render üzerinde canlı backend servisinin çalıştığı kanıtlanacaktır.

Videoda özellikle şu noktalar gösterilecektir:

- Render canlı backend servisinin çalışması
- Kullanıcı kayıt/giriş işlemleri
- Profil güncelleme işlemi
- Tarla ekleme, listeleme, güncelleme ve silme
- Ürün ekleme, listeleme, güncelleme ve silme
- Tarla silindiğinde bağlı ürün kayıtlarının da temizlenmesi
- Sulama önerisi endpointinin çalışması
- Hava riski uyarısı endpointinin çalışması
- Otomatik hava riski tarama endpointinin çalışması
- Push bildirim test endpointinin çalışması
- MongoDB Atlas üzerinde verilerin oluşması ve temizlenmesi

---

## Ek Notlar

- API canlı olarak Render üzerinde çalışmaktadır.
- Frontend ve mobil uygulama canlı API adresiyle haberleşmektedir.
- MongoDB Atlas üzerinde kullanıcı, tarla, ürün ve otomatik alarm kayıtları tutulmaktadır.
- Docker ortamında RabbitMQ ve Redis destekli çalışmaktadır.
- Render ortamında RabbitMQ/Redis bulunmadığında sistem fallback yapısı ile çalışmaya devam etmektedir.
- Secret değerleri repoya yazılmaz; Render environment variable olarak saklanır.
- Google Maps API key backend tarafında kullanılmaz; mobil uygulama için EAS environment variable olarak yönetilir.
