# Ali Sarısu Gereksinimleri

Bu dokümanda Ekinay projesinde Ali Sarısu tarafından geliştirilen fonksiyonel gereksinimler listelenmektedir.

Proje tek kişi tarafından geliştirildiği için tüm gereksinimler Ali Sarısu sorumluluğundadır.

---

## 1. Kullanıcı Kaydı Oluşturma

**API Metodu:**  
`POST /auth/register`

**Açıklama:**  
Yeni kullanıcıların ad, email ve şifre bilgileri ile sisteme kayıt olmasını sağlar.

**Kabul Kriterleri:**

- Kullanıcı ad, email ve şifre girebilmelidir.
- Email daha önce kayıtlıysa sistem hata vermelidir.
- Başarılı kayıt sonrası kullanıcı MongoDB üzerinde oluşmalıdır.

---

## 2. Kullanıcı Girişi Yapma

**API Metodu:**  
`POST /auth/login`

**Açıklama:**  
Kayıtlı kullanıcıların email ve şifre ile sisteme giriş yapmasını sağlar.

**Kabul Kriterleri:**

- Kullanıcı doğru email ve şifre ile giriş yapabilmelidir.
- Hatalı bilgilerde kullanıcıya hata mesajı dönmelidir.
- Başarılı giriş sonrası kullanıcı dashboard ekranına yönlendirilmelidir.

---

## 3. Profil Bilgisi Görüntüleme

**API Metodu:**  
`GET /users/{userId}`

**Açıklama:**  
Kullanıcının kendi profil bilgilerini görüntülemesini sağlar.

**Kabul Kriterleri:**

- Kullanıcı kendi ad ve email bilgisini görebilmelidir.
- Geçersiz kullanıcı ID durumunda hata mesajı dönmelidir.

---

## 4. Profil Güncelleme

**API Metodu:**  
`PUT /users/{userId}`

**Açıklama:**  
Kullanıcının ad, email veya şifre bilgisini güncellemesini sağlar.

**Kabul Kriterleri:**

- Kullanıcı profil bilgilerini güncelleyebilmelidir.
- Güncelleme sonrası MongoDB kaydı değişmelidir.
- İşlem sonucu kullanıcıya gösterilmelidir.

---

## 5. Tarla Ekleme

**API Metodu:**  
`POST /fields`

**Açıklama:**  
Kullanıcının sahip olduğu tarlayı konum, koordinat, alan ve sera/açık alan bilgileri ile sisteme eklemesini sağlar.

**Kabul Kriterleri:**

- Tarla adı girilebilmelidir.
- Konum bilgisi girilebilmelidir.
- Enlem ve boylam bilgisi alınmalıdır.
- Harita üzerinden seçilen poligon bilgisi kaydedilebilmelidir.
- Tarla MongoDB üzerinde kullanıcıya bağlı olarak oluşmalıdır.

---

## 6. Tarla Güncelleme

**API Metodu:**  
`PUT /fields/{fieldId}`

**Açıklama:**  
Kullanıcının mevcut tarla bilgilerini değiştirmesini sağlar.

**Kabul Kriterleri:**

- Kullanıcı kendi tarlasını güncelleyebilmelidir.
- Tarla adı, konum, koordinat, alan ve sera bilgileri değiştirilebilmelidir.
- Güncel veriler dashboard ve detay ekranlarında gösterilmelidir.

---

## 7. Tarla Silme

**API Metodu:**  
`DELETE /fields/{fieldId}`

**Açıklama:**  
Kullanıcının sisteme eklediği tarlayı silmesini sağlar.

**Kabul Kriterleri:**

- Kullanıcı kendi tarlasını silebilmelidir.
- Silinen tarla dashboard ekranından kaldırılmalıdır.
- Silme işlemi MongoDB üzerinde gerçekleşmelidir.

---

## 8. Tarlaları Listeleme

**API Metodu:**  
`GET /fields?userId={userId}`

**Açıklama:**  
Kullanıcının sahip olduğu tüm tarlaları görüntülemesini sağlar.

**Kabul Kriterleri:**

- Sadece giriş yapan kullanıcıya ait tarlalar listelenmelidir.
- Tarla kartlarında gerekli özet bilgiler gösterilmelidir.
- Web ve mobil dashboard ekranları bu veriyi kullanmalıdır.

