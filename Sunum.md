# Ekinay Sunum ve Kanıt Videoları

Bu dokümanda Ekinay projesi için hazırlanacak final kanıt videoları ve gösterilecek akışlar listelenmektedir.

- **Öğrenci:** Ali SARISU
- **Grup:** TENGYAMİ
- **Proje:** Ekinay
- **Canlı API:** https://ekinay-smart-agriculture-system.onrender.com
- **Canlı Web:** https://ekinay-smart-agriculture-system.vercel.app

---

## 1. Backend / REST API Kanıt Videosu

**Video Linki:**  
> Eklenecek

**Gösterilecekler:**

- Render üzerinde canlı REST API servisinin çalışması
- MongoDB Atlas bağlantısı
- Postman final test collection kullanımı
- Kullanıcı kayıt ve giriş işlemleri
- Profil güncelleme işlemi
- Tarla CRUD işlemleri
- Tarla silindiğinde bağlı ürünlerin de silinmesi
- Ürün CRUD işlemleri
- `GET /crops?userId={userId}` içinde `fieldId: null` ürün dönmediğinin gösterilmesi
- Sulama önerisi endpointi
- Hava riski uyarısı endpointi
- Otomatik alarm endpointi
- Test push endpointi

**Örnek endpointler:**

```txt
POST /auth/register
POST /auth/login
GET /users/{userId}
PUT /users/{userId}
GET /fields?userId={userId}
POST /fields
PUT /fields/{fieldId}
DELETE /fields/{fieldId}?userId={userId}
GET /crops?userId={userId}
POST /crops
PUT /crops/{cropId}
DELETE /crops/{cropId}?userId={userId}
GET /recommendations/irrigation/{fieldId}?userId={userId}
GET /recommendations/alerts/{fieldId}?userId={userId}
POST /auto-alerts/run
POST /test-push/run
```

---

## 2. Web Frontend Kanıt Videosu

**Video Linki:**  
> Eklenecek

**Gösterilecekler:**

- Vercel canlı web frontend adresinin açılması
- Kullanıcı kayıt ve giriş ekranları
- Dashboard ekranı
- Profil düzenleme sayfası
- Şifre boş bırakıldığında eski şifrenin korunması
- Tarla ekleme sayfası
- Harita üzerinden tarla alanı seçme
- Tarla kartlarının listelenmesi
- Tarla düzenleme ve silme işlemleri
- Tarla kartlarında ürün, hasat ve sulama bilgileri
- Takvim yapısı
- Web frontend ile Render REST API bağlantısının çalışması

---

## 3. Mobil Frontend Kanıt Videosu

**Video Linki:**  
> Eklenecek

**Gösterilecekler:**

- Mobil uygulamanın gerçek Android telefonda açılması
- Ekinay ikonunun ve splash ekranının görünmesi
- Development Servers ekranının çıkmaması
- Giriş ekranı
- Kayıt ekranı
- Dashboard ekranı
- Tarla kartlarının mobilde görüntülenmesi
- Google Maps haritası üzerinden yeni tarla ekleme
- Harita üzerinde en az 3 nokta seçerek tarla alanı oluşturma
- Ürün ekleme ekranında hızlı tarih seçeneklerinin kullanılması
- Hasat tarihi geçmiş ürünlerde uyarı verilmesi
- Tarla detay ekranı
- Takvim görüntüleme
- Bildirim izin ekranı
- Mobil arayüzün kullanılabilir şekilde çalışması

---

## 4. Mobil Backend / REST API Bağlantısı Kanıt Videosu

**Video Linki:**  
> Eklenecek

**Gösterilecekler:**

- Mobil uygulamanın canlı Render API ile çalışması
- Mobil login isteğinin backend'e gitmesi
- Mobilde eklenen tarlanın MongoDB'de görünmesi
- Mobil harita ekranından seçilen tarla poligon bilgisinin backend'e gönderilmesi
- Mobilde eklenen ürünün MongoDB'de görünmesi
- Mobil uygulamadan sulama önerisi alınması
- Mobil uygulamadan hava riski uyarısı alınması
- Push token bilgisinin kullanıcı kaydına yazılması
- Test bildiriminin gerçek telefona gelmesi

---

## 5. Docker Kanıt Videosu

**Video Linki:**  
> Eklenecek

**Gösterilecekler:**

- Docker Desktop'ın çalışması
- `docker compose up --build` komutu
- Backend container
- Frontend container
- Redis container
- RabbitMQ container
- Container portlarının görünmesi
- Local backend ve frontend servislerinin çalışması

---

## 6. Jenkins / CI-CD Kanıt Videosu

**Video Linki:**  
> Eklenecek

**Gösterilecekler:**

- Jenkins container'ın çalışması
- Jenkins pipeline ekranı
- GitHub repository bağlantısı
- Jenkinsfile içeriği
- Pipeline stage'leri
- Docker build/test adımlarının başarılı olması

---

## 7. RabbitMQ Kanıt Videosu

**Video Linki:**  
> Eklenecek

**Gösterilecekler:**

- RabbitMQ management paneli
- Queue bilgisinin görünmesi
- `POST /rabbit-test/push` isteği
- Mesajın kuyruğa gönderilmesi
- Worker logunda mesajın işlendiğinin görünmesi
- Bildirim gönderim akışı

---

## 8. Redis Kanıt Videosu

**Video Linki:**  
> Eklenecek

**Gösterilecekler:**

- Redis container'ın çalışması
- İlk istekte cache MISS / SET akışı
- İkinci istekte cache HIT akışı
- Redis bağlantısı yoksa fallback davranışının loglarda görünmesi

---

## 9. İkinci Android Cihaz / Hedef Kullanıcı Test Videosu

**Video Linki:**  
> Eklenecek

Bu video, uygulamanın yalnızca geliştiricinin telefonunda değil, başka bir Android cihazda da çalıştığını göstermek için kullanılacaktır.

**Gösterilecekler:**

- APK'nın ikinci Android cihaza kurulması
- Ekinay ikonunun görünmesi
- Yeni kullanıcı kaydı
- Giriş işlemi
- Harita üzerinden en az 3 nokta ile tarla ekleme
- Ürün ekleme
- Hasada 30 Gün hızlı tarih butonu
- Tarla detayında takvim görünümü

---

## Sonuç

Bu kanıt videoları birlikte Ekinay projesinin web, mobil, backend, veritabanı, bildirim, Docker, Jenkins, RabbitMQ ve Redis taraflarının çalıştığını göstermeyi amaçlar.
