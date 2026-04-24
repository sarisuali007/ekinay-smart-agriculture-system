const API_URL = "https://ekinay-smart-agriculture-system.onrender.com";
let currentUserId = localStorage.getItem("userId") || "";
let fieldsCache = [];
let cropsCache = [];
let alertTickerItems = [];
let fieldInsightsCache = {};
let addFieldMapState = null;
let updateFieldMapState = null;

function showMessage(message, isError = false) {
    const box = document.getElementById("messageBox");
    box.textContent = message;
    box.style.color = isError ? "red" : "green";
}

async function register() {
    try {
        console.log("Kayıt fonksiyonu çağrıldı.");
        showMessage("Kayıt işlemi gerçekleştiriliyor...");

        const name = document.getElementById("registerName").value;
        const email = document.getElementById("registerEmail").value;
        const password = document.getElementById("registerPassword").value;

        const response = await fetch(API_URL + "/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Kayıt başarısız.");
        }

        showMessage(data.message);

    }
    catch (error) {
        showMessage(error.message, true);
    }

}

async function login() {
    try {
        console.log("Giriş fonksiyonu çağrıldı.");
        showMessage("Giriş işlemi gerçekleştiriliyor...");

        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        const response = await fetch(API_URL + "/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Giriş başarısız.");
        }

        currentUserId = data.user._id;
        localStorage.setItem("userId", currentUserId);

        showMessage(data.message);
        window.location.href = "dashboard.html";

    }
    catch (error) {
        showMessage(error.message, true);
    }
}

async function getProfile() {
    try {
        if (!currentUserId) {
            throw new Error("Profil bilgilerini görmek için giriş yapmalısınız.");
        }

        const response = await fetch(API_URL + "/users/" + currentUserId);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Profil bilgileri getirilemedi.");
        }

        const user = data.user || data;;

        document.getElementById("updateName").value = user.name || "";
        document.getElementById("updateEmail").value = user.email || "";

        const dashboardWelcome = document.getElementById("dashboardWelcome");
        const dashboardSubtext = document.getElementById("dashboardSubtext");

        if (dashboardWelcome) {
            dashboardWelcome.textContent = `Hoş geldin, ${user.name || "Kullanıcı"}`;
        }

        if (dashboardSubtext) {
            dashboardSubtext.textContent = `${user.email || "E-posta bilgisi yok"} hesabıyla giriş yaptınız. Tarlalarınızı ve ürünlerinizi aşağıdan yönetebilirsiniz.`;
        }

        const debugUserId = document.getElementById("debugUserId");
        if (debugUserId) {
            debugUserId.textContent = "Kullanıcı ID: " + (user._id || currentUserId);
        }

        showMessage("Profil bilgileri getirildi.");
        refreshAllDashboardData();

    } catch (error) {
        showMessage(error.message, true);
    }

}

async function updateProfile() {
    try {
        if (!currentUserId) {
            throw new Error("Güncelleme için giriş yapmalısınız.");
        }
        const name = document.getElementById("updateName").value;
        const email = document.getElementById("updateEmail").value;
        const password = document.getElementById("updatePassword").value;

        const response = await fetch(API_URL + "/users/" + currentUserId, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Profil güncellenemedi.");
        }

        showMessage(data.message);
    }
    catch (error) {
        showMessage(error.message, true);
    }

}

