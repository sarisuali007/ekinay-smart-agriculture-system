# Mobil Backend / REST API Bağlantısı

Bu dokümanda Ekinay mobil uygulamasının REST API ile bağlantı süreci açıklanmaktadır.

Mobil uygulama, canlı Render backend servisine bağlanarak kullanıcı, tarla, ürün, öneri, takvim ve bildirim işlemlerini REST API üzerinden gerçekleştirmektedir.

---

## REST API Adresi

```txt
https://ekinay-smart-agriculture-system.onrender.com
```

---

## Mobil Backend Kanıt Videosu

**Video Linki:**  
> Eklenecek

---

## Sorumlu Öğrenci

- Ali Sarısu

Ayrıntılı görev listesi:

- [Ali Sarısu Mobil Backend Görevleri](Ali-Sarısu/Ali-Sarısu-Mobil-Backend-Gorevleri.md)

---

## Mobil Backend Kapsamı

### 1. Kullanıcı Girişi

Mobil uygulama, kullanıcının email ve şifre bilgileriyle backend’e giriş isteği gönderir.

**Endpoint:**

```txt
POST /auth/login
```

**Amaç:**

- Kullanıcıyı doğrulamak
- Kullanıcı bilgilerini mobil uygulamada saklamak
- Dashboard verilerini kullanıcıya özel çekmek

---

### 2. Kullanıcı Kaydı

Mobil uygulama yeni kullanıcı oluşturmak için backend’e kayıt isteği gönderir.

**Endpoint:**

```txt
POST /auth/register
```

**Amaç:**

- Yeni kullanıcı oluşturmak
- MongoDB üzerinde kullanıcı kaydı oluşturmak
- Kullanıcıyı sisteme dahil etmek

---

### 3. Profil Bilgisi ve Profil Güncelleme

Mobil uygulama kullanıcı profil bilgilerini backend’den alabilir ve güncelleyebilir.

**Endpointler:**

```txt
GET /users/{userId}
PUT /users/{userId}
```

**Amaç:**

- Kullanıcı bilgilerini görüntülemek
- Kullanıcının ad, email ve şifre bilgilerini güncellemesini sağlamak

---

### 4. Tarla Listeleme

Mobil uygulama kullanıcının kayıtlı tarlalarını backend’den çeker.

**Endpoint:**

```txt
GET /fields?userId={userId}
```

**Amaç:**

- Kullanıcıya ait tarlaları listelemek
- Dashboard ekranında tarla kartlarını göstermek

---

### 5. Tarla Ekleme ve Güncelleme

Mobil uygulama tarla ekleme ve güncelleme işlemleri için backend’e istek gönderir.

**Endpointler:**

```txt
POST /fields
PUT /fields/{fieldId}
DELETE /fields/{fieldId}
```

**Amaç:**

- Yeni tarla oluşturmak
- Mevcut tarla bilgisini güncellemek
- Kullanıcının sildiği tarlayı sistemden kaldırmak

---

### 6. Ürün Bilgisi Yönetimi

Mobil uygulama tarlaya bağlı ürün bilgilerini backend üzerinden yönetir.

**Endpointler:**

```txt
GET /crops?userId={userId}
POST /crops
PUT /crops/{cropId}
DELETE /crops/{cropId}
```

**Amaç:**

- Tarlaya ürün eklemek
- Ürün ekim tarihini kaydetmek
- Ürün bilgisini güncellemek
- Ürün bilgisini silmek

---

### 7. Sulama Önerisi

Mobil uygulama seçilen tarla için backend’den sulama önerisi alır.

**Endpoint:**

```txt
GET /recommendations/irrigation/{fieldId}
```

**Amaç:**

- Tarla ve ürün bilgisine göre sulama önerisi göstermek
- Hava durumu verilerine göre günlük sulama değerlendirmesi yapmak

---

### 8. Hava Riski Uyarısı

Mobil uygulama seçilen tarla için backend’den hava riski uyarısı alır.

**Endpoint:**

```txt
GET /recommendations/alerts/{fieldId}
```

**Amaç:**

- Don, fırtına, yoğun yağış ve sıcaklık stresi gibi riskleri kullanıcıya göstermek
- Tarla kartı ve detay ekranında anlaşılır risk mesajı sunmak

---

### 9. Push Token Kaydı

Mobil uygulama Expo push token bilgisini backend’e gönderir. Backend bu token bilgisini MongoDB’de kullanıcı kaydına işler.

**Endpoint:**

```txt
PUT /users/{userId}/push-token
```

**MongoDB kullanıcı kaydında tutulan alanlar:**

```txt
expoPushToken
pushAlertsEnabled
```

**Amaç:**

- Kullanıcının cihazına push bildirim gönderebilmek
- Hava riski durumlarında kullanıcıyı telefon üzerinden uyarmak

---

### 10. Test Push Bildirimi

Backend, kayıtlı push token üzerinden kullanıcının telefonuna test bildirimi gönderebilir.

**Endpoint:**

```txt
POST /test-push/run
```

**Amaç:**

- Mobil bildirim hattının çalıştığını doğrulamak
- Expo / Firebase Cloud Messaging yapılandırmasını test etmek
- Gerçek telefona bildirim gittiğini göstermek

---

### 11. Otomatik Hava Riski Bildirimi

Backend belirli aralıklarla hava verilerini kontrol eder. Don, fırtına, yoğun yağış veya kuraklık stresi gibi riskler algılandığında kullanıcıya bildirim gönderir.

**Endpoint:**

```txt
POST /auto-alerts/run
```

**Çalışma Mantığı:**

- Kullanıcının kayıtlı tarlaları alınır.
- Tarla konumuna göre hava durumu verisi çekilir.
- Risk analizi yapılır.
- Risk varsa bildirim oluşturulur.
- Docker ortamında RabbitMQ kuyruğuna gönderilir.
- Alert worker bildirimi telefona gönderir.
- Render ortamında RabbitMQ yoksa sistem direkt Expo Push fallback ile çalışır.

---

## Mobil REST API Bağlantısında Kullanılan Veri Akışı

```txt
Mobil Uygulama
      ↓
Render REST API
      ↓
MongoDB Atlas
      ↓
Mobil Uygulama Güncel Veri Gösterimi
```

Push bildirim akışı:

```txt
Mobil Uygulama
      ↓
Expo Push Token
      ↓
Render Backend
      ↓
MongoDB Kullanıcı Kaydı
      ↓
Expo / FCM
      ↓
Gerçek Android Telefon Bildirimi
```

Docker ortamındaki asenkron bildirim akışı:

```txt
Auto Alert Endpoint
      ↓
RabbitMQ Queue
      ↓
Alert Worker
      ↓
Expo Push Notification
      ↓
Telefon Bildirimi
```

---

## Finalde Gösterilecek Mobil Backend Akışı

1. Mobil uygulamada kullanıcı girişi yapılır.
2. Dashboard verilerinin backend’den geldiği gösterilir.
3. MongoDB üzerinde kullanıcı ve tarla kayıtları gösterilir.
4. Mobil uygulamada push bildirimi izni verilir.
5. MongoDB kullanıcı kaydında `expoPushToken` alanı gösterilir.
6. Test push bildirimi gönderilir.
7. Bildirimin gerçek telefona geldiği gösterilir.