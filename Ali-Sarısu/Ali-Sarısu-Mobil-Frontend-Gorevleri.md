# Ali Sarısu'nun Mobil Frontend Görevleri

Bu dosyada Ekinay mobil uygulamasının frontend tarafında yapılan işler açıklanmaktadır.

- **Öğrenci:** Ali Sarısu
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
- Gerekli bağımlılıklar kuruldu.
- Mobil uygulama Android cihaz üzerinde çalıştırıldı.
- EAS Build kullanılarak Android APK/build süreci test edildi.

**Kullanılan teknolojiler:**

```txt
React Native
Expo
Expo Router
EAS Build
JavaScript
```

---

## 2. Mobil Giriş Ekranı

Kullanıcının mobil uygulamadan sisteme giriş yapabilmesi için giriş ekranı hazırlanmıştır.

**Yapılan işler:**

- Email input alanı eklendi.
- Şifre input alanı eklendi.
- Giriş yap butonu eklendi.
- Başarılı girişte kullanıcı dashboard ekranına yönlendirildi.
- Hatalı girişte kullanıcıya hata mesajı gösterildi.
- Backend `POST /auth/login` endpointi ile bağlantı kuruldu.

**İlgili dosyalar:**

```txt
mobile/app/index.js
mobile/lib/api.js
mobile/lib/auth.js
```

**Kullanılan endpoint:**

```txt
POST /auth/login
```

---

## 3. Mobil Kayıt Ekranı

Yeni kullanıcıların mobil uygulama üzerinden sisteme kayıt olabilmesi için kayıt ekranı hazırlanmıştır.

**Yapılan işler:**

- Ad input alanı eklendi.
- Email input alanı eklendi.
- Şifre input alanı eklendi.
- Kayıt ol butonu eklendi.
- Başarılı kayıt sonrası kullanıcı bilgilendirildi.
- Backend `POST /auth/register` endpointi ile bağlantı kuruldu.

**İlgili dosyalar:**

```txt
mobile/app/register.js
mobile/lib/api.js
```

**Kullanılan endpoint:**

```txt
POST /auth/register
```

---

## 4. Mobil Dashboard Ekranı

Kullanıcının tarlalarını mobil uygulamada görebilmesi için dashboard ekranı hazırlanmıştır.

**Yapılan işler:**

- Kullanıcıya ait tarlalar listelendi.
- Her tarla için mobil uyumlu kart görünümü hazırlandı.
- Tarla adı, konum, ürün ve hasat bilgileri gösterildi.
- Bugünün sulama özeti gösterildi.
- Tarla detay ekranına geçiş sağlandı.
- Tarla ekleme ekranına geçiş sağlandı.
- Profil ekranına geçiş sağlandı.

**İlgili dosyalar:**

```txt
mobile/app/dashboard.js
mobile/lib/api.js
```

**Kullanılan endpointler:**

```txt
GET /fields?userId={userId}
GET /crops?userId={userId}
GET /recommendations/irrigation/{fieldId}
GET /recommendations/alerts/{fieldId}
```

---

## 5. Mobil Tarla Ekleme Ekranı

Kullanıcının mobil uygulama üzerinden yeni tarla ekleyebilmesi için tarla formu hazırlanmıştır.

**Yapılan işler:**

- Tarla adı alanı eklendi.
- Konum bilgisi alanı eklendi.
- Enlem ve boylam alanları eklendi.
- Alan bilgisi eklendi.
- Sera / açık alan bilgisi eklendi.
- Form verileri backend’e gönderildi.
- Kayıt sonrası dashboard ekranı güncellendi.

**İlgili dosyalar:**

```txt
mobile/app/field-form.js
mobile/lib/api.js
```

**Kullanılan endpoint:**

```txt
POST /fields
```

---

## 6. Mobil Tarla Güncelleme Ekranı

Kullanıcının mevcut tarla bilgilerini mobil uygulama üzerinden güncelleyebilmesi sağlanmıştır.

**Yapılan işler:**

- Mevcut tarla bilgileri forma dolduruldu.
- Kullanıcı tarla bilgilerini güncelleyebildi.
- Güncelleme isteği backend’e gönderildi.
- Güncelleme sonrası tarla detayları yenilendi.

**İlgili dosyalar:**

```txt
mobile/app/field-form.js
mobile/app/field-detail.js
mobile/lib/api.js
```

**Kullanılan endpoint:**