async function deleteProfile() {
    try {
        if (!currentUserId) {
            throw new Error("Silme işlemi için giriş yapmalısınız.");
        }

        const response = await fetch(API_URL + "/users/" + currentUserId, {
            method: "DELETE"
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Profil silinemedi.");
        }

        localStorage.removeItem("userId");
        currentUserId = "";

        document.getElementById("updateName").value = "";
        document.getElementById("updateEmail").value = "";
        document.getElementById("updatePassword").value = "";

        const debugUserId = document.getElementById("debugUserId");
        if (debugUserId) {
            debugUserId.textContent = "";
        }

        showMessage(data.message || "Profil silindi.");
        logout();
    }
    catch (error) {
        showMessage(error.message, true);
    }
}

function populateFieldSelects() {
    const selectIds = [
        "updateFieldSelect",
        "cropFieldSelect",
        "irrigationFieldSelect",
        "alertFieldSelect",
        "manageCropFieldSelect"
    ];

    selectIds.forEach(id => {
        const select = document.getElementById(id);
        if (!select) return;

        select.innerHTML = "<option value=''>Tarla seçiniz</option>";

        fieldsCache.forEach(field => {
            const option = document.createElement("option");
            option.value = field._id;
            option.textContent = `${field.name} - ${field.location} - ${field.isGreenhouse ? "Sera" : "Açık Alan"}`;
            select.appendChild(option);
        });
    });

    fillFieldFormFromSelection();
    fillCropFormFromSelection();

}

function getCropByFieldId(fieldId) {
    return cropsCache.find(crop => {
        const cropFieldId =
            typeof crop.fieldId === "object" ? crop.fieldId._id : crop.fieldId;
        return cropFieldId === fieldId;
    });
}

function getFieldIdFromCrop(crop) {
    if (!crop) return "";
    return typeof crop.fieldId === "object" ? crop.fieldId._id : crop.fieldId;
}

function getFieldFromCrop(crop) {
    if (!crop) return null;

    if (typeof crop.fieldId === "object" && crop.fieldId !== null) {
        return crop.fieldId;
    }

    const fieldId = getFieldIdFromCrop(crop);
    return getFieldById(fieldId) || null;
}

function selectCropFromCard(fieldId) {
    const manageSelect = document.getElementById("manageCropFieldSelect");
    const addSelect = document.getElementById("cropFieldSelect");

    if (manageSelect) {
        manageSelect.value = fieldId;
        fillCropFormFromSelection();
    }

    if (addSelect) {
        addSelect.value = fieldId;
    }

    scrollToSection("cropSection");
}

function renderCropCards() {
    const list = document.getElementById("cropList");
    if (!list) return;

    list.innerHTML = "";

    const addCard = document.createElement("div");
    addCard.className = "crop-card add-card";
    addCard.innerHTML = `
        <div class="add-card-inner">
            <span class="add-card-plus">+</span>
            <h4>Yeni Ürün Ekle</h4>
            <p>Yeni bir ürün kaydı oluşturmak için buraya tıklayın.</p>
        </div>
    `;
    addCard.onclick = () => {
        window.location.href = "crop-form.html";
    };
    list.appendChild(addCard);

    if (!cropsCache.length) {
        const empty = document.createElement("div");
        empty.className = "empty-state";
        empty.textContent = "Henüz kayıtlı ürün bulunmuyor. Önce bir tarla seçip ürün ekleyin.";
        list.appendChild(empty);
        return;
    }

    cropsCache.forEach(crop => {
        const field = getFieldFromCrop(crop);
        const fieldId = getFieldIdFromCrop(crop);
        const fieldName = field ? field.name : "Bilinmeyen Tarla";
        const fieldType = field ? (field.isGreenhouse ? "Sera" : "Açık Alan") : "Tarla bilgisi yok";
        const location = field ? field.location : "Konum bilgisi yok";

        const card = document.createElement("div");
        card.className = "crop-card";

        card.innerHTML = `
            <span class="crop-badge">${crop.name}</span>
            <h4>${crop.name.charAt(0).toUpperCase() + crop.name.slice(1)}</h4>
            <p><strong>Bağlı Tarla:</strong> ${fieldName}</p>
            <p><strong>Tarla Tipi:</strong> ${fieldType}</p>
            <p><strong>Konum:</strong> ${location}</p>
            <p><strong>Ekim Tarihi:</strong> ${formatDate(crop.sowingDate)}</p>

            <div class="crop-card-actions">
                <button class="crop-card-action-btn primary" onclick="window.location.href='crop-form.html?fieldId=${fieldId}'">
                    Bu Ürünü Düzenle
                </button>

                <button class="crop-card-action-btn" onclick="window.location.href='field-form.html?id=${fieldId}'">
                    Bu Tarlaya Git
                </button>
            </div>
        `;

        list.appendChild(card);
    });
}

function formatDate(dateValue) {
    if (!dateValue) return "Belirtilmedi";

    const date = new Date(dateValue);

    if (isNaN(date.getTime())) return "Belirtilmedi";

    return date.toLocaleDateString("tr-TR");
}

function shortenText(text, maxLength = 120) {
    if (!text) return "Bilgi bulunamadı.";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + "...";
}

function getSeverityFromMessage(message) {
    const text = (message || "").toLowerCase();

    if (
        text.includes("don") ||
        text.includes("şiddetli yağış") ||
        text.includes("kuvvetli rüzgar")
    ) {
        return "critical";
    }

    if (
        text.includes("yüksek sıcaklık stresi") ||
        text.includes("yüksek nem") ||
        text.includes("bugün sulama önerilir") ||
        text.includes("kontrollü sulama önerilir")
    ) {
        return "warning";
    }

    if (
        text.includes("önemli bir hava uyarısı görünmüyor") ||
        text.includes("bugün ek sulama gerekmeyebilir")
    ) {
        return "safe";
    }

    return "neutral";
}

function applySeverityToBox(boxElement, severity) {
    if (!boxElement) return;

    boxElement.classList.remove(
        "severity-neutral",
        "severity-safe",
        "severity-warning",
        "severity-critical"
    );

    boxElement.classList.add(`severity-${severity}`);
}

function fillCropFormFromSelection() {
    const select = document.getElementById("manageCropFieldSelect");
    const cropNameInput = document.getElementById("updateCropName");
    const cropSowingDateInput = document.getElementById("updateCropSowingDate");
    const status = document.getElementById("cropManageStatus");

    if (!select || !cropNameInput || !cropSowingDateInput) return;

    const fieldId = select.value;

    if (!fieldId) {
        cropNameInput.value = "";
        cropSowingDateInput.value = "";
        if (status) {
            status.textContent = "Önce bir tarla seçin.";
        }
        return;
    }

    const crop = getCropByFieldId(fieldId);

    if (!crop) {
        cropNameInput.value = "";
        cropSowingDateInput.value = "";
        if (status) {
            status.textContent = "Bu tarlaya ait kayıtlı ürün bulunamadı.";
        }
        return;
    }

    cropNameInput.value = crop.name || "";

    if (crop.sowingDate) {
        cropSowingDateInput.value = new Date(crop.sowingDate).toISOString().split("T")[0];
    } else {
        cropSowingDateInput.value = "";
    }

    if (status) {
        status.textContent = `Seçili tarladaki mevcut ürün: ${crop.name}`;
    }
}

function getFieldById(fieldId) {
    return fieldsCache.find(field => field._id === fieldId);
}

function renderFieldCards() {
    const list = document.getElementById("fieldList");
    if (!list) return;

    list.innerHTML = "";

    const addCard = document.createElement("div");
    addCard.className = "field-card add-card";
    addCard.innerHTML = `

    <div class="add-card-inner">
        <span class="add-card-plus">+</span>
        <h4>Yeni Tarla Ekle</h4>
        <p>Yeni bir tarla oluşturmak için buraya tıklayın.</p>
    </div>

    `;

    addCard.onclick = () => {
        window.location.href = "field-form.html";
    };

    list.appendChild(addCard);

    fieldsCache.forEach(field => {
        const crop = getCropByFieldId(field._id);

        const cropName = crop ? crop.name : "Henüz ürün yok";
        const sowingDate = crop ? formatDate(crop.sowingDate) : "-";

        const card = document.createElement("div");
        card.className = "field-card";

        const typeClass = field.isGreenhouse ? "greenhouse" : "open";
        const typeText = field.isGreenhouse ? "Sera" : "Açık Alan";

        card.innerHTML = `
            <span class="field-badge ${typeClass}">${typeText}</span>
            <h4>${field.name}</h4>

            <p><strong>Konum:</strong> ${field.location}</p>
            <p><strong>Koordinat:</strong> ${field.latitude}, ${field.longitude}</p>
            <p><strong>Alan:</strong> ${field.areaM2 || 0} m²</p>

            <div class="field-card-divider"></div>

            <p><strong>Ürün:</strong> ${cropName}</p>
            <p><strong>Ekim Tarihi:</strong> ${sowingDate}</p>

            <div class="field-card-divider"></div>

            <div id="irrigation-box-${field._id}" class="field-info-box severity-neutral">
                <span class="field-info-title">Sulama Özeti</span>
                <p id="irrigation-summary-${field._id}">Yükleniyor...</p>

                <div id="irrigation-plan-${field._id}" class="mini-plan-grid">
                    <div class="mini-plan-item">
                        <span class="mini-plan-day">Bugün</span>
                        <span class="mini-plan-status">Yükleniyor...</span>
                    </div>
                    <div class="mini-plan-item">
                        <span class="mini-plan-day">Yarın</span>
                        <span class="mini-plan-status">Yükleniyor...</span>
                    </div>
                    <div class="mini-plan-item">
                        <span class="mini-plan-day">2 Gün Sonra</span>
                        <span class="mini-plan-status">Yükleniyor...</span>
                    </div>
                </div>
            </div>

            <div id="alert-box-${field._id}" class="field-info-box severity-neutral">
                <span class="field-info-title">Hava Uyarısı</span>
                <p id="alert-summary-${field._id}">Yükleniyor...</p>
            </div>

            <div class="field-card-actions">
                <button class="field-card-action-btn primary" onclick="window.location.href='field-form.html?id=${field._id}'">
                    Bu Tarlayı Düzenle
                </button>

                <button class="field-card-action-btn" onclick="window.location.href='crop-form.html?fieldId=${field._id}'">
                    Bu Tarlanın Ürününe Git
                </button>
            </div>

            </div>
        `;

        list.appendChild(card);

        loadFieldCardInsights(field._id);
    });
}

async function loadFieldCardInsights(fieldId) {
    const irrigationEl = document.getElementById(`irrigation-summary-${fieldId}`);
    const alertEl = document.getElementById(`alert-summary-${fieldId}`);
    const irrigationBox = document.getElementById(`irrigation-box-${fieldId}`);
    const alertBox = document.getElementById(`alert-box-${fieldId}`);
    const irrigationPlanEl = document.getElementById(`irrigation-plan-${fieldId}`);

    try {
        const irrigationResponse = await fetch(API_URL + "/recommendations/irrigation/" + fieldId + "?userId=" + currentUserId);
        const irrigationData = await irrigationResponse.json();

        if (irrigationResponse.ok) {
            const shortened = shortenText(irrigationData.message, 140);
            const severity = getSeverityFromMessage(irrigationData.message);
            const plan = buildMiniWaterPlan(irrigationData.message);

            if (irrigationEl) {
                irrigationEl.textContent = shortened;
            }

            if (irrigationPlanEl) {
                irrigationPlanEl.innerHTML = renderMiniWaterPlan(plan);
            }

            applySeverityToBox(irrigationBox, severity);

            if (!fieldInsightsCache[fieldId]) fieldInsightsCache[fieldId] = {};
            fieldInsightsCache[fieldId].irrigationMessage = irrigationData.message;
            fieldInsightsCache[fieldId].irrigationSeverity = severity;
            refreshTodaySummary();
        }
        else {
            const errorMessage = irrigationData.message || "Sulama bilgisi alınamadı.";

            if (irrigationEl) {
                irrigationEl.textContent = errorMessage;
            }

            if (irrigationPlanEl) {
                irrigationPlanEl.innerHTML = renderMiniWaterPlan(buildMiniWaterPlan(""));
            }

            applySeverityToBox(irrigationBox, "neutral");

            if (!fieldInsightsCache[fieldId]) fieldInsightsCache[fieldId] = {};
            fieldInsightsCache[fieldId].irrigationMessage = errorMessage;
            fieldInsightsCache[fieldId].irrigationSeverity = "neutral";
            refreshTodaySummary();
        }
    }
    catch (error) {
        if (irrigationEl) {
            irrigationEl.textContent = "Sulama bilgisi alınamadı.";
        }

        if (irrigationPlanEl) {
            irrigationPlanEl.innerHTML = renderMiniWaterPlan(buildMiniWaterPlan(""));
        }

        applySeverityToBox(irrigationBox, "neutral");
        if (!fieldInsightsCache[fieldId]) fieldInsightsCache[fieldId] = {};
        fieldInsightsCache[fieldId].irrigationMessage = "Sulama bilgisi alınamadı.";
        fieldInsightsCache[fieldId].irrigationSeverity = "neutral";
        refreshTodaySummary();
    }


    try {
        const alertResponse = await fetch(API_URL + "/recommendations/alerts/" + fieldId + "?userId=" + currentUserId);
        const alertData = await alertResponse.json();

        if (alertResponse.ok) {
            const shortened = shortenText(alertData.message, 140);
            const severity = getSeverityFromMessage(alertData.message);

            if (alertEl) {
                alertEl.textContent = shortened;
            }

            applySeverityToBox(alertBox, severity);
            updateAlertTickerItem(fieldId, alertData.message);
            if (!fieldInsightsCache[fieldId]) fieldInsightsCache[fieldId] = {};
            fieldInsightsCache[fieldId].alertMessage = alertData.message;
            fieldInsightsCache[fieldId].alertSeverity = severity;
            refreshTodaySummary();
        } else {
            const errorMessage = alertData.message || "Uyarı bilgisi alınamadı.";

            if (alertEl) {
                alertEl.textContent = errorMessage;
            }

            applySeverityToBox(alertBox, "neutral");
            updateAlertTickerItem(fieldId, errorMessage);
            if (!fieldInsightsCache[fieldId]) fieldInsightsCache[fieldId] = {};
            fieldInsightsCache[fieldId].alertMessage = errorMessage;
            fieldInsightsCache[fieldId].alertSeverity = "neutral";
            refreshTodaySummary();

        }
    } catch (error) {
        const fallbackMessage = "Uyarı bilgisi alınamadı.";

        if (alertEl) {
            alertEl.textContent = fallbackMessage;
        }

        applySeverityToBox(alertBox, "neutral");
        updateAlertTickerItem(fieldId, fallbackMessage);
        if (!fieldInsightsCache[fieldId]) fieldInsightsCache[fieldId] = {};
        fieldInsightsCache[fieldId].alertMessage = fallbackMessage;
        fieldInsightsCache[fieldId].alertSeverity = "neutral";
        refreshTodaySummary();

    }
}

async function addField() {
    try {
        const name = document.getElementById("fieldName").value;
        const location = document.getElementById("fieldLocation").value;
        const latitude = document.getElementById("fieldLatitude").value;
        const longitude = document.getElementById("fieldLongitude").value;
        const areaM2 = document.getElementById("fieldArea").value;
        const isGreenhouse = document.getElementById("fieldIsGreenhouse").checked;
        const polygonRaw = document.getElementById("fieldPolygon").value;
        const polygon = polygonRaw ? JSON.parse(polygonRaw) : [];


        const response = await fetch(API_URL + "/fields", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: currentUserId,
                name,
                location,
                latitude,
                longitude,
                areaM2,
                isGreenhouse,
                polygon
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Tarla eklenemedi.");
        }

        showMessage(data.message);
        getFields();
    }
    catch (error) {
        showMessage(error.message, true);
    }
}

async function getFields() {
    try {
        const response = await fetch(API_URL + "/fields?userId=" + currentUserId);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Tarlalar getirilemedi.");
        }

        fieldsCache = data;
        populateFieldSelects();
        refreshDashboardStats();
        fieldInsightsCache = {};
        alertTickerItems = [];
        renderAlertTicker();
        renderFieldCards();
        renderCropCards();
        refreshTodaySummary();
        renderPriorityFields();

        showMessage("Tarlalar getirildi.");

    }
    catch (error) {
        showMessage(error.message, true);
    }
}

