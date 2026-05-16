# Ali Sarısu'nun Mobil Backend Görevleri

Bu dosyada Ekinay mobil uygulamasının backend ve REST API bağlantısı tarafında yapılan işler açıklanmaktadır.

- **Öğrenci:** Ali Sarısu
- **Grup:** TENGYAMİ
- **Proje:** Ekinay
- **Backend Teknolojisi:** Node.js + Express.js
- **Veritabanı:** MongoDB Atlas
- **Mobil Uygulama:** React Native + Expo
- **Canlı API:** Render

---

## Mobil Backend Kanıt Videosu

**Video Linki:**  
> Eklenecek

---

## REST API Adresi

```txt
https://ekinay-smart-agriculture-system.onrender.com
```

---

## 1. Mobil Giriş İsteği

Mobil uygulama, kullanıcının email ve şifre bilgilerini REST API’ye göndererek giriş yapmasını sağlar.

**Endpoint:**

```txt
POST /auth/login
```

**Mobil tarafta yapılan işlem:**

- Kullanıcı email ve şifre bilgilerini girer.
- Mobil uygulama backend’e login isteği gönderir.
- Backend kullanıcıyı MongoDB üzerinden kontrol eder.
- Başarılı girişte kullanıcı bilgileri mobil uygulamada tutulur.
- Dashboard ekranı kullanıcıya özel verilerle açılır.

**İlgili mobil dosyalar:**

```txt
mobile/app/index.js
mobile/lib/api.js
mobile/lib/auth.js
```

---

## 2. Mobil Kayıt İsteği

Yeni kullanıcılar mobil uygulama üzerinden sisteme kayıt olabilir.

**Endpoint:**

```txt
POST /auth/register
```

**Mobil tarafta yapılan işlem:**

- Kullanıcı ad, email ve şifre bilgilerini girer.
- Mobil uygulama kayıt isteğini backend’e gönderir.
- Backend MongoDB üzerinde yeni kullanıcı oluşturur.
- Kullanıcı kayıt sonucu hakkında bilgilendirilir.

**İlgili mobil dosyalar:**

```txt
mobile/app/register.js
mobile/lib/api.js
```

---

## 3. Mobil Profil Bilgisi Alma ve Güncelleme

Mobil uygulama, kullanıcının profil bilgilerini backend’den alabilir ve güncelleyebilir.

**Endpointler:**

```txt
GET /users/{userId}
PUT /users/{userId}
```

**Mobil tarafta yapılan işlem:**

- Kullanıcının mevcut profil bilgileri backend’den alınır.
- Kullanıcı ad, email veya şifre bilgisini günceller.
- Güncelleme isteği backend’e gönderilir.
- MongoDB üzerindeki kullanıcı kaydı güncellenir.
- Kullanıcıya işlem sonucu gösterilir.

**İlgili mobil dosyalar:**

```txt
mobile/app/profile.js
mobile/lib/api.js
```

---

## 4. Mobil Tarla Listeleme

Mobil uygulama, kullanıcının tarlalarını backend’den çeker ve dashboard ekranında gösterir.

**Endpoint:**

```txt
GET /fields?userId={userId}
```

**Mobil tarafta yapılan işlem:**

- Giriş yapan kullanıcının `userId` bilgisi alınır.
- Mobil uygulama backend’e tarla listeleme isteği gönderir.
- Backend MongoDB’den kullanıcıya ait tarlaları getirir.
- Mobil uygulama bu tarlaları dashboard ekranında listeler.

**İlgili mobil dosyalar:**

```txt
mobile/app/dashboard.js
mobile/lib/api.js
```

---

## 5. Mobil Tarla Ekleme

Mobil uygulama üzerinden yeni tarla eklenebilir.

**Endpoint:**

```txt
POST /fields
```

**Mobil tarafta yapılan işlem:**

- Kullanıcı tarla bilgilerini girer.
- Tarla adı, konum, koordinat, alan ve sera/açık alan bilgisi alınır.
- Mobil uygulama bu bilgileri backend’e gönderir.
- Backend MongoDB üzerinde yeni tarla kaydı oluşturur.
- Dashboard ekranı güncellenir.

**İlgili mobil dosyalar:**

```txt
mobile/app/field-form.js
mobile/lib/api.js
```

---

## 6. Mobil Tarla Güncelleme

Mobil uygulama üzerinden mevcut tarla bilgileri güncellenebilir.

**Endpoint:**

```txt
PUT /fields/{fieldId}
```

**Mobil tarafta yapılan işlem:**

- Kullanıcı mevcut tarla bilgilerini düzenler.
- Mobil uygulama güncelleme isteğini backend’e gönderir.
- Backend MongoDB üzerindeki ilgili tarla kaydını günceller.
- Güncel bilgiler mobil uygulamada gösterilir.

**İlgili mobil dosyalar:**

```txt
mobile/app/field-form.js
mobile/app/field-detail.js
mobile/lib/api.js
```

---

## 7. Mobil Tarla Silme

Mobil uygulama üzerinden kullanıcı tarlasını silebilir.

**Endpoint:**

```txt
DELETE /fields/{fieldId}
```

**Mobil tarafta yapılan işlem:**

- Kullanıcı silme işlemini başlatır.
- Mobil uygulama backend’e silme isteği gönderir.
- Backend ilgili tarla kaydını siler.
- Dashboard ekranı güncellenir.

---

## 8. Mobil Ürün Bilgisi Yönetimi

Mobil uygulama, tarlaya bağlı ürün bilgilerini backend üzerinden yönetir.

