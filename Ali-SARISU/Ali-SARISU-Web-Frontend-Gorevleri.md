# Ali SARISU Web Frontend Görevleri

Bu dosyada Ekinay web frontend tarafında geliştirilen ekranlar ve görevler açıklanmaktadır.

- **Öğrenci:** Ali SARISU
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

---

## 2. Kullanıcı Kayıt Arayüzü

```txt
POST /auth/register
```

**Yapılan işler:**

- Ad, email ve şifre alanları eklendi.
- Formdan alınan bilgiler JSON formatında backend'e gönderildi.
- Başarı ve hata mesajları gösterildi.

---

## 3. Kullanıcı Giriş Arayüzü

```txt
POST /auth/login
```

**Yapılan işler:**

- Email ve şifre alanları eklendi.
- Backend'e login isteği gönderildi.
- Başarılı girişte kullanıcı dashboard ekranına yönlendirildi.

---

## 4. Dashboard Arayüzü

**API Endpointleri:**

```txt
GET /fields?userId={userId}
GET /crops?userId={userId}
GET /recommendations/irrigation/{fieldId}?userId={userId}
GET /recommendations/alerts/{fieldId}?userId={userId}
```

**Yapılan işler:**

- Kullanıcının tarlaları listelendi.
- Tarla kartlarında ürün, sulama, hasat ve hava riski bilgileri gösterildi.
- Kullanıcıya ait verilerin kullanıcı ID ile çekilmesi sağlandı.

---

## 5. Tarla Ekleme Arayüzü

```txt
POST /fields
```

**Yapılan işler:**

- Tarla adı ve konum alanları eklendi.
- Harita üzerinden alan seçme akışı eklendi.
- Poligon bilgisi backend'e gönderildi.
- Sera/açık alan seçimi eklendi.

---

## 6. Tarla Güncelleme ve Silme

```txt
PUT /fields/{fieldId}
DELETE /fields/{fieldId}?userId={userId}
```

**Yapılan işler:**

- Tarla bilgilerini güncelleme akışı oluşturuldu.
- Tarla silme işlemi eklendi.
- Tarla silindiğinde backend tarafında bağlı ürünlerin de temizlendiği doğrulandı.

---

## 7. Ürün Yönetimi Arayüzü

```txt
GET /crops?userId={userId}
POST /crops
PUT /crops/{cropId}
DELETE /crops/{cropId}?userId={userId}
```

**Yapılan işler:**

- Tarlaya ürün ekleme ekranı hazırlandı.
- Ürün güncelleme ve silme işlemleri eklendi.
- Domates, biber, salatalık ve fasulye ürünleri desteklendi.

---

## 8. Takvim ve Öneri Görünümü

**Yapılan işler:**

- Backend'den sulama önerisi alındı.
- Backend'den hava riski uyarısı alındı.
- Tarla takvimi gösterildi.
- Endpointlere `userId` query parametresi eklendi.

---

## 9. Profil Düzenleme Arayüzü

```txt
GET /users/{userId}
PUT /users/{userId}
```

**Yapılan işler:**

- Kullanıcı profil bilgilerini görüntüleme ekranı hazırlandı.
- Ad ve email güncelleme desteklendi.
- Şifre alanı boş bırakılırsa backend'e gönderilmez; mevcut şifre korunur.
- Şifre yazılırsa şifre güncellenir.
- Başka kullanıcıya ait email kullanımında backend hata mesajı gösterilir.

---

## 10. Web Kanıt Videosunda Gösterilecekler

- Canlı Vercel adresi
- Kayıt ve giriş
- Dashboard
- Harita üzerinden tarla ekleme
- Ürün ekleme
- Sulama ve hava uyarısı görüntüleme
- Takvim görüntüleme
- Profil güncelleme
- Tarla ve ürün silme
- MongoDB Atlas üzerinde verilerin görünmesi

---

## Sonuç

Web frontend tarafında Ekinay'ın kullanıcı kayıt/giriş, dashboard, profil, tarla, ürün, takvim, sulama ve hava uyarısı ekranları geliştirilmiştir. Frontend canlı Render REST API servisiyle entegre çalışmaktadır.
