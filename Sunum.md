
---

# 2) `Sunum.md` dosyasını komple değiştir

`Sunum.md` içeriğini tamamen sil, bunu yapıştır:

```markdown
# Video Sunum ve Kanıt Videoları

Bu dosyada Ekinay projesinin final teslimi için hazırlanacak kanıt videoları listelenmektedir.

Proje tek kişi tarafından geliştirilmiştir.

- **Grup Adı:** TENGYAMİ
- **Öğrenci:** Ali Sarısu
- **Proje Adı:** Ekinay
- **Proje Kategorisi:** Tarım / Akıllı Tarım

---

## 1. Backend Kanıt Videosu

**Video Linki:**  
> Eklenecek

**Gösterilecekler:**

- Render üzerinde canlı REST API servisinin çalışması
- MongoDB Atlas bağlantısı
- Postman ile temel endpoint testleri
- Kullanıcı kayıt ve giriş işlemleri
- Tarla CRUD işlemleri
- Ürün CRUD işlemleri
- Sulama önerisi endpointi
- Hava riski uyarısı endpointi
- Otomatik alarm endpointi
- MongoDB üzerinde kayıtların oluşması

**Örnek endpointler:**

```txt
POST /auth/register
POST /auth/login
GET /fields
POST /fields
PUT /fields/{fieldId}
DELETE /fields/{fieldId}
POST /crops
GET /recommendations/irrigation/{fieldId}
GET /recommendations/alerts/{fieldId}
POST /auto-alerts/run