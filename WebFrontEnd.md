# Web Frontend Görev Dağılımı

**Web Frontend Adresi:** [ekinay-smart-agriculture-system.vercel.app](https://ekinay-smart-agriculture-system.vercel.app)

Bu dokümanda, web uygulamasının kullanıcı arayüzü (UI) ve kullanıcı deneyimi (UX) görevleri listelenmektedir. Her grup üyesi, kendisine atanan sayfaların tasarımı, implementasyonu ve kullanıcı etkileşimlerinden sorumludur.

---

## Grup Üyelerinin Web Frontend Görevleri

1. [Ali Sarısu'nun Web Frontend Görevleri](Ali-Sarısu/Ali-Sarısu-Web-Frontend-Gorevleri.md)

---

## Genel Web Frontend Prensipleri

### 1. Basit ve Anlaşılır Arayüz
- Kullanıcı arayüzü sade ve anlaşılır olacak şekilde tasarlanmıştır
- Her işlem için ayrı input alanları ve butonlar kullanılmıştır
- Kullanıcının sistemi kolay öğrenebilmesi hedeflenmiştir

### 2. Kullanıcı Etkileşimi (User Interaction)
- Kullanıcıdan alınan veriler form inputları ile toplanır
- Butonlara basıldığında ilgili API isteği gönderilir
- Her işlem sonrası kullanıcıya sonuç mesajı gösterilir

### 3. API Entegrasyonu
- Backend ile iletişim `fetch` API kullanılarak sağlanmıştır
- Tüm istekler JSON formatında gönderilip alınmaktadır
- Frontend doğrudan canlı backend domainine bağlanmaktadır

### 4. Hata ve Sonuç Yönetimi
- Başarılı işlemler kullanıcıya mesaj olarak gösterilir
- Hatalı durumlarda kullanıcı bilgilendirilir
- Konsol üzerinden debug işlemleri yapılabilir

### 5. Modüler Yapı
- Her işlem (kayıt, giriş, tarla ekleme vb.) ayrı fonksiyonlar ile yönetilir
- JavaScript dosyası içerisinde fonksiyonel yapı kullanılmıştır
- Kod tekrarından kaçınılmıştır

### 6. Domain Üzerinde Çalışma
- Frontend uygulaması Vercel üzerinde yayınlanmıştır
- Backend servisi Render üzerinde çalışmaktadır
- Frontend ve backend farklı domainlerde çalışacak şekilde tasarlanmıştır

### 7. Gerçek Zamanlı Test Edilebilirlik
- Tüm işlemler canlı sistem üzerinden test edilebilir
- Kullanıcı arayüzü üzerinden yapılan işlemler backend’e anlık olarak iletilir
- Postman ve frontend birlikte kullanılabilir

### 8. Teknoloji Kullanımı
- HTML ile sayfa yapısı oluşturulmuştur
- CSS ile temel stil verilmiştir
- JavaScript ile dinamik işlemler gerçekleştirilmiştir
- Fetch API ile backend bağlantısı kurulmuştur

### 9. Kullanıcı Deneyimi (UX)
- İşlemler mümkün olan en az adımda tamamlanacak şekilde tasarlanmıştır
- Kullanıcı yaptığı işlemin sonucunu anında görebilmektedir
- Arayüz gereksiz karmaşıklıktan kaçınacak şekilde hazırlanmıştır