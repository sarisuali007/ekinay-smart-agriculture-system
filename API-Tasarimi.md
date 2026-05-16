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
    Ekinay, kullanıcıların tarla ve ürün yönetimi yapmasını, sulama önerileri almasını,
    hava riski uyarılarını takip etmesini ve mobil push bildirimleri almasını sağlayan
    akıllı tarım destek sistemidir.
  contact:
    name: Ali Sarısu
    email: alisarisu007@gmail.com

servers:
  - url: http://localhost:3000
    description: Local development server
  - url: https://ekinay-smart-agriculture-system.onrender.com
    description: Render production REST API

tags:
  - name: Authentication
    description: Kullanıcı kayıt ve giriş işlemleri
  - name: Users
    description: Kullanıcı profil, silme ve mobil push token işlemleri
  - name: Fields
    description: Tarla yönetimi
  - name: Crops
    description: Ürün yönetimi
  - name: Recommendations
    description: Sulama önerileri ve hava uyarıları
  - name: Push
    description: Mobil push bildirim test işlemleri
  - name: Auto Alerts
    description: Otomatik hava riski taraması ve bildirim sistemi
  - name: RabbitMQ
    description: RabbitMQ kuyruğu üzerinden bildirim testi

paths:
  /:
    get:
      tags:
        - System
      summary: API çalışma kontrolü
      operationId: getApiHealth
      responses:
        "200":
          description: API çalışıyor
          content:
            text/plain:
              schema:
                type: string
              example: Ekinay API is running

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
              $ref: "#/components/schemas/RegisterRequest"
            example:
              name: Ali Sarısu
              email: ali@test.com
              password: "123456"
      responses:
        "201":
          description: Kayıt işlemi başarılı
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/AuthResponse"
              example:
                message: Kayıt işlemi başarılı!
                user:
                  _id: "USER_ID"
                  name: Ali Sarısu
                  email: ali@test.com
                  password: "123456"
                  expoPushToken: ""
                  pushAlertsEnabled: true
        "400":
          description: Eksik alan veya tekrar eden email
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/MessageResponse"

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
              $ref: "#/components/schemas/LoginRequest"
            example:
              email: ali@test.com
              password: "123456"
      responses:
        "200":
          description: Giriş işlemi başarılı
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/AuthResponse"
              example:
                message: Giriş işlemi başarılı!
                user:
                  _id: "USER_ID"
                  name: Ali Sarısu
                  email: ali@test.com
                  password: "123456"
                  expoPushToken: "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"
                  pushAlertsEnabled: true
        "401":
          description: Email veya şifre hatalı
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/MessageResponse"

  /users/{userId}:
    get:
      tags:
        - Users
      summary: Kullanıcı profil bilgisi getirme
      operationId: getUserById
      parameters:
        - $ref: "#/components/parameters/UserIdPath"
      responses:
        "200":
          description: Kullanıcı bilgileri getirildi
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/UserGetResponse"
        "404":
          description: Kullanıcı bulunamadı
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/MessageResponse"

    put:
      tags:
        - Users
      summary: Kullanıcı profil bilgisi güncelleme
      operationId: updateUser
      parameters:
        - $ref: "#/components/parameters/UserIdPath"
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/UserUpdateRequest"
            example:
              name: Ali Güncel
              email: aliguncel@test.com
              password: "654321"
      responses:
        "200":
          description: Kullanıcı bilgileri güncellendi
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/UserUpdateResponse"
        "404":
          description: Kullanıcı bulunamadı
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/MessageResponse"

    delete:
      tags:
        - Users
      summary: Kullanıcı silme
      operationId: deleteUser
      parameters:
        - $ref: "#/components/parameters/UserIdPath"
      responses:
        "200":
          description: Kullanıcı silindi
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/UserDeleteResponse"
        "404":
          description: Kullanıcı bulunamadı
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/MessageResponse"

  /users/{userId}/push-token:
    put:
      tags:
        - Users
      summary: Mobil Expo push token kaydetme
      operationId: updateUserPushToken
      parameters:
        - $ref: "#/components/parameters/UserIdPath"
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/PushTokenRequest"
            example:
              expoPushToken: "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"
              pushAlertsEnabled: true
      responses:
        "200":
          description: Push token kaydedildi
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/UserGetResponse"
        "404":
          description: Kullanıcı bulunamadı
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/MessageResponse"

  /fields:
    get:
      tags:
        - Fields
      summary: Kullanıcıya ait tarlaları listeleme
      operationId: getFields
      parameters:
        - $ref: "#/components/parameters/UserIdQuery"
      responses:
        "200":
          description: Tarla listesi başarıyla getirildi
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/Field"
        "400":
          description: Kullanıcı bilgisi zorunludur
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/MessageResponse"

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
              $ref: "#/components/schemas/FieldRequest"
            example:
              userId: "USER_ID"
              name: Domates Tarlası
              location: Antalya
              latitude: 36.8969
              longitude: 30.7133
              areaM2: 1200
              isGreenhouse: false
              polygon:
                - lat: 36.8969
                  lng: 30.7133
                - lat: 36.8971
                  lng: 30.7135
                - lat: 36.8968
                  lng: 30.7138
      responses:
        "201":
          description: Yeni tarla bilgisi eklendi
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/FieldCreateResponse"
        "400":
          description: Eksik veya hatalı tarla bilgisi
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/MessageResponse"

  /fields/{fieldId}:
    put:
      tags:
        - Fields
      summary: Tarla bilgisi güncelleme
      operationId: updateField
      parameters:
        - $ref: "#/components/parameters/FieldIdPath"
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/FieldRequest"
      responses:
        "200":
          description: Tarla bilgisi güncellendi
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/FieldUpdateResponse"
        "404":
          description: Tarla bulunamadı
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/MessageResponse"

    delete:
      tags:
        - Fields
      summary: Tarla silme
      operationId: deleteField
      parameters:
        - $ref: "#/components/parameters/FieldIdPath"
        - $ref: "#/components/parameters/UserIdQuery"
      responses:
        "200":
          description: Tarla silindi
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/MessageResponse"
              example:
                message: Tarla silindi.
        "404":
          description: Tarla bulunamadı
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/MessageResponse"

  /crops:
    get:
      tags:
        - Crops
      summary: Kullanıcıya ait ürünleri listeleme
      operationId: getCrops
      parameters:
        - $ref: "#/components/parameters/UserIdQuery"
      responses:
        "200":
          description: Ürün listesi başarıyla getirildi
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/Crop"
        "400":
          description: Kullanıcı bilgisi zorunludur
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/MessageResponse"

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
              $ref: "#/components/schemas/CropRequest"
            example:
              userId: "USER_ID"
              name: domates
              fieldId: "FIELD_ID"
              sowingDate: "2026-05-01"
      responses:
        "201":
          description: Yeni ürün bilgisi eklendi
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/CropCreateResponse"
        "400":
          description: Eksik ürün bilgisi veya geçersiz ürün adı
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/MessageResponse"
        "404":
          description: İlgili tarla bulunamadı
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/MessageResponse"

  /crops/{cropId}:
    put:
      tags:
        - Crops
      summary: Ürün bilgisi güncelleme
      operationId: updateCrop
      parameters:
        - $ref: "#/components/parameters/CropIdPath"
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/CropRequest"
      responses:
        "200":
          description: Ürün bilgisi güncellendi
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/CropUpdateResponse"
        "404":
          description: Ürün bulunamadı
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/MessageResponse"

    delete:
      tags:
        - Crops
      summary: Ürün silme
      operationId: deleteCrop
      parameters:
        - $ref: "#/components/parameters/CropIdPath"
        - $ref: "#/components/parameters/UserIdQuery"
      responses:
        "200":
          description: Ürün silindi
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/MessageResponse"
              example:
                message: Ürün silindi.
        "404":
          description: Ürün bulunamadı
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/MessageResponse"

  /recommendations/irrigation/{fieldId}:
    get:
      tags:
        - Recommendations
      summary: Sulama önerisi alma
      operationId: getIrrigationRecommendation
      parameters:
        - $ref: "#/components/parameters/FieldIdPath"
      responses:
        "200":
          description: Sulama önerisi başarıyla getirildi
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/IrrigationRecommendationResponse"
        "404":
          description: Tarla veya ürün bilgisi bulunamadı
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/MessageResponse"

  /recommendations/alerts/{fieldId}:
    get:
      tags:
        - Recommendations
      summary: Hava uyarısı alma
      operationId: getWeatherAlert
      parameters:
        - $ref: "#/components/parameters/FieldIdPath"
      responses:
        "200":
          description: Hava uyarısı başarıyla getirildi
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/WeatherAlertResponse"
        "404":
          description: Tarla veya ürün bilgisi bulunamadı
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/MessageResponse"

  /test-push/run:
    post:
      tags:
        - Push
      summary: Gerçek telefona test push bildirimi gönderme
      operationId: runTestPush
      parameters:
        - $ref: "#/components/parameters/SecretQuery"
      responses:
        "200":
          description: Test bildirimi gönderildi
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/TestPushResponse"
        "403":
          description: Yetkisiz istek
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/MessageResponse"
        "404":
          description: Push token kayıtlı kullanıcı veya tarla bulunamadı
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/MessageResponse"

  /auto-alerts/run:
    post:
      tags:
        - Auto Alerts
      summary: Otomatik hava riski taraması çalıştırma
      operationId: runAutoAlerts
      parameters:
        - $ref: "#/components/parameters/SecretQuery"
      responses:
        "200":
          description: Otomatik tarama tamamlandı
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/AutoAlertRunResponse"
              example:
                message: Otomatik tarama tamamlandı.
                summary:
                  checkedUserCount: 1
                  checkedFieldCount: 3
                  skippedNoCropCount: 0
                  noRiskCount: 3
                  alreadySentCount: 0
                  failedPushCount: 0
                  sentCount: 0
                  queuedToRabbitMqCount: 0
                  directPushCount: 0
        "403":
          description: Yetkisiz istek
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/MessageResponse"

  /rabbit-test/push:
    post:
      tags:
        - RabbitMQ
      summary: RabbitMQ kuyruğuna test bildirimi gönderme
      operationId: runRabbitMqPushTest
      parameters:
        - $ref: "#/components/parameters/SecretQuery"
        - name: userId
          in: query
          required: false
          description: Belirli bir kullanıcıya test bildirimi göndermek için opsiyonel kullanıcı ID
          schema:
            type: string
      responses:
        "200":
          description: Bildirim mesajı RabbitMQ kuyruğuna gönderildi
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/RabbitTestResponse"
        "403":
          description: Yetkisiz istek
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/MessageResponse"
        "404":
          description: Push token kayıtlı kullanıcı bulunamadı
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/MessageResponse"

