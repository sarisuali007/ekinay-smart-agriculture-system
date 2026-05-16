# Mobil Frontend

Bu dokümanda Ekinay mobil uygulamasının kullanıcı arayüzü ve kullanıcı deneyimi tarafında yapılan işler açıklanmaktadır.

Mobil uygulama React Native ve Expo kullanılarak geliştirilmiştir. Uygulama gerçek Android telefon üzerinde test edilmiştir.

---

## Mobil Frontend Kanıt Videosu

**Video Linki:**  
> Eklenecek

---

## Sorumlu Öğrenci

- Ali Sarısu

Ayrıntılı görev listesi:

- [Ali Sarısu Mobil Frontend Görevleri](Ali-Sarısu/Ali-Sarısu-Mobil-Frontend-Gorevleri.md)

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
- Başarılı giriş sonrası dashboard ekranına yönlendirme

---

### 2. Kayıt Ekranı

Yeni kullanıcıların sisteme kayıt olmasını sağlar.

**Özellikler:**

- Ad alanı
- Email alanı
- Şifre alanı
- Kayıt işlemi
- Backend’e kullanıcı oluşturma isteği gönderme
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

---

### 4. Tarla Ekleme ve Düzenleme Ekranı

Kullanıcının yeni tarla eklemesini veya mevcut tarla bilgisini güncellemesini sağlar.

**Özellikler:**

- Tarla adı
- Konum bilgisi
- Enlem ve boylam bilgisi
- Sera / açık alan bilgisi
- Alan bilgisi
- Tarla kaydetme ve güncelleme işlemleri
- REST API ile backend’e veri gönderme

---

### 5. Tarla Detay Ekranı

Seçilen tarlaya ait detayları gösterir.

**Özellikler:**

- Tarla adı
- Ürün bilgisi
- Ekim tarihi
- Tahmini hasat tarihi
- Sulama bilgisi
- Hava riski bilgisi
- Tarla takvimi
- Takvime aktarma ve takvim kayıtlarını temizleme işlemleri

---

### 6. Takvim Görünümü

Tarlanın bugünden tahmini hasat tarihine kadar olan sürecini gösterir.

**Özellikler:**

- Gün bazlı tarla takvimi
- Sulama gerekliliği bilgisi
- Hasat tarihine kadar takip
- Web tarafındaki takvim mantığına uyumlu mobil görünüm
- Kullanıcının bugünden sonraki süreci takip edebilmesi

---

### 7. Profil Ekranı

Kullanıcının profil bilgilerini görüntüleyip güncellemesini sağlar.

**Özellikler:**

- Kullanıcı adı
- Email bilgisi
- Şifre güncelleme
- Backend’e profil güncelleme isteği gönderme
- Güncelleme sonrası kullanıcıya sonuç mesajı gösterme

---

### 8. Bildirim İzni ve Push Bildirim

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
- Tarla ve ürün bilgileri kullanıcının anlayacağı şekilde sunulmuştur.

---

## Finalde Gösterilecek Mobil Frontend Akışı

1. Uygulama gerçek Android telefonda açılır.
2. Kullanıcı giriş yapar.
3. Dashboard ekranında tarlalar listelenir.
4. Tarla detayına girilir.
5. Tarla takvimi gösterilir.
6. Profil ekranı açılır.
7. Bildirim izni ve push bildirim akışı gösterilir.