function fillFieldFormFromSelection() {
    const select = document.getElementById("updateFieldSelect");
    if (!select) return;

    const fieldId = select.value;
    const field = getFieldById(fieldId);

    if (!field) {
        document.getElementById("updateFieldName").value = "";
        document.getElementById("updateFieldLocation").value = "";
        document.getElementById("updateFieldLatitude").value = "";
        document.getElementById("updateFieldLongitude").value = "";
        document.getElementById("updateFieldArea").value = "";
        document.getElementById("updateFieldIsGreenhouse").checked = false;
        if (updateFieldMapState) {
            clearMapStateSelection(updateFieldMapState);
        }
        return;
    }

    document.getElementById("updateFieldName").value = field.name || "";
    document.getElementById("updateFieldLocation").value = field.location || "";
    document.getElementById("updateFieldLatitude").value = field.latitude ?? "";
    document.getElementById("updateFieldLongitude").value = field.longitude ?? "";
    document.getElementById("updateFieldArea").value = field.areaM2 ?? "";
    document.getElementById("updateFieldIsGreenhouse").checked = !!field.isGreenhouse;
    document.getElementById("updateFieldPolygon").value = JSON.stringify(field.polygon || []);

    if (updateFieldMapState) {
        loadPolygonIntoMap(updateFieldMapState, field.polygon || []);
    }
}

