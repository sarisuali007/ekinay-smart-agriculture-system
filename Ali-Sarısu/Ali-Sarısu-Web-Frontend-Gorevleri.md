# Ali Sarısu'nın Web Frontend Görevleri

**Frontend Domain Adresi:**  
https://ekinay-smart-agriculture-system.vercel.app

**Front-end Test Videosu:** 
[Link buraya eklenecek](https://example.com)

## 1. Kullanıcı Kaydı Oluşturma Sayfası
- **API Endpoint:** `POST /auth/register`
- **Görev:** Kullanıcının ad, email ve şifre bilgileri ile sisteme kayıt olmasını sağlayan web arayüzünü tasarlamak ve geliştirmek
- **UI Bileşenleri:**
  - Ad input alanı
  - Email input alanı
  - Şifre input alanı
  - "Kayıt Ol" butonu
  - Başarı ve hata mesaj alanı
  - Form bölümü için başlık ve açıklama alanı
- **Form Validasyonu:**
  - Tüm alanlar boş bırakılamaz
  - Email alanı email formatında olmalıdır
  - Şifre alanı boş bırakılamaz
  - İstek gönderilmeden önce alanlar kontrol edilir
- **Kullanıcı Deneyimi:**
  - Kullanıcı bilgileri girildikten sonra kayıt isteği backend'e gönderilir
  - İşlem başarılı olursa kullanıcıya başarı mesajı gösterilir
  - İşlem başarısız olursa hata mesajı gösterilir
- **Teknik Detaylar:**
  - HTML, CSS ve JavaScript kullanılmıştır
  - `fetch` API ile backend'e POST isteği gönderilmiştir
  - API domain adresi ile canlı bağlantı kurulmuştur

## 2. Kullanıcı Girişi Yapma Sayfası
- **API Endpoint:** `POST /auth/login`
- **Görev:** Kullanıcının email ve şifre bilgileri ile sisteme giriş yapmasını sağlayan arayüzü geliştirmek
- **UI Bileşenleri:**
  - Email input alanı
  - Şifre input alanı
  - "Giriş Yap" butonu
  - Başarı ve hata mesaj alanı
- **Form Validasyonu:**
  - Email alanı boş bırakılamaz
  - Şifre alanı boş bırakılamaz
  - Email formatı kontrol edilir
- **Kullanıcı Deneyimi:**
  - Kullanıcı giriş bilgilerini girerek sisteme giriş yapabilir
  - Başarılı girişte kullanıcıya mesaj gösterilir
  - Hata durumunda kullanıcı bilgilendirilir
- **Teknik Detaylar:**
  - `fetch` API ile backend'e POST isteği gönderilir
  - JSON formatında veri gönderilir ve cevap alınır

## 3. Profil Güncelleme Sayfası
- **API Endpoint:** `PUT /users/{userId}`
- **Görev:** Kullanıcının kendi profil bilgilerini güncellemesini sağlayan form arayüzünü geliştirmek
- **UI Bileşenleri:**
  - Kullanıcı ID input alanı
  - Yeni ad input alanı
  - Yeni email input alanı
  - Yeni şifre input alanı
  - "Profili Güncelle" butonu
  - Mesaj gösterim alanı
- **Form Validasyonu:**
  - Kullanıcı ID boş bırakılamaz
  - Email alanı geçerli formatta olmalıdır
  - Güncellenecek alanlar kontrol edilir
- **Kullanıcı Deneyimi:**
  - Kullanıcı mevcut bilgilerini değiştirip güncelleme isteği gönderebilir
  - Başarılı işlem sonrası kullanıcıya bilgi verilir
  - Hata durumlarında anlaşılır mesaj gösterilir
- **Teknik Detaylar:**
  - Dinamik `userId` değeri ile PUT isteği gönderilir
  - Formdan alınan veriler JSON formatında backend'e iletilir

## 4. Tarla Ekleme Sayfası
- **API Endpoint:** `POST /fields`
- **Görev:** Kullanıcının yeni bir tarla eklemesini sağlayan web arayüzünü geliştirmek
- **UI Bileşenleri:**
  - Tarla adı input alanı
  - Konum input alanı
  - "Ekle" butonu
  - Sonuç mesaj alanı
- **Form Validasyonu:**
  - Tarla adı boş bırakılamaz
  - Konum bilgisi boş bırakılamaz
- **Kullanıcı Deneyimi:**
  - Kullanıcı tarla bilgilerini girerek sisteme yeni tarla ekleyebilir
  - Başarılı işlem sonrası kullanıcıya bilgi verilir
- **Teknik Detaylar:**
  - POST isteği ile backend'e tarla verisi gönderilir
  - `fetch` API kullanılmıştır

## 5. Tarla Güncelleme Sayfası
- **API Endpoint:** `PUT /fields/{fieldId}`
- **Görev:** Kullanıcının mevcut tarla bilgisini güncellemesini sağlayan arayüzü geliştirmek
- **UI Bileşenleri:**
  - Tarla ID input alanı
  - Yeni tarla adı input alanı
  - Yeni konum input alanı
  - "Tarlayı Güncelle" butonu
  - Mesaj alanı
- **Form Validasyonu:**
  - Tarla ID zorunludur
  - Güncellenecek bilgiler kontrol edilir
- **Kullanıcı Deneyimi:**
  - Kullanıcı tarla kimliğini girerek ilgili kaydı güncelleyebilir
  - Güncelleme sonrası başarı mesajı gösterilir
- **Teknik Detaylar:**
  - Dinamik `fieldId` ile PUT isteği gönderilir
  - JSON body kullanılır

## 6. Tarla Silme Sayfası
- **API Endpoint:** `DELETE /fields/{fieldId}`
- **Görev:** Kullanıcının seçtiği tarlayı silmesini sağlayan arayüzü geliştirmek
- **UI Bileşenleri:**
  - Tarla ID input alanı
  - "Tarlayı Sil" butonu
  - Sonuç mesajı alanı
- **Kullanıcı Deneyimi:**
  - Kullanıcı ID girerek ilgili tarlayı silebilir
  - İşlem sonucunda kullanıcıya bilgi mesajı gösterilir
- **Teknik Detaylar:**
  - Dinamik `fieldId` ile DELETE isteği gönderilir
  - Başarılı cevap kullanıcıya yansıtılır

## 7. Tarlaları Listeleme Sayfası
- **API Endpoint:** `GET /fields`
- **Görev:** Sistemde kayıtlı tarlaları kullanıcıya liste halinde göstermek
- **UI Bileşenleri:**
  - "Listele" butonu
  - Liste gösterim alanı (`ul` ve `li`)
- **Kullanıcı Deneyimi:**
  - Kullanıcı butona bastığında mevcut tarlalar ekranda listelenir
  - Liste okunabilir ve sade bir biçimde gösterilir
- **Teknik Detaylar:**
  - GET isteği ile backend'den veri alınır
  - Gelen dizi JavaScript ile DOM üzerine yazdırılır

## 8. Ürün Ekleme Sayfası
- **API Endpoint:** `POST /crops`
- **Görev:** Kullanıcının bir tarlaya yeni ürün eklemesini sağlayan arayüzü geliştirmek
- **UI Bileşenleri:**
  - Ürün adı input alanı
  - Tarla ID input alanı
  - "Ekle" butonu
  - Sonuç mesaj alanı
- **Form Validasyonu:**
  - Ürün adı boş bırakılamaz
  - Tarla ID boş bırakılamaz
- **Kullanıcı Deneyimi:**
  - Kullanıcı ürün bilgilerini girerek kayıt oluşturabilir
  - Başarılı işlem sonrası mesaj gösterilir
- **Teknik Detaylar:**
  - POST isteği ile JSON veri backend'e gönderilir

## 9. Ürün Güncelleme Sayfası
- **API Endpoint:** `PUT /crops/{cropId}`
- **Görev:** Kullanıcının ürün bilgisini güncellemesini sağlayan arayüzü geliştirmek
- **UI Bileşenleri:**
  - Ürün ID input alanı
  - Yeni ürün adı input alanı
  - Tarla ID input alanı
  - "Ürünü Güncelle" butonu
  - Sonuç mesajı alanı
- **Form Validasyonu:**
  - Ürün ID zorunludur
  - Güncellenecek bilgiler boş bırakılmamalıdır
- **Kullanıcı Deneyimi:**
  - Kullanıcı ürün kimliği ile mevcut ürünü güncelleyebilir
  - Başarılı güncelleme sonrası mesaj gösterilir
- **Teknik Detaylar:**
  - Dinamik `cropId` ile PUT isteği gönderilir
  - JSON body backend'e iletilir

## 10. Ürün Silme Sayfası
- **API Endpoint:** `DELETE /crops/{cropId}`
- **Görev:** Kullanıcının seçilen ürün kaydını silmesini sağlayan arayüzü geliştirmek
- **UI Bileşenleri:**
  - Ürün ID input alanı
  - "Ürünü Sil" butonu
  - Sonuç mesaj alanı
- **Kullanıcı Deneyimi:**
  - Kullanıcı ürün kimliğini girerek silme işlemi yapabilir
  - Sonuç ekranda kullanıcıya gösterilir
- **Teknik Detaylar:**
  - Dinamik `cropId` ile DELETE isteği gönderilir

## 11. Sulama Önerisi Görüntüleme Sayfası
- **API Endpoint:** `GET /recommendations/irrigation/{fieldId}`
- **Görev:** Kullanıcının seçilen tarla için sulama önerisi almasını sağlayan arayüzü geliştirmek
- **UI Bileşenleri:**
  - Tarla ID input alanı
  - "Öneri Al" butonu
  - Sonuç mesaj alanı
- **Kullanıcı Deneyimi:**
  - Kullanıcı tarla ID girerek sulama önerisi alabilir
  - Backend'den gelen sonuç kullanıcıya gösterilir
- **Teknik Detaylar:**
  - Dinamik `fieldId` ile GET isteği gönderilir

## 12. Hava Riski Uyarısı Görüntüleme Sayfası
- **API Endpoint:** `GET /recommendations/alerts/{fieldId}`
- **Görev:** Kullanıcının seçilen tarla için hava riski uyarısı almasını sağlayan arayüzü geliştirmek
- **UI Bileşenleri:**
  - Tarla ID input alanı
  - "Uyarı Al" butonu
  - Sonuç mesaj alanı
- **Kullanıcı Deneyimi:**
  - Kullanıcı tarla ID girerek hava durumu uyarısını alabilir
  - Gelen sonuç mesajı kullanıcıya gösterilir
- **Teknik Detaylar:**
  - Dinamik `fieldId` ile GET isteği gönderilir

## Kullanılan Teknolojiler
- HTML
- CSS
- JavaScript
- Fetch API
- Vercel üzerinde yayınlanan canlı frontend
