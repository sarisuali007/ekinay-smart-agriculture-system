# Ali Sarısu REST API Görevleri

Bu dosyada Ekinay projesinde geliştirilen REST API endpointleri ve görev açıklamaları yer almaktadır.

- **Öğrenci:** Ali Sarısu
- **Grup:** TENGYAMİ
- **Proje:** Ekinay
- **Canlı API:** https://ekinay-smart-agriculture-system.onrender.com

---

## REST API Kanıt Videosu

**Video Linki:**  
> Eklenecek

---

## 1. Kullanıcı Kaydı Oluşturma

**Endpoint:**

```txt
POST /auth/register
```

**Request Body:**

```json
{
  "name": "Ali",
  "email": "ali@test.com",
  "password": "123456"
}
```

**Açıklama:**  
Yeni kullanıcının MongoDB üzerinde oluşturulmasını sağlar.

**Başarılı cevap:**  
`201 Created`

---

## 2. Kullanıcı Girişi Yapma

**Endpoint:**

```txt
POST /auth/login
```

**Request Body:**

```json
{
  "email": "ali@test.com",
  "password": "123456"
}
```

**Açıklama:**  
Kullanıcının email ve şifre bilgileriyle sisteme giriş yapmasını sağlar.

**Başarılı cevap:**  
`200 OK`

---

## 3. Kullanıcı Profil Bilgisini Getirme

**Endpoint:**

```txt
GET /users/{userId}
```

**Açıklama:**  
Belirli kullanıcıya ait profil bilgisini getirir.

**Başarılı cevap:**  
`200 OK`

---

## 4. Kullanıcı Profil Bilgisini Güncelleme

**Endpoint:**

```txt
PUT /users/{userId}
```

**Request Body:**

```json
{
  "name": "Ali Güncel",
  "email": "aliguncel@test.com",
  "password": "654321"
}
```

**Açıklama:**  
Kullanıcının profil bilgilerini günceller.

**Başarılı cevap:**  
`200 OK`

---

## 5. Kullanıcı Silme

**Endpoint:**

```txt
DELETE /users/{userId}
```

**Açıklama:**  
Belirli kullanıcı kaydını MongoDB üzerinden siler.

**Başarılı cevap:**  
`200 OK`

---

## 6. Mobil Push Token Kaydetme

**Endpoint:**

```txt
PUT /users/{userId}/push-token
```

**Request Body:**

```json
{
  "expoPushToken": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
  "pushAlertsEnabled": true
}
```

**Açıklama:**  
Mobil uygulamadan gelen Expo push token bilgisini kullanıcı kaydına işler.

**Başarılı cevap:**  
`200 OK`

---

## 7. Tarlaları Listeleme

**Endpoint:**

```txt
GET /fields?userId={userId}
```

**Açıklama:**  
Kullanıcıya ait tarlaları listeler.

**Başarılı cevap:**  
`200 OK`

---

## 8. Tarla Ekleme

**Endpoint:**

```txt
POST /fields
```

**Request Body:**

```json
{
  "userId": "USER_ID",
  "name": "Domates Tarlası",
  "location": "Antalya",
  "latitude": 36.8969,
  "longitude": 30.7133,
  "areaM2": 1200,
  "isGreenhouse": false,
  "polygon": [
    { "lat": 36.8969, "lng": 30.7133 },
    { "lat": 36.8971, "lng": 30.7135 },
    { "lat": 36.8968, "lng": 30.7138 }
  ]
}
```

**Açıklama:**  
Kullanıcıya ait yeni tarla oluşturur.

**Başarılı cevap:**  
`201 Created`

---

## 9. Tarla Güncelleme

**Endpoint:**

```txt
PUT /fields/{fieldId}
```

**Request Body:**

```json
{
  "userId": "USER_ID",
  "name": "Güncel Tarla",
  "location": "Antalya",
  "latitude": 36.8969,
  "longitude": 30.7133,
  "areaM2": 1500,
  "isGreenhouse": true,
  "polygon": [
    { "lat": 36.8969, "lng": 30.7133 },
    { "lat": 36.8971, "lng": 30.7135 },
    { "lat": 36.8968, "lng": 30.7138 }
  ]
}
```

**Açıklama:**  
Mevcut tarla bilgisini günceller.

