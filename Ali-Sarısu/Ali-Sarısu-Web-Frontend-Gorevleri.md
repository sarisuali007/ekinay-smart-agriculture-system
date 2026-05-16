# Ali Sarısu Web Frontend Görevleri

Bu dosyada Ekinay web frontend tarafında geliştirilen ekranlar ve görevler açıklanmaktadır.

- **Öğrenci:** Ali Sarısu
- **Grup:** TENGYAMİ
- **Proje:** Ekinay
- **Frontend Adresi:** https://ekinay-smart-agriculture-system.vercel.app
- **Backend Adresi:** https://ekinay-smart-agriculture-system.onrender.com

---

## Web Frontend Kanıt Videosu

**Video Linki:**  
> Eklenecek

---

## 1. Tanıtım / Landing Sayfası

**Görev:**  
Ekinay sistemini kullanıcıya tanıtan giriş sayfasını hazırlamak.

**Yapılan işler:**

- Proje tanıtım metni eklendi.
- Akıllı tarım sistemi anlatıldı.
- Kullanıcıyı giriş/kayıt akışına yönlendiren butonlar eklendi.
- Web sitesinin ilk izlenimi düzenlendi.

**İlgili teknolojiler:**

```txt
HTML
CSS
JavaScript
```

---

## 2. Kullanıcı Kayıt Arayüzü

**API Endpoint:**

```txt
POST /auth/register
```

**Görev:**  
Kullanıcının ad, email ve şifre bilgileri ile sisteme kayıt olmasını sağlayan web arayüzünü geliştirmek.

**UI Bileşenleri:**

- Ad input alanı
- Email input alanı
- Şifre input alanı
- Kayıt ol butonu
- Başarı ve hata mesaj alanı

**Teknik detaylar:**

- Formdan alınan bilgiler JSON formatında backend’e gönderildi.
- `fetch` API kullanıldı.
- Başarılı kayıt sonrası kullanıcı bilgilendirildi.

---

## 3. Kullanıcı Giriş Arayüzü

**API Endpoint:**

```txt
POST /auth/login
```

**Görev:**  
Kullanıcının email ve şifre bilgileri ile sisteme giriş yapmasını sağlamak.

**UI Bileşenleri:**

- Email input alanı
- Şifre input alanı
- Giriş yap butonu
- Hata mesaj alanı

**Teknik detaylar:**

- Backend’e login isteği gönderildi.
- Başarılı girişte kullanıcı bilgisi tarayıcı tarafında tutuldu.
- Kullanıcı dashboard ekranına yönlendirildi.

---

## 4. Dashboard Arayüzü

**API Endpointleri:**

```txt
GET /fields?userId={userId}
GET /crops?userId={userId}
GET /recommendations/irrigation/{fieldId}
GET /recommendations/alerts/{fieldId}
```

**Görev:**  
Kullanıcının tarlalarını, ürünlerini, sulama özetini ve hava riski bilgilerini tek ekranda göstermesini sağlamak.

**UI Bileşenleri:**

- Tarla kartları
- Ürün bilgisi
- Ekim tarihi
- Tahmini hasat tarihi
- Bugünün sulama özeti
- Hava riski mesajı
- Tarla detayına geçiş
- Tarla ekleme alanı

**Teknik detaylar:**

- Kullanıcıya ait tarlalar backend’den çekildi.
- Her tarla için ürün bilgisi eşleştirildi.
- Her tarla kartına sulama ve risk bilgisi eklendi.
- Dashboard gereksiz profil ayarlarından temizlendi.

---

## 5. Profil Düzenleme Sayfası

**API Endpointleri:**

```txt
GET /users/{userId}
PUT /users/{userId}
```

**Görev:**  
Kullanıcının profil bilgilerini ayrı bir sayfada görüntüleyip güncellemesini sağlamak.

**UI Bileşenleri:**

- Kullanıcı adı alanı
- Email alanı
- Şifre alanı
- Profil güncelleme butonu
- Başarı/hata mesaj alanı

**Teknik detaylar:**

- Profil ayarları dashboard’dan ayrıldı.
- Kullanıcı bilgileri backend’den çekildi.
- Güncelleme isteği backend’e gönderildi.

---

## 6. Tarla Ekleme Arayüzü

**API Endpoint:**

```txt
POST /fields
```

**Görev:**  
Kullanıcının yeni tarla ekleyebilmesini sağlamak.

**UI Bileşenleri:**

- Tarla adı alanı
- Konum alanı
- Harita alanı
- Enlem ve boylam bilgisi
- Alan bilgisi
- Sera / açık alan seçimi
- Kaydet butonu

**Teknik detaylar:**

- Harita üzerinden tarla konumu seçme yapısı eklendi.
- Tarla poligon bilgisi backend’e gönderildi.
- Backend’e `POST /fields` isteği gönderildi.
- Kayıt sonrası dashboard güncellendi.

---

## 7. Tarla Güncelleme Arayüzü

