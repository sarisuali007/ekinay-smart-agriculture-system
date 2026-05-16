# Mobil Frontend

Bu dokümanda Ekinay mobil uygulamasının kullanıcı arayüzü ve kullanıcı deneyimi tarafında yapılan işler açıklanmaktadır.

Mobil uygulama React Native ve Expo kullanılarak geliştirilmiştir. Uygulama gerçek Android telefon üzerinde test edilmiştir.

---

## Mobil Frontend Kanıt Videosu

**Video Linki:**  
> Eklenecek

---

## Sorumlu Öğrenci

- Ali SARISU

Ayrıntılı görev listesi:

- [Ali SARISU Mobil Frontend Görevleri](Ali-SARISU/Ali-SARISU-Mobil-Frontend-Gorevleri.md)

---

## Mobil Uygulama Teknolojileri

- React Native
- Expo
- EAS Build
- Expo Router
- Expo Notifications
- React Native Maps
- Google Maps SDK for Android
- Android gerçek cihaz testi
- Firebase Cloud Messaging yapılandırması
- EAS environment variable ile Google Maps API key yönetimi

---

## Google Maps Yapılandırması

Mobil tarla ekleme ekranında Google Maps kullanılmaktadır. API key değeri repoya yazılmaz.

```txt
GOOGLE_MAPS_API_KEY
```

Bu değer EAS üzerinde environment variable olarak tutulur. Google Cloud tarafında Android uygulama kısıtlaması yapılır.

```txt
Package name: com.ekinay.mobile
```

---

## Mobil Frontend Kapsamı

### 1. Giriş Ekranı

Kullanıcının email ve şifre bilgileriyle sisteme giriş yapmasını sağlar.

**Özellikler:**

- Email alanı
- Şifre alanı
- Giriş yap butonu
- Hata ve başarı mesajları
- REST API ile bağlantı
- Başarılı giriş sonrası dashboard ekranına yönlendirme

---

### 2. Kayıt Ekranı

Yeni kullanıcıların sisteme kayıt olmasını sağlar.

**Özellikler:**

- Ad alanı
- Email alanı
- Şifre alanı
- Kayıt işlemi
- Backend'e kullanıcı oluşturma isteği gönderme
- Kayıt sonrası giriş ekranına veya dashboard akışına geçiş

---

### 3. Dashboard Ekranı

Kullanıcının kayıtlı tarlalarını ve tarla kartlarını görüntülediği ana ekrandır.

**Özellikler:**

- Kullanıcının tarlalarını listeleme
- Tarla kartlarını mobil uyumlu gösterme
- Tarla detayına geçiş
- Sulama özeti gösterimi
- Hasat ve ürün bilgilerini gösterme
- Tarla ekleme ekranına geçiş
- Profil ekranına geçiş
- Verileri yenileme

---

### 4. Tarla Ekleme ve Düzenleme Ekranı

Kullanıcının yeni tarla eklemesini veya mevcut tarla bilgisini güncellemesini sağlar.

**Özellikler:**

- Tarla adı
- Konum bilgisi
- Google Maps haritası üzerinden tarla alanı seçme
- Haritada en az 3 nokta seçerek poligon oluşturma
- Antalya / Konya / Türkiye hazır konum butonları
- Enlem ve boylam merkez bilgisinin otomatik hesaplanması
- Alan bilgisinin seçilen poligona göre hesaplanması
- Sera / açık alan bilgisi
- Tarla kaydetme ve güncelleme işlemleri
- REST API ile backend'e veri gönderme

**Kullanılan endpointler:**

```txt
POST /fields
PUT /fields/{fieldId}
DELETE /fields/{fieldId}?userId={userId}
```

---

### 5. Tarla Detay Ekranı

Kullanıcının seçtiği tarlaya ait bilgileri ve önerileri gösterir.

**Özellikler:**

- Tarla bilgileri
- Ürün bilgileri
- Sulama önerisi
- Hava riski mesajı
- Hasat tarihi
- Tarla takvimi
- Hasat tarihi bugünden önceye düşen ürünlerde kullanıcıya anlaşılır uyarı gösterme

**Kullanılan endpointler:**

```txt
GET /recommendations/irrigation/{fieldId}?userId={userId}
GET /recommendations/alerts/{fieldId}?userId={userId}
```

---

### 6. Ürün Ekleme ve Düzenleme Ekranı

Kullanıcının tarlaya ürün eklemesini veya ürünü güncellemesini sağlar.

**Özellikler:**

- Domates, biber, salatalık ve fasulye seçimi
- Ekim tarihi girişi
- Tarihin otomatik `yyyy-aa-gg` formatına çevrilmesi
- Kullanıcının sadece rakam yazarak tarih girebilmesi
- Bugün, 1 Hafta Önce, 1 Ay Önce, Hasada 30 Gün ve Hasada 7 Gün hızlı tarih seçenekleri
- Hasat tarihi bugünden önceye düşen ürünlerde boş takvim yerine uyarı gösterme
- Ürün kaydetme, güncelleme ve silme

**Kullanılan endpointler:**

```txt
POST /crops
PUT /crops/{cropId}
DELETE /crops/{cropId}?userId={userId}
```

---

### 7. Profil Ekranı

Kullanıcının profil bilgilerini görüntülemesini ve güncellemesini sağlar.

**Özellikler:**

- Ad bilgisi
- Email bilgisi
- Şifre güncelleme
- Şifre boş bırakılırsa eski şifrenin korunması
- Kullanıcıya anlaşılır başarı/hata mesajları

**Kullanılan endpointler:**

```txt
GET /users/{userId}
PUT /users/{userId}
```

---

### 8. Push Bildirim Akışı

Mobil uygulama gerçek cihazda bildirim izni alır ve Expo push token bilgisini backend'e gönderir.

**Kullanılan endpoint:**

```txt
PUT /users/{userId}/push-token
```

**Özellikler:**

- Bildirim izni isteme
- Expo push token alma
- Push token bilgisini MongoDB kullanıcı kaydına yazma
- Test push bildirimi alma
- Otomatik hava riski bildirimlerini destekleme

---

## Mobil Frontend Test Akışı

Final videosunda gösterilecek önerilen akış:

```txt
1. Uygulama gerçek Android telefonda açılır.
2. Kullanıcı giriş yapar veya yeni hesap oluşturur.
3. Dashboard ekranında tarlalar listelenir.
4. Yeni tarla ekleme ekranı açılır.
5. Google Maps haritası üzerinden en az 3 nokta seçilerek tarla alanı oluşturulur.
6. Tarla kaydedilir ve dashboard'da yeni tarla kartı gösterilir.
7. Tarlaya ürün eklenir.
8. Ürün ekim tarihi hızlı tarih butonları veya otomatik formatlanan tarih alanı ile girilir.
9. Tarla detayına girilir.
10. Sulama, hava uyarısı ve takvim bilgileri gösterilir.
11. Bildirim izni ve push bildirim akışı gösterilir.
```

---

## Sonuç

Mobil frontend tarafında kullanıcı giriş/kayıt, dashboard, profil, harita üzerinden tarla ekleme, ürün yönetimi, takvim, sulama önerisi, hava uyarısı ve push bildirim akışları geliştirilmiştir. Uygulama gerçek Android telefon üzerinde test edilmiştir.
