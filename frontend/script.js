const API_URL = "https://ekinay-smart-agriculture-system.onrender.com";
let currentUserId = localStorage.getItem("userId") || "";
let fieldsCache = [];
let cropsCache = [];
let alertTickerItems = [];
let fieldInsightsCache = {};

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

    if (!cropsCache.length) {
        list.innerHTML = `<div class="empty-state">Henüz kayıtlı ürün bulunmuyor. Önce bir tarla seçip ürün ekleyin.</div>`;
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
                <button class="crop-card-action-btn primary" onclick="selectCropFromCard('${fieldId}')">
                    Bu Ürünü Düzenle
                </button>

                <button class="crop-card-action-btn" onclick="selectFieldFromCard('${fieldId}')">
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
                <button class="field-card-action-btn primary" onclick="selectFieldFromCard('${field._id}')">
                    Bu Tarlayı Düzenle
                </button>

                <button class="field-card-action-btn" onclick="selectCropFieldFromCard('${field._id}')">
                    Bu Tarlanın Ürününe Git
                </button>

                <button class="field-card-action-btn" onclick="selectRecommendationFieldFromCard('${field._id}')">
                    Önerileri Gör
                </button>
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
        const irrigationResponse = await fetch(API_URL + "/recommendations/irrigation/" + fieldId);
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
        const alertResponse = await fetch(API_URL + "/recommendations/alerts/" + fieldId);
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

        const response = await fetch(API_URL + "/fields", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name,
                location,
                latitude,
                longitude,
                areaM2,
                isGreenhouse
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
        const response = await fetch(API_URL + "/fields");
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
        return;
    }

    document.getElementById("updateFieldName").value = field.name || "";
    document.getElementById("updateFieldLocation").value = field.location || "";
    document.getElementById("updateFieldLatitude").value = field.latitude ?? "";
    document.getElementById("updateFieldLongitude").value = field.longitude ?? "";
    document.getElementById("updateFieldArea").value = field.areaM2 ?? "";
    document.getElementById("updateFieldIsGreenhouse").checked = !!field.isGreenhouse;
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

        const response = await fetch(API_URL + "/fields/" + fieldId, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name,
                location,
                latitude,
                longitude,
                areaM2,
                isGreenhouse
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

        const response = await fetch(API_URL + "/fields/" + fieldId, {
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
            body: JSON.stringify({ name, fieldId, sowingDate })
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
        const response = await fetch(API_URL + "/crops");
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
            body: JSON.stringify({ name, fieldId, sowingDate })
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

        const response = await fetch(API_URL + "/crops/" + crop._id, {
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

window.onload = () => {
    const authSection = document.getElementById("authSection");
    const appSection = document.getElementById("appSection");

    if (document.getElementById("fieldList")) {
        getFields();
    }

    if (document.getElementById("manageCropFieldSelect") || document.getElementById("cropList")) {
        getCrops();
    }

    const isDashboardPage = window.location.pathname.includes("dashboard.html");
    const isAuthPage = window.location.pathname.includes("auth.html");

    if (isDashboardPage && !currentUserId) {
        window.location.href = "auth.html";
        return;
    }

    if (isAuthPage && currentUserId) {
        window.location.href = "dashboard.html";
        return;
    }

    if (currentUserId) {
        if (document.getElementById("updateName")) {
            getProfile();
        }

        if (appSection) {
            showAppSection();
        }
    } else {
        if (authSection) {
            showAuthSection();
        }
    }
};