async function updateField() {
    try {
        const fieldId = document.getElementById("updateFieldSelect").value;
        const name = document.getElementById("updateFieldName").value;
        const location = document.getElementById("updateFieldLocation").value;
        const latitude = document.getElementById("updateFieldLatitude").value;
        const longitude = document.getElementById("updateFieldLongitude").value;
        const areaM2 = document.getElementById("updateFieldArea").value;
        const isGreenhouse = document.getElementById("updateFieldIsGreenhouse").checked;
        const polygonRaw = document.getElementById("updateFieldPolygon").value;
        const polygon = polygonRaw ? JSON.parse(polygonRaw) : [];

        const response = await fetch(API_URL + "/fields/" + fieldId, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: currentUserId,
                name,
                location,
                latitude,
                longitude,
                areaM2,
                isGreenhouse,
                polygon
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Tarla güncellenemedi.");
        }

        showMessage(data.message);
        getFields();

    }
    catch (error) {
        showMessage(error.message, true);
    }
}

async function deleteField() {
    try {
        const fieldId = document.getElementById("updateFieldSelect").value;

        const response = await fetch(API_URL + "/fields/" + fieldId + "?userId=" + currentUserId, {
            method: "DELETE"
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Tarla silinemedi.");
        }

        showMessage(data.message);
        getFields();
        getCrops();
    }
    catch (error) {
        showMessage(error.message, true);
    }

}

function populateCropSelects() {
    const SelectIds = [
        "updateCropSelect",
    ];

    SelectIds.forEach(id => {
        const select = document.getElementById(id);
        if (!select) return;

        select.innerHTML = "<option value=''>Ürün seçiniz</option>";

        cropsCache.forEach(crop => {
            const option = document.createElement("option");
            option.value = crop._id;

            const fieldName = crop.fieldId && crop.fieldId.name ? crop.fieldId.name : "Tarla bilgisi yok";
            option.textContent = `${crop.name} - ${fieldName}`;

            select.appendChild(option);
        });
    });
}


async function addCrop() {
    try {
        const name = document.getElementById("cropName").value;
        const fieldId = document.getElementById("cropFieldSelect").value;
        const sowingDate = document.getElementById("cropSowingDate").value;

        const response = await fetch(API_URL + "/crops", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: currentUserId, name, fieldId, sowingDate })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Ürün eklenemedi.");
        }

        showMessage(data.message);
        getCrops();

    }
    catch (error) {
        showMessage(error.message, true);
    }
}

async function getCrops() {
    try {
        const response = await fetch(API_URL + "/crops?userId=" + currentUserId);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Ürünler getirilemedi.");
        }

        cropsCache = data;
        populateCropSelects();
        refreshDashboardStats();
        fillCropFormFromSelection();
        renderFieldCards();
        renderCropCards();
        refreshTodaySummary();
        renderPriorityFields();
    }
    catch (error) {
        showMessage(error.message, true);
    }
}

async function updateCrop() {
    try {
        const fieldId = document.getElementById("manageCropFieldSelect").value;
        const crop = getCropByFieldId(fieldId);

        if (!crop) {
            throw new Error("Bu tarlaya ait ürün bulunamadı.");
        }

        const cropId = crop._id;
        const name = document.getElementById("updateCropName").value;
        const sowingDate = document.getElementById("updateCropSowingDate").value;

        const response = await fetch(API_URL + "/crops/" + cropId, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: currentUserId, name, fieldId, sowingDate })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Ürün güncellenemedi.");
        }

        showMessage(data.message);
        getCrops();
    } catch (error) {
        showMessage(error.message, true);
    }
}