**Başarılı cevap:**  
`200 OK`

---

## 10. Tarla Silme

**Endpoint:**

```txt
DELETE /fields/{fieldId}
```

**Açıklama:**  
Belirli tarla kaydını siler.

**Başarılı cevap:**  
`200 OK`

---

## 11. Ürünleri Listeleme

**Endpoint:**

```txt
GET /crops?userId={userId}
```

**Açıklama:**  
Kullanıcıya ait ürün kayıtlarını listeler.

**Başarılı cevap:**  
`200 OK`

---

## 12. Ürün Ekleme

**Endpoint:**

```txt
POST /crops
```

**Request Body:**

```json
{
  "userId": "USER_ID",
  "name": "domates",
  "fieldId": "FIELD_ID",
  "sowingDate": "2026-05-01"
}
```

**Açıklama:**  
Bir tarlaya ürün ve ekim tarihi bilgisi ekler.

**Desteklenen ürünler:**

```txt
domates
biber
salatalık
fasulye
```

**Başarılı cevap:**  
`201 Created`

---

## 13. Ürün Güncelleme

**Endpoint:**

```txt
PUT /crops/{cropId}
```

**Request Body:**

```json
{
  "userId": "USER_ID",
  "name": "biber",
  "fieldId": "FIELD_ID",
  "sowingDate": "2026-05-03"
}
```

**Açıklama:**  
Mevcut ürün bilgisini günceller.

**Başarılı cevap:**  
`200 OK`

---

## 14. Ürün Silme

**Endpoint:**

```txt
DELETE /crops/{cropId}
```

**Açıklama:**  
Belirli ürün kaydını siler.

**Başarılı cevap:**  
`200 OK`

---

## 15. Sulama Önerisi Alma

**Endpoint:**

```txt
GET /recommendations/irrigation/{fieldId}
```

**Açıklama:**  
Tarla, ürün, ekim tarihi ve hava durumu verilerine göre sulama önerisi üretir.

**Başarılı cevap:**  
`200 OK`

---

## 16. Hava Riski Uyarısı Alma

**Endpoint:**

```txt
GET /recommendations/alerts/{fieldId}
```

**Açıklama:**  
Tarla konumuna göre hava riski uyarısı üretir.

**Başarılı cevap:**  
`200 OK`

---

## 17. Test Push Bildirimi Gönderme

**Endpoint:**

```txt
POST /test-push/run?secret={AUTO_ALERT_SECRET}
```

**Açıklama:**  
Push token kayıtlı kullanıcıya gerçek telefon bildirimi gönderir.

**Başarılı cevap:**  
`200 OK`

---

## 18. Otomatik Hava Riski Taraması

**Endpoint:**

```txt
POST /auto-alerts/run?secret={AUTO_ALERT_SECRET}
```

**Açıklama:**  
Tüm push bildirimi açık kullanıcıların tarlalarını kontrol eder. Risk varsa bildirim oluşturur.

**Örnek Response:**

```json
{
  "message": "Otomatik tarama tamamlandı.",
  "summary": {
    "checkedUserCount": 1,
    "checkedFieldCount": 3,
    "skippedNoCropCount": 0,
    "noRiskCount": 3,
    "alreadySentCount": 0,
    "failedPushCount": 0,
    "sentCount": 0,
    "queuedToRabbitMqCount": 0,
    "directPushCount": 0
  }
}
```

---

## 19. RabbitMQ Test Bildirimi

**Endpoint:**

```txt
POST /rabbit-test/push?secret={AUTO_ALERT_SECRET}
```

**Açıklama:**  
Backend’in RabbitMQ kuyruğuna bildirim mesajı göndermesini test eder.

**Başarılı cevap:**

```json
{
  "message": "Bildirim mesajı RabbitMQ kuyruğuna gönderildi.",
  "queue": "ekinay.alert.notifications",
  "published": true
}
```

---

## Sonuç

REST API tarafında kullanıcı, profil, tarla, ürün, öneri, bildirim, RabbitMQ ve Redis destekli otomatik uyarı sistemleri geliştirilmiştir. API canlı olarak Render üzerinde çalışmaktadır ve web/mobil uygulamalar bu API ile haberleşmektedir.