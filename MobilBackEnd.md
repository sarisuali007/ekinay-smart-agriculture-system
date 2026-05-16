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

- Ali SARISU

Ayrıntılı görev listesi:

- [Ali SARISU Mobil Backend Görevleri](Ali-SARISU/Ali-SARISU-Mobil-Backend-Gorevleri.md)

---

## Mobil Backend Kapsamı

### 1. Kullanıcı Girişi

```txt
POST /auth/login
```

### 2. Kullanıcı Kaydı

```txt
POST /auth/register
```

### 3. Profil Bilgisi ve Profil Güncelleme

```txt
GET /users/{userId}
PUT /users/{userId}
```

Profil güncellemede şifre alanı opsiyoneldir. Şifre boş bırakılırsa mevcut şifre korunur.

### 4. Tarla Listeleme

```txt
GET /fields?userId={userId}
```

### 5. Tarla Ekleme, Güncelleme ve Silme

```txt
POST /fields
PUT /fields/{fieldId}
DELETE /fields/{fieldId}?userId={userId}
```

Mobil uygulama Google Maps üzerinden seçilen tarla alanını `polygon` olarak backend'e gönderir. Tarla silindiğinde backend, tarlaya bağlı ürünleri de siler.

### 6. Ürün Bilgisi Yönetimi

```txt
GET /crops?userId={userId}
POST /crops
PUT /crops/{cropId}
DELETE /crops/{cropId}?userId={userId}
```

`GET /crops` endpointi `fieldId: null` olan bozuk kayıtları istemciye döndürmez.

### 7. Sulama Önerisi

```txt
GET /recommendations/irrigation/{fieldId}?userId={userId}
```

### 8. Hava Riski Uyarısı

```txt
GET /recommendations/alerts/{fieldId}?userId={userId}
```

### 9. Push Token Kaydı

```txt
PUT /users/{userId}/push-token
```

MongoDB kullanıcı kaydında tutulan alanlar:

```txt
expoPushToken
pushAlertsEnabled
```

### 10. Test Push Bildirimi

```txt
POST /test-push/run
```

Secret header kullanımı:

```txt
x-auto-alert-secret: {AUTO_ALERT_SECRET}
```

### 11. Otomatik Hava Riski Bildirimi

```txt
POST /auto-alerts/run
```

Backend belirli aralıklarla hava verilerini kontrol eder. Don, fırtına, yoğun yağış veya kuraklık stresi gibi riskler algılandığında kullanıcıya bildirim gönderir.

Docker ortamında RabbitMQ/Redis kullanılır. Render ortamında bu servisler yoksa fallback mekanizmasıyla sistem çalışmaya devam eder.

---

## Mobil Backend Kanıtında Gösterilecekler

- Mobil uygulamadan login isteği
- Mobil uygulamadan tarla listeleme
- Mobil uygulamadan harita üzerinden tarla ekleme
- Mobil uygulamadan ürün ekleme
- Mobil uygulamadan sulama ve hava uyarısı endpointlerinin çağrılması
- Push token bilgisinin kullanıcı kaydına yazılması
- Test push bildiriminin gerçek telefona gelmesi
- Tarla silindiğinde bağlı ürünlerin temizlenmesi

---

## Sonuç

Mobil uygulama canlı Render backend servisiyle entegre çalışmaktadır. Kullanıcı, tarla, ürün, öneri, takvim ve push bildirim işlemleri REST API üzerinden yönetilmektedir.