async function deleteCrop() {
    try {
        const fieldId = document.getElementById("manageCropFieldSelect").value;
        const crop = getCropByFieldId(fieldId);

        if (!crop) {
            throw new Error("Bu tarlaya ait ürün bulunamadı.");
        }

        const response = await fetch(API_URL + "/crops/" + crop._id + "?userId=" + currentUserId, {
            method: "DELETE"
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Ürün silinemedi.");
        }

        showMessage(data.message);
        getCrops();
    } catch (error) {
        showMessage(error.message, true);
    }
}

async function getIrrigation() {
    try {
        const fieldId = document.getElementById("irrigationFieldSelect").value;

        const response = await fetch(API_URL + "/recommendations/irrigation/" + fieldId);
        const data = await response.json();

        if (response.ok) {
            showMessage(data.message);
        }

        if (!response.ok) {
            throw new Error(data.message || "Sulama önerisi getirilemedi.");
        }
    }
    catch (error) {
        showMessage(error.message, true);
    }

}

async function getAlert() {
    try {
        const fieldId = document.getElementById("alertFieldSelect").value;

        const response = await fetch(API_URL + "/recommendations/alerts/" + fieldId);
        const data = await response.json();

        if (response.ok) {
            showMessage(data.message);
        }

        if (!response.ok) {
            throw new Error(data.message || "Uyarılar getirilemedi.");
        }
    }
    catch (error) {
        showMessage(error.message, true);
    }
}

function showAuthSection() {
    const authSection = document.getElementById("authSection");
    const appSection = document.getElementById("appSection");

    if (authSection) authSection.classList.remove("hidden");
    if (appSection) appSection.classList.add("hidden");
}

function showAppSection() {
    const authSection = document.getElementById("authSection");
    const appSection = document.getElementById("appSection");

    if (!currentUserId) {
        showMessage("Önce giriş yapmalısınız.", true);
        return;
    }

    if (authSection) authSection.classList.add("hidden");
    if (appSection) appSection.classList.remove("hidden");
}

function logout() {
    localStorage.removeItem("userId");
    currentUserId = "";
    window.location.href = "auth.html";

    const authSection = document.getElementById("authSection");
    const appSection = document.getElementById("appSection");

    if (authSection) authSection.classList.remove("hidden");
    if (appSection) appSection.classList.add("hidden");

    showMessage("Çıkış yapıldı.");

    document.getElementById("updateName").value = "";
    document.getElementById("updateEmail").value = "";
    document.getElementById("updatePassword").value = "";

    const dashboardWelcome = document.getElementById("dashboardWelcome");
    const dashboardSubtext = document.getElementById("dashboardSubtext");

    if (dashboardWelcome) {
        dashboardWelcome.textContent = "Hoş geldiniz";
    }

    if (dashboardSubtext) {
        dashboardSubtext.textContent = "Tarlalarınızı, ürünlerinizi ve önerilerinizi buradan yönetebilirsiniz.";
    }

    refreshDashboardStats();
}

function refreshDashboardStats() {
    const fieldCountEl = document.getElementById("statFieldCount");
    const cropCountEl = document.getElementById("statCropCount");
    const greenhouseCountEl = document.getElementById("statGreenhouseCount");
    const openFieldCountEl = document.getElementById("statOpenFieldCount");

    const totalFields = fieldsCache.length;
    const totalCrops = cropsCache.length;
    const greenhouseCount = fieldsCache.filter(field => field.isGreenhouse).length;
    const openFieldCount = totalFields - greenhouseCount;

    if (fieldCountEl) fieldCountEl.textContent = totalFields;
    if (cropCountEl) cropCountEl.textContent = totalCrops;
    if (greenhouseCountEl) greenhouseCountEl.textContent = greenhouseCount;
    if (openFieldCountEl) openFieldCountEl.textContent = openFieldCount;
}

function renderAlertTicker() {
    const ticker = document.getElementById("alertTickerTrack");
    if (!ticker) return;

    if (!alertTickerItems.length) {
        ticker.textContent = "Şu anda gösterilecek aktif uyarı bulunmuyor.";
        return;
    }

    ticker.textContent = alertTickerItems.join("   •   ");
}

function updateAlertTickerItem(fieldId, message) {
    const field = getFieldById(fieldId);
    const fieldName = field ? field.name : "Bilinmeyen Tarla";

    const cleanMessage = shortenText(message, 110);
    const entry = `${fieldName}: ${cleanMessage}`;

    const existingIndex = alertTickerItems.findIndex(item => item.startsWith(fieldName + ":"));

    if (existingIndex >= 0) {
        alertTickerItems[existingIndex] = entry;
    } else {
        alertTickerItems.push(entry);
    }

    renderAlertTicker();
}

function buildMiniWaterPlan(message) {
    const text = (message || "").toLowerCase();

    if (text.includes("bugün sulama önerilir")) {
        return [
            { day: "Bugün", status: "Sulama önerilir" },
            { day: "Yarın", status: "Kontrol et" },
            { day: "2 Gün Sonra", status: "Duruma göre tekrar değerlendir" }
        ];
    }

    if (text.includes("kontrollü sulama önerilir")) {
        return [
            { day: "Bugün", status: "Kontrollü sulama" },
            { day: "Yarın", status: "Nem durumunu izle" },
            { day: "2 Gün Sonra", status: "Gerekirse tekrar sulama" }
        ];
    }

    if (text.includes("ek sulama gerekmeyebilir")) {
        return [
            { day: "Bugün", status: "Sulama gerekmiyor" },
            { day: "Yarın", status: "Takip et" },
            { day: "2 Gün Sonra", status: "Toprağı kontrol et" }
        ];
    }

    return [
        { day: "Bugün", status: "Bilgi bekleniyor" },
        { day: "Yarın", status: "Bilgi bekleniyor" },
        { day: "2 Gün Sonra", status: "Bilgi bekleniyor" }
    ];
}

function renderMiniWaterPlan(plan) {
    return plan.map(item => {
        return `
            <div class="mini-plan-item">
                <span class="mini-plan-day">${item.day}</span>
                <span class="mini-plan-status">${item.status}</span>
            </div>
        `;
    }).join("");
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    section.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function selectFieldFromCard(fieldId) {
    const select = document.getElementById("updateFieldSelect");
    if (!select) return;

    select.value = fieldId;
    fillFieldFormFromSelection();
    scrollToSection("fieldSection");
}

function selectCropFieldFromCard(fieldId) {
    const cropManageSelect = document.getElementById("manageCropFieldSelect");
    if (cropManageSelect) {
        cropManageSelect.value = fieldId;
        fillCropFormFromSelection();
    }

    const cropAddSelect = document.getElementById("cropFieldSelect");
    if (cropAddSelect) {
        cropAddSelect.value = fieldId;
    }

    scrollToSection("cropSection");
}

function selectRecommendationFieldFromCard(fieldId) {
    const irrigationSelect = document.getElementById("irrigationFieldSelect");
    const alertSelect = document.getElementById("alertFieldSelect");

    if (irrigationSelect) {
        irrigationSelect.value = fieldId;
    }

    if (alertSelect) {
        alertSelect.value = fieldId;
    }

    scrollToSection("recommendationSection");
}

function refreshTodaySummary() {
    const criticalEl = document.getElementById("summaryCriticalCount");
    const todayWaterEl = document.getElementById("summaryTodayWaterCount");
    const noCropEl = document.getElementById("summaryNoCropCount");
    const activeCropEl = document.getElementById("summaryActiveCropCount");

    const noCropCount = fieldsCache.filter(field => !getCropByFieldId(field._id)).length;
    const activeCropCount = cropsCache.length;

    let criticalCount = 0;
    let todayWaterCount = 0;

    fieldsCache.forEach(field => {
        const insight = fieldInsightsCache[field._id];

        if (!insight) return;

        if (insight.alertSeverity === "critical") {
            criticalCount += 1;
        }

        const irrigationText = (insight.irrigationMessage || "").toLowerCase();
        if (irrigationText.includes("bugün sulama önerilir")) {
            todayWaterCount += 1;
        }
    });

    if (criticalEl) criticalEl.textContent = criticalCount;
    if (todayWaterEl) todayWaterEl.textContent = todayWaterCount;
    if (noCropEl) noCropEl.textContent = noCropCount;
    if (activeCropEl) activeCropEl.textContent = activeCropCount;
}

function renderPriorityFields() {
    const list = document.getElementById("priorityFieldsList");
    if (!list) return;

    list.innerHTML = "";

    const priorityItems = [];

    fieldsCache.forEach(field => {
        const crop = getCropByFieldId(field._id);
        const insight = fieldInsightsCache[field._id] || {};

        if (!crop) {
            priorityItems.push({
                type: "info",
                title: field.name,
                message: "Bu tarlada henüz ürün yok. Önce ürün eklenmeli.",
                fieldId: field._id
            });
            return;
        }

        if (insight.alertSeverity === "critical") {
            priorityItems.push({
                type: "critical",
                title: field.name,
                message: insight.alertMessage || "Kritik hava uyarısı var.",
                fieldId: field._id
            });
            return;
        }

        const irrigationText = (insight.irrigationMessage || "").toLowerCase();
        if (irrigationText.includes("bugün sulama önerilir")) {
            priorityItems.push({
                type: "warning",
                title: field.name,
                message: insight.irrigationMessage || "Bugün sulama öneriliyor.",
                fieldId: field._id
            });
        }
    });

    if (!priorityItems.length) {
        list.innerHTML = `<div class="empty-state">Şu anda öne çıkarılacak bir tarla bulunmuyor.</div>`;
        return;
    }

    priorityItems.forEach(item => {
        const card = document.createElement("div");
        card.className = `priority-card ${item.type}`;

        card.innerHTML = `
            <h4>${item.title}</h4>
            <p>${shortenText(item.message, 150)}</p>

            <div class="priority-actions">
                <button onclick="selectFieldFromCard('${item.fieldId}')">Tarlayı Düzenle</button>
                <button onclick="selectRecommendationFieldFromCard('${item.fieldId}')">Önerilere Git</button>
            </div>
        `;

        list.appendChild(card);
    });
}

function refreshAllDashboardData() {
    if (document.getElementById("fieldList")) {
        getFields();
    }

    if (document.getElementById("cropList") || document.getElementById("manageCropFieldSelect")) {
        getCrops();
    }
}

function getPolygonCenter(latlngs) {
    if (!latlngs || !latlngs.length) {
        return { lat: 0, lng: 0 };
    }

    let totalLat = 0;
    let totalLng = 0;

    latlngs.forEach(point => {
        totalLat += point.lat;
        totalLng += point.lng;
    });

    return {
        lat: totalLat / latlngs.length,
        lng: totalLng / latlngs.length
    };
}

function normalizePolygonPoints(latlngs) {
    return latlngs.map(point => ({
        lat: Number(point.lat),
        lng: Number(point.lng)
    }));
}

function updateMapSummary(summaryId, areaM2, center, pointCount) {
    const summary = document.getElementById(summaryId);
    if (!summary) return;

    summary.textContent = `Alan seçildi. Nokta sayısı: ${pointCount}, Merkez: ${center.lat.toFixed(6)}, ${center.lng.toFixed(6)}, Alan: ${Math.round(areaM2)} m²`;
}

function writePolygonToInputs(config, latlngs, areaM2) {
    const center = getPolygonCenter(latlngs);
    const normalized = normalizePolygonPoints(latlngs);

    document.getElementById(config.latInputId).value = center.lat;
    document.getElementById(config.lngInputId).value = center.lng;
    document.getElementById(config.areaInputId).value = Math.round(areaM2);
    document.getElementById(config.polygonInputId).value = JSON.stringify(normalized);

    updateMapSummary(config.summaryId, areaM2, center, normalized.length);
}

function clearMapStateSelection(state) {
    if (!state) return;

    state.drawnItems.clearLayers();

    document.getElementById(state.config.latInputId).value = "";
    document.getElementById(state.config.lngInputId).value = "";
    document.getElementById(state.config.areaInputId).value = "";
    document.getElementById(state.config.polygonInputId).value = "";

    const summary = document.getElementById(state.config.summaryId);
    if (summary) {
        summary.textContent = "Haritada poligon çizerek tarla alanını seçin.";
    }
}

function loadPolygonIntoMap(state, polygon) {
    if (!state) return;

    state.drawnItems.clearLayers();

    if (!polygon || !polygon.length) {
        return;
    }

    const latlngs = polygon.map(point => [point.lat, point.lng]);
    const layer = L.polygon(latlngs);
    state.drawnItems.addLayer(layer);

    state.map.fitBounds(layer.getBounds(), { padding: [20, 20] });

    const areaM2 = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
    writePolygonToInputs(state.config, layer.getLatLngs()[0], areaM2);
}

function createMapPicker(config) {
    if (typeof L === "undefined") return null;

    const map = L.map(config.mapId).setView([38.9637, 35.2433], 6);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
        edit: {
            featureGroup: drawnItems
        },
        draw: {
            polygon: true,
            polyline: false,
            rectangle: false,
            circle: false,
            marker: false,
            circlemarker: false
        }
    });

    map.addControl(drawControl);

    const state = {
        map,
        drawnItems,
        config
    };

    map.on(L.Draw.Event.CREATED, function (event) {
        drawnItems.clearLayers();

        const layer = event.layer;
        drawnItems.addLayer(layer);

        const latlngs = layer.getLatLngs()[0];
        const areaM2 = L.GeometryUtil.geodesicArea(latlngs);

        writePolygonToInputs(config, latlngs, areaM2);
    });

    map.on(L.Draw.Event.EDITED, function () {
        drawnItems.eachLayer(layer => {
            const latlngs = layer.getLatLngs()[0];
            const areaM2 = L.GeometryUtil.geodesicArea(latlngs);

            writePolygonToInputs(config, latlngs, areaM2);
        });
    });

    map.on(L.Draw.Event.DELETED, function () {
        document.getElementById(config.latInputId).value = "";
        document.getElementById(config.lngInputId).value = "";
        document.getElementById(config.areaInputId).value = "";
        document.getElementById(config.polygonInputId).value = "";

        const summary = document.getElementById(config.summaryId);
        if (summary) {
            summary.textContent = "Haritada poligon çizerek tarla alanını seçin.";
        }
    });

    return state;
}

