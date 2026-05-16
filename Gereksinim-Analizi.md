# Gereksinim Analizi

Bu dokümanda Ekinay projesinin temel fonksiyonel gereksinimleri listelenmektedir.

Ekinay, tarımsal üretim yapan kullanıcıların tarlalarını, ürünlerini, sulama planlarını, hasat dönemlerini ve hava riski bildirimlerini takip edebilmelerini sağlayan akıllı tarım destek sistemidir.

---

## Proje Bilgileri

- **Proje Adı:** Ekinay
- **Grup Adı:** TENGYAMİ
- **Öğrenci:** Ali SARISU
- **Proje Kategorisi:** Tarım / Akıllı Tarım
- **Platformlar:** Web Frontend, Mobil Uygulama, REST API
- **Veritabanı:** MongoDB Atlas

---

## Tüm Gereksinimler

1. **Kullanıcı Kaydı Oluşturma**  
   Kullanıcı ad, email ve şifre bilgileriyle sisteme kayıt olabilmelidir.

2. **Kullanıcı Girişi Yapma**  
   Kayıtlı kullanıcı email ve şifre bilgileriyle sisteme giriş yapabilmelidir.

3. **Profil Bilgisi Görüntüleme**  
   Kullanıcı kendi profil bilgilerini görüntüleyebilmelidir.

4. **Profil Güncelleme**  
   Kullanıcı ad, email veya şifre bilgisini güncelleyebilmelidir.

5. **Tarla Ekleme**  
   Kullanıcı yeni tarla ekleyebilmelidir.

6. **Tarla Güncelleme**  
   Kullanıcı daha önce eklediği tarla bilgilerini güncelleyebilmelidir.

7. **Tarla Silme**  
   Kullanıcı sisteme eklediği tarlayı silebilmelidir.

8. **Tarlaları Listeleme**  
   Kullanıcı kendisine ait tarlaları listeleyebilmelidir.

9. **Ürün Ekleme**  
   Kullanıcı bir tarlaya ürün bilgisi ekleyebilmelidir.

10. **Ürün Güncelleme**  
   Kullanıcı tarlaya bağlı ürün bilgisini güncelleyebilmelidir.

11. **Ürün Silme**  
   Kullanıcı tarlaya bağlı ürün bilgisini silebilmelidir.

12. **Ürünleri Listeleme**  
   Kullanıcı kendisine ait ürün kayıtlarını listeleyebilmelidir.

13. **Sulama Önerisi Oluşturma**  
   Sistem tarla, ürün ve hava durumu bilgilerine göre sulama önerisi oluşturabilmelidir.

14. **Hava Riski Uyarısı Oluşturma**  
   Sistem don, fırtına, yoğun yağış ve kuraklık stresi gibi riskleri kullanıcıya gösterebilmelidir.

15. **Tarla Takvimi Oluşturma**  
   Sistem ekim tarihinden tahmini hasat tarihine kadar tarla takvimi oluşturabilmelidir.

16. **Mobil Push Token Kaydı**  
   Mobil uygulama gerçek cihazdan aldığı Expo push token bilgisini backend’e kaydedebilmelidir.

17. **Test Push Bildirimi Gönderme**  
   Backend kayıtlı push token üzerinden gerçek telefona test bildirimi gönderebilmelidir.

18. **Otomatik Hava Riski Bildirimi Gönderme**  
   Sistem belirli aralıklarla hava durumunu kontrol edip risk varsa kullanıcıya bildirim gönderebilmelidir.

19. **RabbitMQ ile Asenkron Bildirim Kuyruğu Kullanma**  
   Docker ortamında hava riski bildirimleri RabbitMQ kuyruğuna alınmalı ve worker tarafından işlenmelidir.

20. **Redis ile Hava Durumu Cache Kullanma**  
   Sistem hava durumu verilerini Redis üzerinde kısa süreli cacheleyebilmelidir.

21. **Docker ile Servisleri Çalıştırma**  
   Backend, frontend, Redis, RabbitMQ ve alert-worker Docker Compose ile çalıştırılabilmelidir.

22. **Jenkins CI/CD Pipeline Kullanma**  
   Proje Jenkins pipeline ile build, Docker Compose başlatma ve health check süreçlerinden geçebilmelidir.

23. **Mobil Uygulamanın Gerçek Telefonda Çalışması**  
   Mobil uygulama gerçek Android telefonda açılıp kullanılabilmelidir.

24. **Canlı Backend ve Frontend Yayını**  
   Backend Render üzerinde, web frontend Vercel üzerinde canlı çalışmalıdır.

---

## Gereksinim Dağılımları

Proje tek kişi tarafından geliştirildiği için tüm gereksinimlerden Ali SARISU sorumludur.

1. [Ali SARISU Gereksinimleri](Ali-SARISU/Ali-SARISU-Gereksinimler.md)