```txt
PUT /fields/{fieldId}
```

---

## 7. Mobil Tarla Detay Ekranı

Kullanıcı seçtiği tarlanın detaylarını mobil uygulamada görüntüleyebilmektedir.

**Yapılan işler:**

- Tarla adı gösterildi.
- Ürün bilgisi gösterildi.
- Ekim tarihi gösterildi.
- Tahmini hasat tarihi gösterildi.
- Sulama önerisi gösterildi.
- Hava riski uyarısı gösterildi.
- Tarla takvimi gösterildi.
- Takvim kayıtlarını telefona aktarma ve silme akışı hazırlandı.

**İlgili dosyalar:**

```txt
mobile/app/field-detail.js
mobile/lib/api.js
mobile/lib/calendar.js
```

---

## 8. Mobil Ürün Formu

Tarlaya bağlı ürün bilgilerinin mobil uygulama üzerinden yönetilebilmesi için ürün formu hazırlanmıştır.

**Yapılan işler:**

- Ürün seçimi yapıldı.
- Ekim tarihi bilgisi alındı.
- Ürün bilgisi tarlaya bağlandı.
- Ürün bilgisi backend’e gönderildi.
- Ürün değiştiğinde tarla kartı ve detay ekranı güncellendi.

**İlgili dosyalar:**

```txt
mobile/app/crop-form.js
mobile/lib/api.js
```

**Kullanılan endpointler:**

```txt
POST /crops
PUT /crops/{cropId}
DELETE /crops/{cropId}
```

---

## 9. Mobil Takvim Görünümü

Web tarafındaki takvim mantığı mobil uygulamaya da taşınmıştır.

**Yapılan işler:**

- Takvim bugünden başlatıldı.
- Ekim tarihinden bugüne kadar olan gereksiz bölüm gösterilmedi.
- Tahmini hasat tarihine kadar olan günler gösterildi.
- Günlük sulama ve tarımsal takip bilgileri kullanıcıya sunuldu.
- Takvim bilgilerinin telefon takvimine aktarılması için mobil taraf hazırlandı.
- Aktarılan takvim kayıtlarının tek seferde silinebilmesi için işlem eklendi.

**İlgili dosyalar:**

```txt
mobile/app/field-detail.js
mobile/lib/calendar.js
```

---

## 10. Profil Ekranı

Kullanıcının mobil uygulama üzerinden profil bilgilerini görüntüleyip güncelleyebilmesi sağlanmıştır.

**Yapılan işler:**

- Kullanıcı adı gösterildi.
- Email bilgisi gösterildi.
- Profil güncelleme formu hazırlandı.
- Güncelleme isteği backend’e gönderildi.
- İşlem sonucu kullanıcıya gösterildi.

**İlgili dosyalar:**

```txt
mobile/app/profile.js
mobile/lib/api.js
```

**Kullanılan endpointler:**

```txt
GET /users/{userId}
PUT /users/{userId}
```

---

## 11. Mobil Push Bildirim Arayüzü

Mobil uygulamada kullanıcıdan bildirim izni alınmış ve push bildirim sistemi için gerekli arayüz akışı hazırlanmıştır.

**Yapılan işler:**

- Bildirim izni istendi.
- Expo push token alındı.
- Push token backend’e gönderildi.
- Bildirim ayarı kullanıcı hesabına bağlandı.
- Gelen bildirime tıklandığında uygulama içi yönlendirme desteklendi.

**İlgili dosyalar:**

```txt
mobile/lib/notifications.js
mobile/lib/push.js
mobile/app/_layout.js
```

---

## 12. Gerçek Telefon Testi

Mobil uygulama gerçek Android telefon üzerinde test edilmiştir.

**Gösterilecekler:**

- Uygulamanın telefonda açılması
- Giriş yapılması
- Dashboard ekranının açılması
- Tarla kartlarının görüntülenmesi
- Tarla detay ekranına girilmesi
- Takvim ekranının görüntülenmesi
- Push bildirim izninin verilmesi
- Test veya gerçek hava alarmı bildiriminin telefona gelmesi

---

## Sonuç

Mobil frontend tarafında kullanıcı giriş/kayıt işlemleri, dashboard, tarla yönetimi, ürün yönetimi, takvim, profil ve push bildirim arayüzleri geliştirilmiştir. Uygulama gerçek Android telefon üzerinde çalıştırılmış ve final tesliminde video ile kanıtlanacaktır.