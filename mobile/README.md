# Ekinay Mobil Uygulama

Bu klasör Ekinay projesinin React Native + Expo ile geliştirilmiş mobil uygulamasını içerir.

---

## Kullanılan Teknolojiler

- React Native
- Expo
- Expo Router
- EAS Build
- JavaScript
- React Native Maps
- Google Maps SDK for Android
- Expo Notifications
- Firebase Cloud Messaging

---

## Canlı Backend API

Mobil uygulama Render üzerinde çalışan canlı REST API servisine bağlanır.

```txt
https://ekinay-smart-agriculture-system.onrender.com
```

---

## Android Package

```txt
com.ekinay.mobile
```

---

## Google Maps Yapılandırması

Mobil harita özelliği için Google Maps API key değeri EAS üzerinde environment variable olarak tutulur. API key repoya yazılmaz.

```txt
GOOGLE_MAPS_API_KEY=google-maps-api-key-degeri
```

Google Cloud tarafında Android apps restriction kullanılmalıdır.

```txt
Package name: com.ekinay.mobile
```

---

## EAS Preview APK Build

Final videosunda kullanılacak APK için preview profile kullanılır.

```txt
eas build -p android --profile preview --clear-cache
```

`preview` build APK üretir ve gerçek Android telefona kurulabilir.

---

## Temel Mobil Özellikler

- Kullanıcı girişi
- Kullanıcı kaydı
- Dashboard
- Profil görüntüleme ve güncelleme
- Tarla listeleme
- Google Maps haritası üzerinden tarla alanı seçme
- Haritada en az 3 nokta ile poligon oluşturma
- Tarla ekleme, güncelleme ve silme
- Ürün yönetimi
- Otomatik formatlanan ekim tarihi girişi
- Hızlı tarih seçenekleri ile hasat takvimi oluşturma
- Sulama önerisi
- Hava riski uyarısı
- Tarla takvimi
- Expo push bildirim token kaydı
- Gerçek telefona test bildirimi alma

---

## Mobil Tarla Ekleme Akışı

```txt
1. Dashboard ekranından Yeni Tarla Ekle seçilir.
2. Google Maps haritası açılır.
3. Antalya / Konya / Türkiye hazır konum butonlarından biri seçilebilir.
4. Haritada en az 3 nokta seçilir.
5. Uygulama seçilen noktalardan poligon oluşturur.
6. Merkez koordinat ve alan bilgisi hesaplanır.
7. Tarla adı ve konum açıklaması girilir.
8. Tarla backend'e kaydedilir.
```

---

## Mobil Ürün ve Takvim Akışı

```txt
1. Tarla detayından Ürün Ekle seçilir.
2. Ürün olarak domates, biber, salatalık veya fasulye seçilir.
3. Ekim tarihi girilir.
4. Kullanıcı sadece rakam yazarsa tarih otomatik yyyy-aa-gg formatına çevrilir.
5. Hızlı tarih butonları kullanılabilir.
6. Hasat tarihi bugünden önceyse kullanıcı uyarılır.
7. Geçerli tarih seçilirse takvim verisi oluşturulur.
```

---

## Push Bildirim

Mobil uygulama gerçek cihazda bildirim izni alır ve Expo push token değerini backend'e gönderir.

```txt
PUT /users/{userId}/push-token
```

Test bildirimi için backend endpointi:

```txt
POST /test-push/run
```

---

## Notlar

- Development build final demo için kullanılmaz.
- Final demo için preview APK kullanılır.
- Uygulama açıldığında Development Servers ekranı çıkmamalıdır.
- Google Maps API key ve Firebase Admin SDK secret dosyaları repoya eklenmez.
