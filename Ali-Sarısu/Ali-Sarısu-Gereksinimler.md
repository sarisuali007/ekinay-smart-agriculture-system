1. **Kullanıcı Kaydı Oluşturma**
   - **API Metodu:** `POST /auth/register`
   - **Açıklama:** Yeni kullanıcıların ad, e-posta ve şifre bilgileri ile sisteme kayıt olmasını sağlar.

2. **Kullanıcı Girişi Yapma**
   - **API Metodu:** `POST /auth/login`
   - **Açıklama:** Kayıtlı kullanıcıların e-posta ve şifre ile sisteme giriş yapmasını sağlar.

3. **Profil Güncelleme**
   - **API Metodu:** `PUT /users/{userId}`
   - **Açıklama:** Kullanıcının kendi profil bilgilerini değiştirmesini sağlar.

4. **Tarla Ekleme**
   - **API Metodu:** `POST /fields`
   - **Açıklama:** Kullanıcının sahip olduğu tarlayı konum ve tür bilgisi ile sisteme eklemesini sağlar.

5. **Tarla Güncelleme**
   - **API Metodu:** `PUT /fields/{fieldId}`
   - **Açıklama:** Kullanıcının mevcut tarla bilgilerini değiştirmesini sağlar.

6. **Tarla Silme**
   - **API Metodu:** `DELETE /fields/{fieldId}`
   - **Açıklama:** Kullanıcının sisteme eklediği tarlayı silmesini sağlar.

7. **Tarlaları Listeleme**
   - **API Metodu:** `GET /fields`
   - **Açıklama:** Kullanıcının sahip olduğu tüm tarlaları görüntülemesini sağlar.

8. **Ürün Ekleme**
   - **API Metodu:** `POST /crops`
   - **Açıklama:** Kullanıcının bir tarlaya ürün ve ekim tarihi bilgisi eklemesini sağlar.

9. **Ürün Güncelleme**
   - **API Metodu:** `PUT /crops/{cropId}`
   - **Açıklama:** Kullanıcının ürün bilgilerini değiştirmesini sağlar.

10. **Ürün Silme**
   - **API Metodu:** `DELETE /crops/{cropId}`
   - **Açıklama:** Kullanıcının eklediği ürünü silmesini sağlar.

11. **Sulama Önerisi Oluşturma**
   - **API Metodu:** `GET /irrigation/{fieldId}`
   - **Açıklama:** Sistem ürün bilgisi ve hava durumu verilerini değerlendirerek sulama önerisi üretir.

12. **Hava Riski Uyarısı Oluşturma**
   - **API Metodu:** `GET /alerts/{fieldId}`
   - **Açıklama:** Don, fırtına veya aşırı sıcaklık gibi riskli durumlarda kullanıcıya uyarı verir.