---

## 9. Ürün Ekleme

**API Metodu:**  
`POST /crops`

**Açıklama:**  
Kullanıcının bir tarlaya ürün ve ekim tarihi bilgisi eklemesini sağlar.

**Kabul Kriterleri:**

- Ürün tarlaya bağlı olmalıdır.
- Ürün adı izin verilen ürünlerden biri olmalıdır.
- Ekim tarihi kaydedilmelidir.
- Aynı tarlaya aynı anda birden fazla aktif ürün eklenmemelidir.

---

## 10. Ürün Güncelleme

**API Metodu:**  
`PUT /crops/{cropId}`

**Açıklama:**  
Kullanıcının ürün adını, bağlı tarla bilgisini veya ekim tarihini güncellemesini sağlar.

**Kabul Kriterleri:**

- Kullanıcı ürün bilgisini güncelleyebilmelidir.
- Güncel ürün bilgisi tarla kartına ve detay ekranına yansımalıdır.

---

## 11. Ürün Silme

**API Metodu:**  
`DELETE /crops/{cropId}`

**Açıklama:**  
Kullanıcının eklediği ürünü silmesini sağlar.

**Kabul Kriterleri:**

- Kullanıcı ürün bilgisini silebilmelidir.
- Silinen ürün dashboard ve tarla detayından kaldırılmalıdır.

---

## 12. Ürünleri Listeleme

**API Metodu:**  
`GET /crops?userId={userId}`

**Açıklama:**  
Kullanıcının ürün kayıtlarını listelemesini sağlar.

**Kabul Kriterleri:**

- Kullanıcıya ait ürünler listelenmelidir.
- Ürünler bağlı oldukları tarlalar ile ilişkilendirilmelidir.

---

## 13. Sulama Önerisi Oluşturma

**API Metodu:**  
`GET /recommendations/irrigation/{fieldId}`

**Açıklama:**  
Sistem ürün bilgisi, ekim tarihi, üretim aşaması ve hava durumu verilerini değerlendirerek sulama önerisi üretir.

**Kabul Kriterleri:**

- Tarla için ürün bilgisi varsa sulama önerisi üretilebilmelidir.
- Kullanıcıya bugünün sulama özeti gösterilmelidir.
- Öneri anlaşılır metin halinde sunulmalıdır.

---

## 14. Hava Riski Uyarısı Oluşturma

**API Metodu:**  
`GET /recommendations/alerts/{fieldId}`

**Açıklama:**  
Don, fırtına, yoğun yağış ve sıcaklık stresi gibi riskli durumlarda kullanıcıya uyarı verir.

**Kabul Kriterleri:**

- Tarla konumuna göre hava verisi alınmalıdır.
- Risk varsa kullanıcıya açıklayıcı uyarı gösterilmelidir.
- Risk yoksa kullanıcıya uygun mesaj dönmelidir.

---

## 15. Tarla Takvimi Oluşturma

**İlgili Alan:**  
Web ve mobil tarla detay ekranı

**Açıklama:**  
Sistem tarlanın bugünden tahmini hasat tarihine kadar olan sürecini takvim şeklinde gösterir.

**Kabul Kriterleri:**

- Takvim bugünden başlamalıdır.
- Geçmiş günler gereksiz yer kaplamamalıdır.
- Tahmini hasat tarihine kadar olan günler gösterilmelidir.
- Mobilde telefon takvimine aktarma ve kayıtları silme desteklenmelidir.

---

## 16. Mobil Push Token Kaydı

**API Metodu:**  
`PUT /users/{userId}/push-token`

**Açıklama:**  
Mobil uygulama gerçek cihazdan aldığı Expo push token bilgisini backend’e gönderir.

**Kabul Kriterleri:**

- Kullanıcıdan bildirim izni alınmalıdır.
- Expo push token MongoDB kullanıcı kaydına yazılmalıdır.
- Kullanıcı kaydında `expoPushToken` ve `pushAlertsEnabled` alanları bulunmalıdır.

---

## 17. Test Push Bildirimi Gönderme

**API Metodu:**  
`POST /test-push/run`

