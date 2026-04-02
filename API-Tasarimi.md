# API Tasarımı

**OpenAPI Spesifikasyon Dosyası:** [lamine.yaml](lamine.yaml)

Bu doküman, OpenAPI Specification (OAS) 3.0 standardına göre hazırlanmış bir API tasarımını içermektedir.

## OpenAPI Specification

```yaml
openapi: 3.0.3
info:
  title: Ekinay Smart Agriculture API
  version: 1.0.0
  description: |
    Ekinay sistemi kullanıcıların tarla ve ürün yönetimi yapmasını sağlar.
    Sistem ayrıca sulama önerileri ve hava uyarıları sunar.
  contact:
    name: Ali Sarısu
    email: alisarisu007@gmail.com

servers:
  - url: http://localhost:3000
    description: Development server
  - url: https://ekinay-smart-agriculture-system.vercel.app
    description: Frontend domain
  - url: https://ekinay-smart-agriculture-system.onrender.com
    description: Api domain  


tags:
  - name: Authentication
    description: Kullanıcı kayıt ve giriş işlemleri
  - name: Users
    description: Kullanıcı profil işlemleri
  - name: Fields
    description: Tarla yönetimi
  - name: Crops
    description: Ürün yönetimi
  - name: Recommendations
    description: Sulama önerileri ve hava uyarıları

paths:
  /auth/register:
    post:
      tags:
        - Authentication
      summary: Kullanıcı kaydı oluşturma
      operationId: registerUser
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/RegisterRequest'
            example:
              name: Ahmet Yılmaz
              email: ahmet@example.com
              password: "123456"
      responses:
        "200":
          description: Kayıt işlemi başarılı
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/MessageResponse'
              example:
                message: Kayıt işlemi başarılı!

  /auth/login:
    post:
      tags:
        - Authentication
      summary: Kullanıcı girişi yapma
      operationId: loginUser
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/LoginRequest'
            example:
              email: ahmet@example.com
              password: "123456"
      responses:
        "200":
          description: Giriş işlemi başarılı
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/MessageResponse'
              example:
                message: Giriş işlemi başarılı!

  /users/{userId}:
    put:
      tags:
        - Users
      summary: Kullanıcı profili güncelleme
      operationId: updateUser
      parameters:
        - name: userId
          in: path
          required: true
          description: Güncellenecek kullanıcının ID bilgisi
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UserUpdateRequest'
            example:
              name: Ahmet Yılmaz
              email: ahmet@example.com
              password: "654321"
      responses:
        "200":
          description: Kullanıcı bilgileri güncellendi
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserUpdateResponse'
              example:
                message: Kullanıcı 1 bilgileri güncellendi.
                updatedUser:
                  id: "1"
                  name: Ahmet Yılmaz
                  email: ahmet@example.com
                  password: "654321"

  /fields:
    get:
      tags:
        - Fields
      summary: Tarlaları listeleme
      operationId: getFields
      responses:
        "200":
          description: Tarla listesi başarıyla getirildi
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Field'
              example:
                - id: 1
                  name: Tarla 1
                  location: Isparta
                - id: 2
                  name: Tarla 2
                  location: Antalya

    post:
      tags:
        - Fields
      summary: Yeni tarla ekleme
      operationId: createField
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/FieldRequest'
            example:
              name: Tarla 3
              location: Konya
      responses:
        "200":
          description: Yeni tarla bilgisi eklendi
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/FieldCreateResponse'
              example:
                message: Yeni tarla bilgisi eklendi.
                field:
                  name: Tarla 3
                  location: Konya

  /fields/{fieldId}:
    put:
      tags:
        - Fields
      summary: Tarla bilgisi güncelleme
      operationId: updateField
      parameters:
        - name: fieldId
          in: path
          required: true
          description: Güncellenecek tarlanın ID bilgisi
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/FieldRequest'
            example:
              name: Tarla 1 Güncel
              location: Burdur
      responses:
        "200":
          description: Tarla bilgisi güncellendi
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/FieldUpdateResponse'
              example:
                message: Tarla bilgisi güncellendi.
                updatedField:
                  id: "1"
                  name: Tarla 1 Güncel
                  location: Burdur

    delete:
      tags:
        - Fields
      summary: Tarla silme
      operationId: deleteField
      parameters:
        - name: fieldId
          in: path
          required: true
          description: Silinecek tarlanın ID bilgisi
          schema:
            type: string
      responses:
        "200":
          description: Tarla silindi
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/MessageResponse'
              example:
                message: Tarla 1 silindi.

  /crops:
    post:
      tags:
        - Crops
      summary: Yeni ürün ekleme
      operationId: createCrop
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CropRequest'
            example:
              name: Domates
              fieldId: "1"
      responses:
        "200":
          description: Yeni ürün bilgisi eklendi
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CropCreateResponse'
              example:
                message: Yeni ürün bilgisi eklendi.
                crop:
                  name: Domates
                  fieldId: "1"

  /crops/{cropId}:
    put:
      tags:
        - Crops
      summary: Ürün bilgisi güncelleme
      operationId: updateCrop
      parameters:
        - name: cropId
          in: path
          required: true
          description: Güncellenecek ürünün ID bilgisi
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CropRequest'
            example:
              name: Biber
              fieldId: "1"
      responses:
        "200":
          description: Ürün bilgisi güncellendi
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CropUpdateResponse'
              example:
                message: Ürün bilgisi güncellendi.
                updatedCrop:
                  id: "1"
                  name: Biber
                  fieldId: "1"

    delete:
      tags:
        - Crops
      summary: Ürün silme
      operationId: deleteCrop
      parameters:
        - name: cropId
          in: path
          required: true
          description: Silinecek ürünün ID bilgisi
          schema:
            type: string
      responses:
        "200":
          description: Ürün silindi
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/MessageResponse'
              example:
                message: Ürün 1 silindi.

  /recommendations/irrigation/{fieldId}:
    get:
      tags:
        - Recommendations
      summary: Sulama önerisi alma
      operationId: getIrrigationRecommendation
      parameters:
        - name: fieldId
          in: path
          required: true
          description: Sulama önerisi alınacak tarlanın ID bilgisi
          schema:
            type: string
      responses:
        "200":
          description: Sulama önerisi başarıyla getirildi
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/MessageResponse'
              example:
                message: "Tarla 1 için sulama önerisi: Yarın sabah sulama yapın."

  /recommendations/alerts/{fieldId}:
    get:
      tags:
        - Recommendations
      summary: Hava uyarısı alma
      operationId: getWeatherAlert
      parameters:
        - name: fieldId
          in: path
          required: true
          description: Hava uyarısı alınacak tarlanın ID bilgisi
          schema:
            type: string
      responses:
        "200":
          description: Hava uyarısı başarıyla getirildi
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/MessageResponse'
              example:
                message: "Tarla 1 için hava uyarısı: Gece don riski var."

components:
  schemas:
    MessageResponse:
      type: object
      properties:
        message:
          type: string

    RegisterRequest:
      type: object
      required:
        - name
        - email
        - password
      properties:
        name:
          type: string
        email:
          type: string
          format: email
        password:
          type: string

    LoginRequest:
      type: object
      required:
        - email
        - password
      properties:
        email:
          type: string
          format: email
        password:
          type: string

    UserUpdateRequest:
      type: object
      properties:
        name:
          type: string
        email:
          type: string
          format: email
        password:
          type: string

    User:
      type: object
      properties:
        id:
          type: string
        name:
          type: string
        email:
          type: string
          format: email
        password:
          type: string

    UserUpdateResponse:
      type: object
      properties:
        message:
          type: string
        updatedUser:
          $ref: '#/components/schemas/User'

    Field:
      type: object
      properties:
        id:
          type: integer
        name:
          type: string
        location:
          type: string

    FieldRequest:
      type: object
      required:
        - name
        - location
      properties:
        name:
          type: string
        location:
          type: string

    FieldCreateResponse:
      type: object
      properties:
        message:
          type: string
        field:
          type: object
          properties:
            name:
              type: string
            location:
              type: string

    FieldUpdateResponse:
      type: object
      properties:
        message:
          type: string
        updatedField:
          type: object
          properties:
            id:
              type: string
            name:
              type: string
            location:
              type: string

    Crop:
      type: object
      properties:
        id:
          type: string
        name:
          type: string
        fieldId:
          type: string

    CropRequest:
      type: object
      required:
        - name
        - fieldId
      properties:
        name:
          type: string
        fieldId:
          type: string

    CropCreateResponse:
      type: object
      properties:
        message:
          type: string
        crop:
          type: object
          properties:
            name:
              type: string
            fieldId:
              type: string

    CropUpdateResponse:
      type: object
      properties:
        message:
          type: string
        updatedCrop:
          $ref: '#/components/schemas/Crop'
``