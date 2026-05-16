# Ekinay Mobile

Bu klasör Ekinay projesinin mobil uygulama kodlarını içerir.

Mobil uygulama React Native ve Expo kullanılarak geliştirilmiştir. Uygulama gerçek Android telefon üzerinde test edilmiştir.

---

## Kullanılan Teknolojiler

- React Native
- Expo
- Expo Router
- EAS Build
- Expo Notifications
- Firebase Cloud Messaging
- JavaScript

---

## Canlı Backend API

Mobil uygulama canlı Render backend servisine bağlanır.

```txt
https://ekinay-smart-agriculture-system.onrender.com
```

---

## Kurulum

```bash
cd mobile
npm install
```

---

## Geliştirme Ortamında Çalıştırma

```bash
npx expo start
```

Expo geliştirme ekranından Android cihaz veya development build ile uygulama açılabilir.

---

## Android Build

EAS Build ile Android build alınabilir.

```bash
eas build -p android --profile preview
```

veya production build için:

```bash
eas build -p android --profile production
```

---

## Mobil Uygulama Özellikleri

- Kullanıcı girişi
- Kullanıcı kaydı
- Dashboard
- Tarla listeleme
- Tarla ekleme
- Tarla güncelleme
- Tarla detay görüntüleme
- Ürün yönetimi
- Sulama önerisi görüntüleme
- Hava riski uyarısı görüntüleme
- Tarla takvimi
- Telefon takvimine aktarma
- Takvim kayıtlarını tek seferde silme
- Push bildirim izni alma
- Expo push token kaydı
- Gerçek telefona bildirim alma

---

## Push Bildirim Sistemi

Mobil uygulama kullanıcıdan bildirim izni alır. İzin verildiğinde Expo push token alınır ve backend’e gönderilir.

Backend tarafında kullanıcı kaydına şu alanlar eklenir:

```txt
expoPushToken
pushAlertsEnabled
```

Bu sayede otomatik hava riski uyarıları gerçek Android telefona gönderilebilir.

---

## Mobil Backend Bağlantısı

Mobil uygulama aşağıdaki işlemleri REST API üzerinden gerçekleştirir:

```txt
POST /auth/register
POST /auth/login
GET /users/{userId}
PUT /users/{userId}
GET /fields?userId={userId}
POST /fields
PUT /fields/{fieldId}
DELETE /fields/{fieldId}
GET /crops?userId={userId}
POST /crops
PUT /crops/{cropId}
DELETE /crops/{cropId}
GET /recommendations/irrigation/{fieldId}
GET /recommendations/alerts/{fieldId}
PUT /users/{userId}/push-token
```

---

## Final Kanıt Videosunda Gösterilecekler

- Uygulamanın gerçek Android telefonda açılması
- Kullanıcı girişi
- Dashboard ekranı
- Tarla kartları
- Tarla detay ekranı
- Takvim ekranı
- Push bildirim izni
- Test veya gerçek hava riski bildirimi
- Bildirime tıklayınca uygulama içi yönlendirme

---

## Notlar

- Firebase Admin SDK private key dosyaları repoya eklenmemelidir.
- `.env` dosyaları repoya eklenmemelidir.
- `google-services.json` Android bildirim yapılandırması için kullanılabilir.
- Gerçek bildirim testi için EAS build alınmış uygulama kullanılmalıdır.