function initFieldMaps() {
    if (typeof L === "undefined") return;

    if (document.getElementById("fieldMap") && !addFieldMapState) {
        addFieldMapState = createMapPicker({
            mapId: "fieldMap",
            summaryId: "fieldMapSummary",
            latInputId: "fieldLatitude",
            lngInputId: "fieldLongitude",
            areaInputId: "fieldArea",
            polygonInputId: "fieldPolygon"
        });
    }

    if (document.getElementById("updateFieldMap") && !updateFieldMapState) {
        updateFieldMapState = createMapPicker({
            mapId: "updateFieldMap",
            summaryId: "updateFieldMapSummary",
            latInputId: "updateFieldLatitude",
            lngInputId: "updateFieldLongitude",
            areaInputId: "updateFieldArea",
            polygonInputId: "updateFieldPolygon"
        });
    }
}

function clearFieldMapSelection() {
    clearMapStateSelection(addFieldMapState);
}

function clearUpdateFieldMapSelection() {
    clearMapStateSelection(updateFieldMapState);
}

function getQueryParam(param) {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
}

async function initFieldFormPage() {
    const fieldId = getQueryParam("id");
    const deleteButton = document.getElementById("fieldDeleteButton");
    const title = document.getElementById("fieldFormTitle");
    const subtitle = document.getElementById("fieldFormSubtitle");
    const heading = document.getElementById("fieldFormHeading");

    initFieldMaps();

    if (!fieldId) {
        if (deleteButton) deleteButton.classList.add("hidden");
        return;
    }

    const field = getFieldById(fieldId) || (await fetchFieldById(fieldId));
    if (!field) return;

    document.getElementById("fieldRecordId").value = field._id;
    document.getElementById("fieldName").value = field.name || "";
    document.getElementById("fieldLocation").value = field.location || "";
    document.getElementById("fieldLatitude").value = field.latitude ?? "";
    document.getElementById("fieldLongitude").value = field.longitude ?? "";
    document.getElementById("fieldArea").value = field.areaM2 ?? "";
    document.getElementById("fieldPolygon").value = JSON.stringify(field.polygon || []);
    document.getElementById("fieldIsGreenhouse").checked = !!field.isGreenhouse;

    if (title) title.textContent = "Tarla Düzenle";
    if (subtitle) subtitle.textContent = "Seçili tarlayı burada güncelleyebilir veya silebilirsin.";
    if (heading) heading.textContent = "Tarla Düzenle";

    if (deleteButton) deleteButton.classList.remove("hidden");

    if (addFieldMapState) {
        loadPolygonIntoMap(addFieldMapState, field.polygon || []);
    }
}

