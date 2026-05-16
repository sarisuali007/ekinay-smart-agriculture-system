
---

# 3) `MobilFrontEnd.md` dosyasını komple değiştir

```markdown
# Mobil Frontend

Bu dokümanda Ekinay mobil uygulamasının kullanıcı arayüzü ve kullanıcı deneyimi tarafında yapılan işler açıklanmaktadır.

Mobil uygulama React Native ve Expo kullanılarak geliştirilmiştir. Uygulama gerçek Android telefon üzerinde test edilmiştir.

---

## Mobil Frontend Kanıt Videosu

**Video Linki:**  
> Eklenecek

---

## Mobil Uygulama Teknolojileri

- React Native
- Expo
- EAS Build
- Expo Router
- Expo Notifications
- Android gerçek cihaz testi
- Firebase Cloud Messaging yapılandırması

---

## Mobil Frontend Kapsamı

Mobil uygulamada aşağıdaki ekranlar ve kullanıcı akışları geliştirilmiştir:

### 1. Giriş Ekranı

Kullanıcının email ve şifre bilgileriyle sisteme giriş yapmasını sağlar.

**Özellikler:**

- Email alanı
- Şifre alanı
- Giriş yap butonu
- Hata ve başarı mesajları
- REST API ile bağlantı

---

### 2. Kayıt Ekranı

Yeni kullanıcıların sisteme kayıt olmasını sağlar.

**Özellikler:**

- Ad alanı
- Email alanı
- Şifre alanı
- Kayıt işlemi
- Backend’e kullanıcı oluşturma isteği gönderme

---

### 3. Dashboard Ekranı

Kullanıcının kayıtlı tarlalarını ve tarla kartlarını görüntülediği ana ekrandır.

**Özellikler:**

- Kullanıcının tarlalarını listeleme
- Tarla kartlarını mobil uyumlu gösterme
- Tarla detayına geçiş
- Sulama özeti gösterimi
- Hasat ve ürün bilgilerini gösterme

---

### 4. Tarla Detay Ekranı

Seçilen tarlaya ait detayları gösterir.

**Özellikler:**

- Tarla adı
- Ürün bilgisi
- Ekim tarihi
- Tahmini hasat tarihi
- Sulama bilgisi
- Hava riski bilgisi
- Tarla takvimi

---

### 5. Takvim Görünümü

Tarlanın bugünden tahmini hasat tarihine kadar olan sürecini gösterir.

**Özellikler:**

- Gün bazlı tarla takvimi
- Sulama gerekliliği bilgisi
- Hasat tarihine kadar takip
- Web tarafındaki takvim mantığına uyumlu mobil görünüm

---

### 6. Bildirim İzni ve Push Bildirim

Mobil uygulama kullanıcıdan bildirim izni alır ve Expo push token bilgisini backend’e kaydeder.

**Özellikler:**

- Bildirim izni isteme
- Expo push token alma
- Push token bilgisini MongoDB üzerindeki kullanıcı kaydına yazma
- Hava riski durumunda telefona bildirim gönderme
- Bildirime tıklanınca uygulama içinde ilgili ekrana yönlendirme

---

## Kullanıcı Deneyimi

Mobil uygulamada sade, anlaşılır ve tarımsal kullanım senaryosuna uygun bir kullanıcı deneyimi hedeflenmiştir.

- Ekranlar gerçek telefonda kullanılabilir şekilde düzenlenmiştir.
- Formlar mobil kullanıma uygundur.
- Tarla kartları okunabilir şekilde tasarlanmıştır.
- Kullanıcıya anlaşılır hata ve başarı mesajları verilir.
- Bildirim sistemi gerçek cihazda test edilmiştir.

---

## Sorumlu Öğrenci

- Ali Sarısu

Ayrıntılı görev listesi için:

[Ali Sarısu Mobil Frontend Görevleri](Ali-Sarısu/Ali-Sarısu-Mobil-Frontend-Gorevleri.md)