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
- Kullanıcı profil işlemleri
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
POST /auto-alerts/run
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
- Tarla ekleme sayfası
- Harita üzerinden tarla konumu seçme
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
- Giriş ekranı
- Kayıt ekranı
- Dashboard ekranı
- Tarla kartlarının mobilde görüntülenmesi
- Tarla detay ekranı
- Takvim görüntüleme
- Bildirim izin ekranı
- Mobil arayüzün kullanılabilir şekilde çalışması

---

## 4. Mobil Backend / REST API Bağlantısı Kanıt Videosu

**Video Linki:**  
> Eklenecek

**Gösterilecekler:**

- Mobil uygulamadan giriş isteğinin REST API’ye gitmesi
- Mobil uygulamadan tarla verilerinin REST API üzerinden çekilmesi
- Mobil uygulamadan tarla ekleme veya güncelleme işlemi
- MongoDB Atlas üzerinde mobil uygulamadan gelen verinin oluşması
- Mobil uygulamada backend verilerinin güncellenmesi
- Mobil uygulamada Expo push token kaydının oluşması
- MongoDB kullanıcı kaydında `expoPushToken` ve `pushAlertsEnabled` alanlarının görüntülenmesi

---

## 5. RabbitMQ / Kafka Kanıt Videosu

**Video Linki:**  
> Eklenecek

**Kullanılan Teknoloji:** RabbitMQ

**Gösterilecekler:**

- Docker Compose ile RabbitMQ containerının çalışması
- RabbitMQ Management Panelinin açılması
- Backend’in producer olarak RabbitMQ kuyruğuna mesaj göndermesi
- `ekinay.alert.notifications` kuyruğunun görüntülenmesi
- Alert worker’ın consumer olarak kuyruğu dinlemesi
- Worker’ın mesajı alıp Expo push bildirimi göndermesi
- Telefona RabbitMQ test bildiriminin gelmesi

**Test endpointi:**

```txt
POST /rabbit-test/push
```

---

## 6. Redis / Memcached Kanıt Videosu

**Video Linki:**  
> Eklenecek

**Kullanılan Teknoloji:** Redis

**Gösterilecekler:**

- Docker Compose ile Redis containerının çalışması
- Backend’in Redis’e bağlanması
- İlk `auto-alerts` isteğinde hava verisi için cache MISS alınması
- Hava verisinin Redis’e SET edilmesi
- Aynı istek tekrarlandığında cache HIT alınması
- Hava durumu verilerinin gereksiz tekrar isteklerden korunması

**Test endpointi:**

```txt
POST /auto-alerts/run
```

---

## 7. Docker + CI/CD Kanıt Videosu

**Video Linki:**  
> Eklenecek

**Kullanılan Teknolojiler:**

- Docker
- Docker Compose
- Jenkins
- Jenkinsfile

**Gösterilecekler:**

- `backend/Dockerfile` dosyası
- `frontend/Dockerfile` dosyası
- `docker-compose.yml` dosyası
- `Jenkinsfile` dosyası
- Jenkins pipeline ekranı
- GitHub reposundan kod çekilmesi
- Docker image build aşaması
- Docker Compose ile servislerin ayağa kaldırılması
- Backend health check
- Frontend health check
- Redis container kontrolü
- RabbitMQ container kontrolü
- Alert worker container kontrolü
- Pipeline sonunda `Finished: SUCCESS` sonucu

---

## 8. Cep Telefonu / Final Demo Kanıt Videosu

**Video Linki:**  
> Eklenecek

**Gösterilecekler:**

- Uygulamanın gerçek Android telefona kurulmuş olması
- Uygulamanın telefonda açılması
- Kullanıcı girişi yapılması
- Dashboard ekranının açılması
- Tarla kartlarının görüntülenmesi
- Tarla detay ekranının görüntülenmesi
- Takvim ekranının görüntülenmesi
- Push bildirim izninin gösterilmesi
- Test veya gerçek hava alarmı bildiriminin telefona gelmesi
- Bildirime basıldığında uygulamanın ilgili ekrana yönlenmesi
- Uygulamanın gerçek cihazda kullanılabilir olduğunun gösterilmesi

---

## Final Video Kontrol Listesi

- [ ] Backend kanıt videosu çekildi
- [ ] Web frontend kanıt videosu çekildi
- [ ] Mobil frontend kanıt videosu çekildi
- [ ] Mobil backend / REST API bağlantısı videosu çekildi
- [ ] RabbitMQ kanıt videosu çekildi
- [ ] Redis kanıt videosu çekildi
- [ ] Docker + CI/CD kanıt videosu çekildi
- [ ] Cep telefonu / final demo videosu çekildi
- [ ] Video linkleri bu dosyaya eklendi
- [ ] GitHub üzerinde linklerin açıldığı kontrol edildi

---

## Sunumda Kullanılacak Kısa Açıklama

Merhaba, ben Ali Sarısu. TENGYAMİ grubu adına Ekinay projesini geliştirdim. Ekinay, tarımsal üretim yapan kullanıcıların tarlalarını, ürünlerini, sulama planlarını, hasat dönemlerini ve hava riski uyarılarını takip edebilmelerini sağlayan akıllı tarım destek sistemidir.

Projede web frontend, mobil uygulama, REST API, MongoDB Atlas, Redis cache, RabbitMQ bildirim kuyruğu, Docker Compose ve Jenkins CI/CD pipeline kullanılmıştır. Uygulama gerçek Android telefonda test edilmiş ve push bildirim sistemi çalıştırılmıştır.