**Endpointler:**

```txt
GET /crops?userId={userId}
POST /crops
PUT /crops/{cropId}
DELETE /crops/{cropId}
```

**Mobil tarafta yapılan işlem:**

- Kullanıcı tarlaya ürün ekler.
- Ürün adı ve ekim tarihi bilgisi backend’e gönderilir.
- Backend ürün bilgisini MongoDB üzerinde saklar.
- Ürün bilgisi tarla kartı ve tarla detay ekranında gösterilir.
- Ürün güncelleme ve silme işlemleri backend üzerinden yapılır.

**İlgili mobil dosyalar:**

```txt
mobile/app/crop-form.js
mobile/app/dashboard.js
mobile/app/field-detail.js
mobile/lib/api.js
```

---

## 9. Mobil Sulama Önerisi Bağlantısı

Mobil uygulama, seçilen tarla için backend’den sulama önerisi alır.

**Endpoint:**

```txt
GET /recommendations/irrigation/{fieldId}
```

**Mobil tarafta yapılan işlem:**

- Mobil uygulama seçilen tarla için backend’e istek gönderir.
- Backend tarla, ürün ve hava bilgilerine göre sulama önerisi üretir.
- Mobil uygulama bu öneriyi tarla kartında veya tarla detay ekranında gösterir.

---

## 10. Mobil Hava Riski Uyarısı Bağlantısı

Mobil uygulama, seçilen tarla için backend’den hava riski bilgisi alır.

**Endpoint:**

```txt
GET /recommendations/alerts/{fieldId}
```

**Mobil tarafta yapılan işlem:**

- Mobil uygulama tarla bilgisi ile backend’e risk isteği gönderir.
- Backend hava durumuna göre don, fırtına, yağış veya sıcaklık stresi değerlendirmesi yapar.
- Mobil uygulama bu bilgiyi kullanıcıya anlaşılır mesaj olarak gösterir.

---

## 11. Push Token Kaydı

Mobil uygulama, gerçek Android cihazdan aldığı Expo push token bilgisini backend’e gönderir.

**Endpoint:**

```txt
PUT /users/{userId}/push-token
```

**Backend tarafında MongoDB’ye kaydedilen alanlar:**

```txt
expoPushToken
pushAlertsEnabled
```

**Mobil tarafta yapılan işlem:**

- Kullanıcıdan bildirim izni alınır.
- Expo push token alınır.
- Token backend’e gönderilir.
- Backend kullanıcı kaydına token bilgisini yazar.
- Bu sayede kullanıcıya hava riski bildirimi gönderilebilir.

**İlgili mobil dosyalar:**

```txt
mobile/lib/notifications.js
mobile/lib/push.js
```

---

## 12. Test Push Bildirimi

Backend, kayıtlı push token üzerinden gerçek telefona test bildirimi gönderebilir.

**Endpoint:**

```txt
POST /test-push/run
```

**Çalışma mantığı:**

- Backend push token kayıtlı kullanıcıyı bulur.
- Expo push servisine bildirim isteği gönderir.
- Bildirim gerçek Android telefona ulaşır.
- Bu işlem mobil backend bağlantısının ve push altyapısının çalıştığını kanıtlar.

---

## 13. Otomatik Hava Riski Bildirimi

Otomatik hava riski sistemi mobil bildirim altyapısı ile entegre edilmiştir.

**Endpoint:**

```txt
POST /auto-alerts/run
```

**Çalışma mantığı:**

- Backend push bildirimi açık olan kullanıcıları bulur.
- Kullanıcının tarlaları ve ürünleri alınır.
- Tarla koordinatlarına göre hava durumu verisi çekilir.
- Don, fırtına, yoğun yağış veya kuraklık stresi kontrol edilir.
- Risk varsa kullanıcıya push bildirim gönderilir.
- Docker ortamında bildirim RabbitMQ kuyruğuna gönderilir.
- Alert worker bildirimi tüketip Expo Push üzerinden telefona iletir.
- Render ortamında RabbitMQ yoksa sistem direkt Expo Push fallback ile çalışır.

---

## 14. Mobil REST API Veri Akışı

Mobil uygulama ve backend arasındaki genel veri akışı:

```txt
Mobil Uygulama
      ↓
Render REST API
      ↓
MongoDB Atlas
      ↓
Mobil Uygulama Güncel Veri Gösterimi
```

Push bildirim veri akışı:

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
Gerçek Android Telefon
```

---

## Finalde Gösterilecek Mobil Backend Kanıtları

- Mobil uygulamadan giriş yapılması
- Mobil uygulamada dashboard verilerinin backend’den gelmesi
- MongoDB Atlas üzerinde kullanıcı, tarla ve ürün kayıtlarının gösterilmesi
- Mobil uygulamada push bildirim izni verilmesi
- MongoDB kullanıcı kaydında `expoPushToken` alanının gösterilmesi
- Backend üzerinden test bildirimi gönderilmesi
- Bildirimin gerçek Android telefona ulaşması
- Otomatik hava riski bildirim sisteminin çalıştığının gösterilmesi

---

## Sonuç

Mobil backend tarafında mobil uygulamanın canlı REST API ile bağlantısı kurulmuştur. Kullanıcı, tarla, ürün, öneri, takvim ve push bildirim işlemleri backend üzerinden çalışmaktadır. Uygulama gerçek Android telefon üzerinde test edilmiş ve push bildirim sistemi başarılı şekilde çalıştırılmıştır.