**API Endpoint:**

```txt
PUT /fields/{fieldId}
```

**Görev:**  
Kullanıcının mevcut tarla bilgilerini güncelleyebilmesini sağlamak.

**UI Bileşenleri:**

- Güncelleme formu
- Tarla adı
- Konum
- Koordinat bilgileri
- Alan ve sera bilgisi
- Güncelle butonu

**Teknik detaylar:**

- Seçilen tarla bilgileri forma dolduruldu.
- Güncelleme isteği backend’e gönderildi.
- Güncel bilgiler dashboard’a yansıtıldı.

---

## 8. Tarla Silme Arayüzü

**API Endpoint:**

```txt
DELETE /fields/{fieldId}
```

**Görev:**  
Kullanıcının mevcut tarlasını silebilmesini sağlamak.

**UI Bileşenleri:**

- Silme butonu
- Kullanıcı onayı
- İşlem sonucu mesajı

**Teknik detaylar:**

- Silme isteği backend’e gönderildi.
- Silinen tarla dashboard listesinden kaldırıldı.

---

## 9. Ürün Ekleme ve Güncelleme Arayüzü

**API Endpointleri:**

```txt
POST /crops
PUT /crops/{cropId}
DELETE /crops/{cropId}
```

**Görev:**  
Kullanıcının tarlaya bağlı ürün bilgisi ekleyip güncelleyebilmesini sağlamak.

**UI Bileşenleri:**

- Ürün seçimi
- Ekim tarihi seçimi
- Ürün kaydetme butonu
- Ürün güncelleme ve silme seçenekleri

**Desteklenen ürünler:**

```txt
domates
biber
salatalık
fasulye
```

**Teknik detaylar:**

- Ürün bilgisi tarlaya bağlandı.
- Ekim tarihi backend’e gönderildi.
- Tahmini hasat tarihi ürün profiline göre hesaplandı.
- Tarla kartları ürün bilgisine göre güncellendi.

---

## 10. Harita Üzerinden Tarla Seçimi

**Görev:**  
Kullanıcının tarlasını yalnızca koordinat yazarak değil, harita üzerinden seçebilmesini sağlamak.

**Yapılan işler:**

- Harita arayüzü eklendi.
- Adres arama desteği eklendi.
- Tarla alanı seçme/drawing mantığı oluşturuldu.
- Seçilen alanın koordinatları backend’e gönderildi.

**Amaç:**

- Kullanıcının tarlasını daha kolay tanımlamasını sağlamak.
- Tarla konumunu sulama ve hava riski önerilerinde kullanmak.

---

## 11. Takvim Arayüzü

**Görev:**  
Tarlanın bugünden tahmini hasat tarihine kadar olan sürecini takvim yapısında göstermek.

**Yapılan işler:**

- Takvim geçmiş günleri göstermeyecek şekilde düzenlendi.
- Takvim bugünden başlatıldı.
- Tahmini hasat tarihine kadar olan günler gösterildi.
- Günlük sulama takip bilgisi takvime bağlandı.
- Dashboard’daki gereksiz “bugün/yarın/2 gün sonra” yapısı sadeleştirildi.

---

## 12. Hata ve Başarı Mesajları

**Görev:**  
Kullanıcının yaptığı işlemlerde sonucu net şekilde görebilmesini sağlamak.

**Yapılan işler:**

- Kayıt işleminde başarı/hata mesajı gösterildi.
- Giriş işleminde hata mesajı gösterildi.
- Profil güncellemede sonuç mesajı gösterildi.
- Tarla ve ürün işlemlerinde kullanıcı bilgilendirildi.
- API hataları kullanıcıya anlaşılır şekilde yansıtıldı.

---

## 13. Frontend - Backend Entegrasyonu

**Görev:**  
Web arayüzünün canlı Render backend servisi ile çalışmasını sağlamak.

**Yapılan işler:**

- API istekleri `fetch` ile gönderildi.
- Vercel frontend canlı backend domainine bağlandı.
- Kullanıcı işlemleri MongoDB üzerinde karşılık buldu.
- Dashboard verileri canlı API’den çekildi.

---

## Finalde Gösterilecek Web Frontend Kanıtları

- Vercel web adresinin açılması
- Kullanıcı kayıt ve giriş işlemleri
- Dashboard ekranı
- Tarla kartları
- Tarla ekleme, düzenleme ve silme
- Ürün ekleme, düzenleme ve silme
- Harita üzerinden tarla seçimi
- Takvim görünümü
- Profil düzenleme
- MongoDB’de web üzerinden oluşturulan verilerin görünmesi

---

## Sonuç

Web frontend tarafında Ekinay sisteminin kullanıcıya dönük ana arayüzü geliştirilmiştir. Kullanıcılar web üzerinden kayıt olabilir, giriş yapabilir, tarlalarını ve ürünlerini yönetebilir, sulama önerilerini ve hava riski uyarılarını takip edebilir.