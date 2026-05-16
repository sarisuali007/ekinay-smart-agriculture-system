# Ali SARISU Mobil Frontend Görevleri

Bu dosyada Ekinay mobil uygulamasının frontend tarafında yapılan işler açıklanmaktadır.

- **Öğrenci:** Ali SARISU
- **Grup:** TENGYAMİ
- **Proje:** Ekinay
- **Mobil Teknoloji:** React Native + Expo
- **Test Ortamı:** Gerçek Android telefon

---

## Mobil Frontend Kanıt Videosu

**Video Linki:**  
> Eklenecek

---

## 1. Mobil Uygulama Projesinin Kurulması

Mobil uygulama, React Native ve Expo altyapısı ile geliştirilmiştir.

**Yapılan işler:**

- `mobile` klasörü oluşturuldu.
- Expo tabanlı mobil proje hazırlandı.
- Expo Router yapısı kullanıldı.
- EAS Build ile Android APK üretildi.
- Development build yerine final demo için preview APK kullanıldı.
- Uygulama gerçek Android cihazda test edildi.

**Kullanılan teknolojiler:**

```txt
React Native
Expo
Expo Router
EAS Build
JavaScript
React Native Maps
Google Maps SDK for Android
Expo Notifications
```

---

## 2. Mobil Giriş Ekranı

**Yapılan işler:**

- Email input alanı eklendi.
- Şifre input alanı eklendi.
- Giriş yap butonu eklendi.
- Başarılı girişte kullanıcı dashboard ekranına yönlendirildi.
- Hatalı girişte kullanıcıya hata mesajı gösterildi.
- Backend `POST /auth/login` endpointi ile bağlantı kuruldu.

---

## 3. Mobil Kayıt Ekranı

**Yapılan işler:**

- Ad input alanı eklendi.
- Email input alanı eklendi.
- Şifre input alanı eklendi.
- Kayıt ol butonu eklendi.
- Backend `POST /auth/register` endpointi ile bağlantı kuruldu.

---

## 4. Mobil Dashboard Ekranı

**Yapılan işler:**

- Kullanıcıya ait tarlalar listelendi.
- Tarla kartları mobil uyumlu şekilde gösterildi.
- Tarla detay ekranına geçiş eklendi.
- Verileri yenileme akışı eklendi.
- Profil ve yeni tarla ekranına geçiş eklendi.
- `fieldId: null` ürünlerden kaynaklanan hata backend düzeltmesiyle giderildi.

**Kullanılan endpointler:**

```txt
GET /fields?userId={userId}
GET /crops?userId={userId}
```

---

## 5. Mobil Tarla Ekleme Ekranı

**Yapılan işler:**

- Tarla adı alanı eklendi.
- Konum bilgisi alanı eklendi.
- React Native Maps ile mobil harita arayüzü eklendi.
- Google Maps SDK for Android yapılandırması EAS build sürecine bağlandı.
- `GOOGLE_MAPS_API_KEY` değeri EAS environment variable olarak yönetildi.
- Harita üzerinde en az 3 nokta seçilerek tarla poligonu oluşturma akışı eklendi.
- Antalya / Konya / Türkiye hazır konum butonları eklendi.
- Seçilen poligon üzerinden merkez koordinat ve alan bilgisi hesaplandı.
- Sera / açık alan bilgisi eklendi.
- Form verileri backend'e gönderildi.
- Kayıt sonrası dashboard ekranı güncellendi.

**Kullanılan endpoint:**

```txt
POST /fields
```

---

## 6. Mobil Tarla Güncelleme ve Silme

**Yapılan işler:**

- Mevcut tarla bilgilerini düzenleme akışı eklendi.
- Tarla silme işlemi eklendi.
- Tarla silindiğinde bağlı ürünlerin de backend tarafında temizlenmesi sağlandı.
- Silme sonrası dashboard'ın bozulmadan yenilenmesi test edildi.

**Kullanılan endpointler:**

```txt
PUT /fields/{fieldId}
DELETE /fields/{fieldId}?userId={userId}
```

---

## 7. Mobil Tarla Detay Ekranı

**Yapılan işler:**

- Tarla bilgileri gösterildi.
- Ürün bilgisi gösterildi.
- Sulama önerisi gösterildi.
- Hava riski mesajı gösterildi.
- Takvim görünümü eklendi.
- Hasat tarihi bugünden önceye düşen ürünlerde açıklayıcı uyarı gösterildi.

**Kullanılan endpointler:**

```txt
GET /recommendations/irrigation/{fieldId}?userId={userId}
GET /recommendations/alerts/{fieldId}?userId={userId}
```

---

## 8. Mobil Ürün Formu

**Yapılan işler:**

- Ürün seçimi yapıldı.
- Ekim tarihi bilgisi alındı.
- Tarih girişi mobil kullanıma uygun şekilde otomatik formatlandı.
- Kullanıcı sadece rakam yazarak `yyyy-aa-gg` formatında tarih oluşturabilir hale getirildi.
- Bugün, 1 Hafta Önce, 1 Ay Önce, Hasada 30 Gün ve Hasada 7 Gün hızlı tarih seçenekleri eklendi.
- Hasat tarihi bugünden önceye düşen ürünlerde kullanıcıya uyarı gösterildi.
- Ürün bilgisi tarlaya bağlandı.
- Ürün bilgisi backend'e gönderildi.
- Ürün değiştiğinde tarla kartı ve detay ekranı güncellendi.

**Kullanılan endpointler:**

```txt
POST /crops
PUT /crops/{cropId}
DELETE /crops/{cropId}?userId={userId}
```

---

## 9. Mobil Profil Ekranı

**Yapılan işler:**

- Kullanıcı profil bilgileri getirildi.
- Ad ve email güncelleme akışı oluşturuldu.
- Şifre yazılırsa şifre güncellenecek, boş bırakılırsa eski şifre korunacak şekilde backend ile uyumlu çalışıldı.
- Profil güncelleme sonrası kullanıcıya mesaj gösterildi.

**Kullanılan endpointler:**

```txt
GET /users/{userId}
PUT /users/{userId}
```

---

## 10. Mobil Bildirim İzni ve Push Token

**Yapılan işler:**

- Bildirim izni istendi.
- Expo push token alındı.
- Token backend'e gönderildi.
- MongoDB kullanıcı kaydına `expoPushToken` ve `pushAlertsEnabled` alanları eklendi.
- Gerçek telefona test bildirimi geldiği doğrulandı.

**Kullanılan endpoint:**

```txt
PUT /users/{userId}/push-token
```

---

## 11. Gerçek Telefon Testi

Final videosunda gösterilecekler:

- Ekinay ikonunun görünmesi
- Splash ekranının açılması
- Development Servers ekranının çıkmaması
- Kullanıcı kayıt/giriş işlemi
- Google Maps üzerinden yeni tarla eklenmesi
- Haritada 3 nokta seçilerek tarla alanı oluşturulması
- Ürün ekleme ekranında hızlı tarih butonlarının kullanılması
- Yeni eklenen tarlada takvim bilgisinin görüntülenmesi
- Push bildirimin gerçek telefona gelmesi

---

## Sonuç

Mobil frontend tarafında gerçek Android cihazda çalışan, Google Maps destekli, tarla/ürün/takvim/profil/push bildirim akışlarını içeren mobil uygulama arayüzü geliştirilmiştir.