async function fetchFieldById(fieldId) {
    const response = await fetch(API_URL + "/fields?userId=" + currentUserId);
    const data = await response.json();
    if (!response.ok || !Array.isArray(data)) return null;
    fieldsCache = data;
    return data.find(field => field._id === fieldId) || null;
}

async function saveFieldForm() {
    const fieldId = document.getElementById("fieldRecordId").value;

    if (fieldId) {
        await updateFieldFromStandaloneForm(fieldId);
    } else {
        await addFieldFromStandaloneForm();
    }
}

async function addFieldFromStandaloneForm() {
    try {
        const name = document.getElementById("fieldName").value;
        const location = document.getElementById("fieldLocation").value;
        const latitude = document.getElementById("fieldLatitude").value;
        const longitude = document.getElementById("fieldLongitude").value;
        const areaM2 = document.getElementById("fieldArea").value;
        const isGreenhouse = document.getElementById("fieldIsGreenhouse").checked;
        const polygonRaw = document.getElementById("fieldPolygon").value;
        const polygon = polygonRaw ? JSON.parse(polygonRaw) : [];

        const response = await fetch(API_URL + "/fields", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: currentUserId,
                name,
                location,
                latitude,
                longitude,
                areaM2,
                isGreenhouse,
                polygon
            })
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.message || "Tarla eklenemedi.");

        showMessage(data.message || "Tarla eklendi.");
        window.location.href = "dashboard.html";
    } catch (error) {
        showMessage(error.message, true);
    }
}

