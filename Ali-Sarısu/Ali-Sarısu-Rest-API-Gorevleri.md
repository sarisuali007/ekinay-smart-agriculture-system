# Ali Sarısu'nın REST API Metotları

**API Domain Adresi:**  
https://ekinay-smart-agriculture-system.onrender.com

**API Test Videosu:** 
https://youtu.be/VbrXzlYZBH0?si=rtP-A80te2AEmG6O

## 1. Kullanıcı Kaydı Oluşturma
- **Endpoint:** `POST /auth/register`
- **Request Body:**
  ```json
  {
    "name": "Ali",
    "email": "ali@test.com",
    "password": "123456"
  }
  ```
- **Response:** `201 Created` - Kullanıcı başarıyla oluşturuldu

## 2. Kullanıcı Girişi Yapma
- **Endpoint:** `POST /auth/login`
- **Request Body:**
  ```json
  {
    "email": "ali@test.com",
    "password": "123456"
  }
  ```
- **Response:** `200 OK` - Giriş işlemi başarılı

## 3. Profil Güncelleme
- **Endpoint:** `PUT /users/{userId}`
- **Request Body:**
  ```json
  {
    "name": "Ali Güncel",
    "email": "aliguncel@test.com",
    "password": "654321"
  }
  ```
- **Response:** `200 OK` - Kullanıcı bilgileri güncellendi

## 4. Tarla Ekleme
- **Endpoint:** `POST /fields`
- **Request Body:**
  ```json
  {
    "name": "Tarla 1",
    "location": "Isparta"
  }
  ```
- **Response:** `201 Created` - Tarla eklendi

## 5. Tarla Güncelleme
- **Endpoint:** `PUT /fields/{fieldId}`
- **Request Body:**
  ```json
  {
    "name": "Tarla Güncel",
    "location": "Antalya"
  }
  ```
- **Response:** `200 OK` - Tarla güncellendi

## 6. Tarla Silme
- **Endpoint:** `DELETE /fields/{fieldId}`
- **Response:** `200 OK` - Tarla silindi

## 7. Tarlaları Listeleme
- **Endpoint:** `GET /fields`
- **Response:** `200 OK` - Tarla listesi getirildi

## 8. Ürün Ekleme
- **Endpoint:** `POST /crops`
- **Request Body:**
  ```json
  {
    "name": "Buğday",
    "fieldId": "1"
  }
  ```
- **Response:** `201 Created` - Ürün eklendi

## 9. Ürün Güncelleme
- **Endpoint:** `PUT /crops/{cropId}`
- **Request Body:**
  ```json
  {
    "name": "Arpa",
    "fieldId": "1"
  }
  ```
- **Response:** `200 OK` - Ürün güncellendi

## 10. Ürün Silme
- **Endpoint:** `DELETE /crops/{cropId}`
- **Response:** `200 OK` - Ürün silindi

## 11. Sulama Önerisi
- **Endpoint:** `GET /recommendations/irrigation/{fieldId}`
- **Response:** `200 OK` - Sulama önerisi alındı

## 12. Hava Uyarısı
- **Endpoint:** `GET /recommendations/alerts/{fieldId}`
- **Response:** `200 OK` - Hava uyarısı alındı