**Açıklama:**  
Backend kayıtlı push token üzerinden gerçek telefona test bildirimi gönderir.

**Kabul Kriterleri:**

- Push token kayıtlı kullanıcı bulunmalıdır.
- Expo Push servisine istek gönderilmelidir.
- Bildirim gerçek Android telefona ulaşmalıdır.

---

## 18. Otomatik Hava Riski Bildirimi Gönderme

**API Metodu:**  
`POST /auto-alerts/run`

**Açıklama:**  
Sistem hava durumunu kontrol ederek riskli durumlarda kullanıcıya otomatik bildirim gönderir.

**Kabul Kriterleri:**

- Kullanıcının tarlaları ve ürünleri kontrol edilmelidir.
- Yaklaşık 30 dakikalık hava riski penceresi incelenmelidir.
- Aynı risk için tekrar tekrar bildirim gönderilmemelidir.
- Risk oluşursa kullanıcıya bildirim gönderilmelidir.

---

## 19. RabbitMQ ile Bildirim Kuyruğu Kullanma

**İlgili Teknoloji:**  
RabbitMQ

**Açıklama:**  
Docker ortamında bildirimler RabbitMQ kuyruğuna alınır ve alert-worker tarafından işlenir.

**Kabul Kriterleri:**

- Backend producer olarak kuyruğa mesaj göndermelidir.
- Alert worker consumer olarak kuyruğu dinlemelidir.
- Mesaj işlendiğinde telefona push bildirim gitmelidir.
- RabbitMQ panelinde kuyruk görülebilmelidir.

---

## 20. Redis ile Hava Verisi Cache Kullanma

**İlgili Teknoloji:**  
Redis

**Açıklama:**  
Sistem hava durumu verilerini Redis üzerinde kısa süreli cacheleyerek gereksiz API çağrılarını azaltır.

**Kabul Kriterleri:**

- İlk istekte cache MISS oluşmalıdır.
- Veri Redis’e SET edilmelidir.
- İkinci istekte cache HIT görülmelidir.
- Redis yoksa sistem çalışmaya devam etmelidir.

---

## 21. Docker ile Servisleri Çalıştırma

**İlgili Teknoloji:**  
Docker Compose

**Açıklama:**  
Backend, frontend, Redis, RabbitMQ ve alert-worker servisleri Docker Compose ile birlikte çalıştırılmalıdır.

**Kabul Kriterleri:**

- `docker compose up --build` ile servisler ayağa kalkmalıdır.
- Backend `localhost:3000` üzerinde çalışmalıdır.
- Frontend `localhost:8080` üzerinde çalışmalıdır.
- RabbitMQ paneli `localhost:15672` üzerinde açılmalıdır.
- Redis container çalışmalıdır.

---

## 22. Jenkins CI/CD Pipeline Kullanma

**İlgili Teknoloji:**  
Jenkins

**Açıklama:**  
Proje Jenkins pipeline ile otomatik build ve health check süreçlerinden geçmelidir.

**Kabul Kriterleri:**

- Jenkins GitHub reposundan kodu çekmelidir.
- Docker image build işlemi yapılmalıdır.
- Docker Compose ile servisler başlatılmalıdır.
- Backend health check başarılı olmalıdır.
- Frontend health check başarılı olmalıdır.
- Pipeline `Finished: SUCCESS` sonucu vermelidir.

---

## 23. Mobil Uygulamanın Gerçek Telefonda Çalışması

**İlgili Platform:**  
Android telefon

**Açıklama:**  
Mobil uygulama gerçek Android telefonda kurulup çalışmalıdır.

**Kabul Kriterleri:**

- Uygulama telefonda açılmalıdır.
- Kullanıcı giriş yapabilmelidir.
- Dashboard görüntülenmelidir.
- Tarla bilgileri gösterilmelidir.
- Push bildirim alınabilmelidir.

---

## 24. Canlı Backend ve Frontend Yayını

**İlgili Platformlar:**  
Render ve Vercel

**Açıklama:**  
Backend ve frontend canlı ortamda erişilebilir olmalıdır.

**Kabul Kriterleri:**

- Render backend canlı çalışmalıdır.
- Vercel frontend canlı çalışmalıdır.
- Frontend canlı backend’e istek gönderebilmelidir.