components:
  parameters:
    UserIdPath:
      name: userId
      in: path
      required: true
      description: Kullanıcının MongoDB ObjectId bilgisi
      schema:
        type: string

    FieldIdPath:
      name: fieldId
      in: path
      required: true
      description: Tarlanın MongoDB ObjectId bilgisi
      schema:
        type: string

    CropIdPath:
      name: cropId
      in: path
      required: true
      description: Ürünün MongoDB ObjectId bilgisi
      schema:
        type: string

    UserIdQuery:
      name: userId
      in: query
      required: true
      description: Kullanıcının MongoDB ObjectId bilgisi
      schema:
        type: string

    SecretQuery:
      name: secret
      in: query
      required: true
      description: Otomatik alarm ve bildirim test endpointleri için gizli anahtar
      schema:
        type: string

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

    AuthResponse:
      type: object
      properties:
        message:
          type: string
        user:
          $ref: "#/components/schemas/User"

    User:
      type: object
      properties:
        _id:
          type: string
        name:
          type: string
        email:
          type: string
          format: email
        password:
          type: string
        expoPushToken:
          type: string
        pushAlertsEnabled:
          type: boolean
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time

    UserGetResponse:
      type: object
      properties:
        message:
          type: string
        user:
          $ref: "#/components/schemas/User"

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

    UserUpdateResponse:
      type: object
      properties:
        message:
          type: string
        updatedUser:
          $ref: "#/components/schemas/User"

    UserDeleteResponse:
      type: object
      properties:
        message:
          type: string
        deletedUser:
          $ref: "#/components/schemas/User"

    PushTokenRequest:
      type: object
      required:
        - expoPushToken
      properties:
        expoPushToken:
          type: string
        pushAlertsEnabled:
          type: boolean

    PolygonPoint:
      type: object
      required:
        - lat
        - lng
      properties:
        lat:
          type: number
        lng:
          type: number

    Field:
      type: object
      properties:
        _id:
          type: string
        userId:
          type: string
        name:
          type: string
        location:
          type: string
        latitude:
          type: number
        longitude:
          type: number
        areaM2:
          type: number
        isGreenhouse:
          type: boolean
        polygon:
          type: array
          items:
            $ref: "#/components/schemas/PolygonPoint"
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time

    FieldRequest:
      type: object
      required:
        - userId
        - name
        - location
        - latitude
        - longitude
        - polygon
      properties:
        userId:
          type: string
        name:
          type: string
        location:
          type: string
        latitude:
          type: number
        longitude:
          type: number
        areaM2:
          type: number
        isGreenhouse:
          type: boolean
        polygon:
          type: array
          items:
            $ref: "#/components/schemas/PolygonPoint"

    FieldCreateResponse:
      type: object
      properties:
        message:
          type: string
        field:
          $ref: "#/components/schemas/Field"

    FieldUpdateResponse:
      type: object
      properties:
        message:
          type: string
        updatedField:
          $ref: "#/components/schemas/Field"

    Crop:
      type: object
      properties:
        _id:
          type: string
        userId:
          type: string
        name:
          type: string
          enum:
            - domates
            - biber
            - salatalık
            - fasulye
        fieldId:
          type: string
        sowingDate:
          type: string
          format: date-time
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time

    CropRequest:
      type: object
      required:
        - userId
        - name
        - fieldId
        - sowingDate
      properties:
        userId:
          type: string
        name:
          type: string
          enum:
            - domates
            - biber
            - salatalık
            - fasulye
        fieldId:
          type: string
        sowingDate:
          type: string
          format: date

    CropCreateResponse:
      type: object
      properties:
        message:
          type: string
        crop:
          $ref: "#/components/schemas/Crop"

    CropUpdateResponse:
      type: object
      properties:
        message:
          type: string
        updatedCrop:
          $ref: "#/components/schemas/Crop"

    IrrigationRecommendationResponse:
      type: object
      properties:
        field:
          $ref: "#/components/schemas/Field"
        crop:
          $ref: "#/components/schemas/Crop"
        weather:
          type: object
        daysFromSowing:
          type: integer
        stage:
          type: object
        estimatedHarvestDate:
          type: string
          format: date
        irrigation:
          type: object
        calendar:
          type: array
          items:
            type: object
        message:
          type: string

    WeatherAlertResponse:
      type: object
      properties:
        field:
          $ref: "#/components/schemas/Field"
        crop:
          $ref: "#/components/schemas/Crop"
        weather:
          type: object
        alert:
          type: string
        message:
          type: string

    TestPushResponse:
      type: object
      properties:
        message:
          type: string
        userId:
          type: string
        fieldId:
          type: string
        expoResponse:
          type: object

    AutoAlertSummary:
      type: object
      properties:
        checkedUserCount:
          type: integer
        checkedFieldCount:
          type: integer
        skippedNoCropCount:
          type: integer
        noRiskCount:
          type: integer
        alreadySentCount:
          type: integer
        failedPushCount:
          type: integer
        sentCount:
          type: integer
        queuedToRabbitMqCount:
          type: integer
        directPushCount:
          type: integer

    AutoAlertRunResponse:
      type: object
      properties:
        message:
          type: string
        summary:
          $ref: "#/components/schemas/AutoAlertSummary"

    RabbitTestResponse:
      type: object
      properties:
        message:
          type: string
        userId:
          type: string
        fieldId:
          type: string
          nullable: true
        queue:
          type: string
        published:
          type: boolean
```
