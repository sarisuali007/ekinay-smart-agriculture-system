# Web Frontend

Bu dokümanda Ekinay web frontend tarafında geliştirilen kullanıcı arayüzü ve kullanıcı deneyimi görevleri açıklanmaktadır.

---

## Web Frontend Adresi

**Canlı Web Frontend:**  
https://ekinay-smart-agriculture-system.vercel.app

---

## Sorumlu Öğrenci

Proje tek kişi tarafından geliştirilmiştir.

1. [Ali SARISU Web Frontend Görevleri](Ali-SARISU/Ali-SARISU-Web-Frontend-Gorevleri.md)

---

## Web Frontend Teknolojileri

- HTML
- CSS
- JavaScript
- Fetch API
- Vercel
- Harita üzerinden tarla alanı seçimi

---

## Web Frontend Genel Yapısı

Web frontend tarafı kullanıcıların tarla ve ürün yönetimi yapabilmesi, sulama önerilerini görebilmesi, hava riski uyarılarını takip edebilmesi ve tarla takvimini kullanabilmesi için geliştirilmiştir.

Frontend, canlı Render backend servisine `fetch` API ile bağlanmaktadır.

---

## Web Frontend Kapsamı

### 1. Tanıtım / Landing Sayfası

Kullanıcıya Ekinay sisteminin ne işe yaradığını anlatan giriş sayfasıdır.

### 2. Kullanıcı Kayıt Ekranı

```txt
POST /auth/register
```

### 3. Kullanıcı Giriş Ekranı

```txt
POST /auth/login
```

### 4. Dashboard Ekranı

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
GET /recommendations/irrigation/{fieldId}?userId={userId}
GET /recommendations/alerts/{fieldId}?userId={userId}
```

### 5. Tarla Ekleme ve Güncelleme

**Özellikler:**

- Tarla adı
- Konum bilgisi
- Harita üzerinden alan seçme
- Enlem ve boylam bilgisi
- Alan bilgisi
- Sera / açık alan seçimi
- Poligon bilgisini backend'e gönderme

**Bağlı endpointler:**

```txt
POST /fields
PUT /fields/{fieldId}
DELETE /fields/{fieldId}?userId={userId}
```

Tarla silindiğinde backend tarafında tarlaya bağlı ürün kayıtları da temizlenir.

### 6. Ürün Yönetimi

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
DELETE /crops/{cropId}?userId={userId}
```

### 7. Takvim Görünümü

Web tarafında tarlaya ait ekim ve hasat süreci takvim görünümü ile gösterilir. Takvim bugünden başlar ve tahmini hasat tarihine kadar olan süreci gösterir.

### 8. Profil Düzenleme

Kullanıcı profil bilgilerini ayrı bir profil sayfasında düzenleyebilir.

**Bağlı endpointler:**

```txt
GET /users/{userId}
PUT /users/{userId}
```

**Davranış:**

- Ad ve e-posta güncellenebilir.
- Şifre alanı boş bırakılırsa eski şifre korunur.
- Şifre yazılırsa yeni şifre kaydedilir.
- Başka kullanıcıya ait e-posta girilirse backend hata mesajı döndürür.

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
- Profil güncelleme
- Render REST API bağlantısının çalışması
- MongoDB üzerinde webden gelen verilerin görünmesi

---

## Sonuç

Web frontend tarafında kullanıcı kayıt/giriş, dashboard, profil, tarla yönetimi, ürün yönetimi, sulama özeti, hava riski uyarısı ve takvim özellikleri geliştirilmiştir. Web frontend canlı olarak Vercel üzerinde yayınlanmaktadır.
