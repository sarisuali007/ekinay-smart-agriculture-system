# REST API

Bu dokümanda Ekinay projesinde geliştirilen REST API yapısı ve sorumlu öğrenciye ait API görevleri listelenmektedir.

---

## REST API Adresi

**Canlı API Adresi:**  
https://ekinay-smart-agriculture-system.onrender.com

---

## Sorumlu Öğrenci

Proje tek kişi tarafından geliştirilmiştir.

1. [Ali Sarısu REST API Görevleri](Ali-Sarısu/Ali-Sarısu-Rest-API-Gorevleri.md)

---

## REST API Genel Yapısı

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

Kullanıcı kayıt ve giriş işlemleri için kullanılır.

```txt
POST /auth/register
POST /auth/login
```

---

### 2. Users

Kullanıcı profil bilgileri ve mobil push token işlemleri için kullanılır.

```txt
GET /users/{userId}
PUT /users/{userId}
DELETE /users/{userId}
PUT /users/{userId}/push-token
```

---

### 3. Fields

Kullanıcının tarla bilgilerini yönetmek için kullanılır.

```txt
GET /fields?userId={userId}
POST /fields
PUT /fields/{fieldId}
DELETE /fields/{fieldId}
```

---

### 4. Crops

Tarlalara bağlı ürün bilgilerini yönetmek için kullanılır.

```txt
GET /crops?userId={userId}
POST /crops
PUT /crops/{cropId}
DELETE /crops/{cropId}
```

---

### 5. Recommendations

Sulama önerisi ve hava riski uyarısı oluşturmak için kullanılır.

```txt
GET /recommendations/irrigation/{fieldId}
GET /recommendations/alerts/{fieldId}
```

---

### 6. Push Notification

Gerçek telefona test bildirimi göndermek için kullanılır.

```txt
POST /test-push/run
```

---

### 7. Auto Alerts

Otomatik hava riski kontrolü ve bildirim sistemi için kullanılır.

```txt
POST /auto-alerts/run
```

---

### 8. RabbitMQ Test

RabbitMQ kuyruğu üzerinden test bildirimi göndermek için kullanılır.

```txt
POST /rabbit-test/push
```

---

## API Test Kanıtı

**Backend / REST API Kanıt Videosu:**  
> Eklenecek

Bu videoda Postman üzerinden API endpointleri test edilecek, MongoDB Atlas kayıtları gösterilecek ve Render üzerinde canlı backend servisinin çalıştığı kanıtlanacaktır.

---

## Ek Notlar

- API canlı olarak Render üzerinde çalışmaktadır.
- Frontend ve mobil uygulama canlı API adresiyle haberleşmektedir.
- MongoDB Atlas üzerinde kullanıcı, tarla, ürün ve otomatik alarm kayıtları tutulmaktadır.
- Docker ortamında RabbitMQ ve Redis destekli çalışmaktadır.
- Render ortamında RabbitMQ/Redis bulunmadığında sistem fallback yapısı ile çalışmaya devam etmektedir.