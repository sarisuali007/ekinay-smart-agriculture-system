# Web Frontend

Bu dokümanda Ekinay web frontend tarafında geliştirilen kullanıcı arayüzü ve kullanıcı deneyimi görevleri açıklanmaktadır.

---

## Web Frontend Adresi

**Canlı Web Frontend:**  
https://ekinay-smart-agriculture-system.vercel.app

---

## Sorumlu Öğrenci

Proje tek kişi tarafından geliştirilmiştir.

1. [Ali Sarısu Web Frontend Görevleri](Ali-Sarısu/Ali-Sarısu-Web-Frontend-Gorevleri.md)

---

## Web Frontend Teknolojileri

- HTML
- CSS
- JavaScript
- Fetch API
- Vercel

---

## Web Frontend Genel Yapısı

Web frontend tarafı kullanıcıların tarla ve ürün yönetimi yapabilmesi, sulama önerilerini görebilmesi, hava riski uyarılarını takip edebilmesi ve tarla takvimini kullanabilmesi için geliştirilmiştir.

Frontend, canlı Render backend servisine `fetch` API ile bağlanmaktadır.

---

## Web Frontend Kapsamı

### 1. Tanıtım / Landing Sayfası

Kullanıcıya Ekinay sisteminin ne işe yaradığını anlatan giriş sayfasıdır.

**Özellikler:**

- Proje tanıtımı
- Ürün amacı
- Dashboard’a geçiş bağlantısı
- Login/Register akışına yönlendirme

---

### 2. Kullanıcı Kayıt Ekranı

Yeni kullanıcıların sisteme kayıt olmasını sağlar.

**Bağlı endpoint:**

```txt
POST /auth/register
```

---

### 3. Kullanıcı Giriş Ekranı

Kayıtlı kullanıcıların sisteme giriş yapmasını sağlar.

**Bağlı endpoint:**

```txt
POST /auth/login
```

---

### 4. Dashboard Ekranı

Kullanıcının kayıtlı tarlalarını listelediği ana ekrandır.

**Özellikler:**

- Tarla kartları
- Ürün bilgisi
- Bugünün sulama özeti
- Hava riski bilgisi
- Tahmini hasat tarihi
- Tarla detayına geçiş
- Tarla ekleme alanı

**Bağlı endpointler:**

```txt
GET /fields?userId={userId}
GET /crops?userId={userId}
GET /recommendations/irrigation/{fieldId}
GET /recommendations/alerts/{fieldId}
```

---

### 5. Tarla Ekleme ve Güncelleme

Kullanıcı web arayüzünden tarla ekleyebilir ve mevcut tarlasını güncelleyebilir.

**Özellikler:**

- Tarla adı
- Konum bilgisi
- Harita üzerinden alan seçme
- Enlem ve boylam bilgisi
- Alan bilgisi
- Sera / açık alan seçimi

**Bağlı endpointler:**

```txt
POST /fields
PUT /fields/{fieldId}
DELETE /fields/{fieldId}
```

---

### 6. Ürün Yönetimi

Kullanıcı tarlaya bağlı ürün bilgisini yönetebilir.

**Desteklenen ürünler:**

- Domates
- Biber
- Salatalık
- Fasulye

**Bağlı endpointler:**

```txt
GET /crops?userId={userId}
POST /crops
PUT /crops/{cropId}
DELETE /crops/{cropId}
```

---

### 7. Takvim Görünümü

Web tarafında tarlaya ait ekim ve hasat süreci takvim görünümü ile gösterilir.

**Özellikler:**

- Takvim bugünden başlar.
- Ekim tarihinden bugüne kadar olan geçmiş kısım gösterilmez.
- Tahmini hasat tarihine kadar olan süreç gösterilir.
- Sulama ve tarımsal takip bilgileri gün bazlı sunulur.

---

### 8. Profil Düzenleme

Kullanıcı profil bilgilerini ayrı bir profil sayfasında düzenleyebilir.

**Bağlı endpointler:**

```txt
GET /users/{userId}
PUT /users/{userId}
```

---

## Web Frontend Kanıt Videosu

**Video Linki:**  
> Eklenecek

Videoda gösterilecekler:

- Canlı Vercel frontend adresinin açılması
- Kayıt ve giriş işlemleri
- Dashboard ekranı
- Tarla ekleme, düzenleme ve silme
- Ürün ekleme, düzenleme ve silme
- Harita üzerinden tarla alanı seçimi
- Takvim görünümü
- Render REST API bağlantısının çalışması
- MongoDB üzerinde webden gelen verilerin görünmesi

---

## Sonuç

Web frontend tarafında kullanıcı kayıt/giriş, dashboard, profil, tarla yönetimi, ürün yönetimi, sulama özeti, hava riski uyarısı ve takvim özellikleri geliştirilmiştir. Web frontend canlı olarak Vercel üzerinde yayınlanmaktadır.