async function updateFieldFromStandaloneForm(fieldId) {
    try {
        const name = document.getElementById("fieldName").value;
        const location = document.getElementById("fieldLocation").value;
        const latitude = document.getElementById("fieldLatitude").value;
        const longitude = document.getElementById("fieldLongitude").value;
        const areaM2 = document.getElementById("fieldArea").value;
        const isGreenhouse = document.getElementById("fieldIsGreenhouse").checked;
        const polygonRaw = document.getElementById("fieldPolygon").value;
        const polygon = polygonRaw ? JSON.parse(polygonRaw) : [];

        const response = await fetch(API_URL + "/fields/" + fieldId, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: currentUserId,
                name,
                location,
                latitude,
                longitude,
                areaM2,
                isGreenhouse,
                polygon
            })
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.message || "Tarla güncellenemedi.");

        showMessage(data.message || "Tarla güncellendi.");
        window.location.href = "dashboard.html";
    } catch (error) {
        showMessage(error.message, true);
    }
}

async function deleteFieldFromForm() {
    try {
        const fieldId = document.getElementById("fieldRecordId").value;
        if (!fieldId) throw new Error("Silinecek tarla bulunamadı.");

        const response = await fetch(API_URL + "/fields/" + fieldId + "?userId=" + currentUserId, {
            method: "DELETE"
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.message || "Tarla silinemedi.");

        showMessage(data.message || "Tarla silindi.");
        window.location.href = "dashboard.html";
    } catch (error) {
        showMessage(error.message, true);
    }
}

async function initCropFormPage() {
    const fieldId = getQueryParam("fieldId");
    const deleteButton = document.getElementById("cropDeleteButton");
    const title = document.getElementById("cropFormTitle");
    const subtitle = document.getElementById("cropFormSubtitle");
    const heading = document.getElementById("cropFormHeading");

    if (document.getElementById("cropFieldSelect")) {
        await getFields();
    }

    if (document.getElementById("cropList") || document.getElementById("cropFieldSelect")) {
        await getCrops();
    }

    if (!fieldId) {
        if (deleteButton) deleteButton.classList.add("hidden");
        return;
    }

    const crop = getCropByFieldId(fieldId);

    document.getElementById("cropFieldSelect").value = fieldId;

    if (!crop) {
        if (deleteButton) deleteButton.classList.add("hidden");
        return;
    }

    document.getElementById("cropRecordId").value = crop._id;
    document.getElementById("cropName").value = crop.name || "";
    document.getElementById("cropSowingDate").value = crop.sowingDate
        ? new Date(crop.sowingDate).toISOString().split("T")[0]
        : "";

    if (title) title.textContent = "Ürün Düzenle";
    if (subtitle) subtitle.textContent = "Seçili tarladaki ürünü burada güncelleyebilir veya silebilirsin.";
    if (heading) heading.textContent = "Ürün Düzenle";

    if (deleteButton) deleteButton.classList.remove("hidden");
}

async function saveCropForm() {
    const cropId = document.getElementById("cropRecordId").value;

    if (cropId) {
        await updateCropFromStandaloneForm(cropId);
    } else {
        await addCropFromStandaloneForm();
    }
}

async function addCropFromStandaloneForm() {
    try {
        const fieldId = document.getElementById("cropFieldSelect").value;
        const name = document.getElementById("cropName").value;
        const sowingDate = document.getElementById("cropSowingDate").value;

        const response = await fetch(API_URL + "/crops", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: currentUserId,
                name,
                fieldId,
                sowingDate
            })
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.message || "Ürün eklenemedi.");

        showMessage(data.message || "Ürün eklendi.");
        window.location.href = "dashboard.html";
    } catch (error) {
        showMessage(error.message, true);
    }
}

async function updateCropFromStandaloneForm(cropId) {
    try {
        const fieldId = document.getElementById("cropFieldSelect").value;
        const name = document.getElementById("cropName").value;
        const sowingDate = document.getElementById("cropSowingDate").value;

        const response = await fetch(API_URL + "/crops/" + cropId, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: currentUserId,
                name,
                fieldId,
                sowingDate
            })
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.message || "Ürün güncellenemedi.");

        showMessage(data.message || "Ürün güncellendi.");
        window.location.href = "dashboard.html";
    } catch (error) {
        showMessage(error.message, true);
    }
}

async function deleteCropFromForm() {
    try {
        const cropId = document.getElementById("cropRecordId").value;
        if (!cropId) throw new Error("Silinecek ürün bulunamadı.");

        const response = await fetch(API_URL + "/crops/" + cropId + "?userId=" + currentUserId, {
            method: "DELETE"
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.message || "Ürün silinemedi.");

        showMessage(data.message || "Ürün silindi.");
        window.location.href = "dashboard.html";
    } catch (error) {
        showMessage(error.message, true);
    }
}

function toggleRegisterPanel() {
    const panel = document.getElementById("registerPanel");
    if (!panel) return;

    panel.classList.toggle("hidden");
}

window.onload = async () => {
    const path = window.location.pathname;

    const isDashboardPage = path.includes("dashboard.html");
    const isAuthPage = path.includes("auth.html");
    const isProfilePage = path.includes("profile.html");
    const isFieldFormPage = path.includes("field-form.html");
    const isCropFormPage = path.includes("crop-form.html");

    if ((isDashboardPage || isProfilePage || isFieldFormPage || isCropFormPage) && !currentUserId) {
        window.location.href = "auth.html";
        return;
    }

    if (isAuthPage && currentUserId) {
        window.location.href = "dashboard.html";
        return;
    }

    if (isDashboardPage) {
        await getFields();
        await getCrops();
        await getProfile();
    }

    if (isProfilePage) {
        await getProfile();
    }

    if (isFieldFormPage) {
        await initFieldFormPage();
    }

    if (isCropFormPage) {
        await initCropFormPage();
    }
};