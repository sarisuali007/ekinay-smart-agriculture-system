const API_URL = "https://ekinay-smart-agriculture-system.onrender.com";
let currentUserId = localStorage.getItem("userId") || "";
let fieldsCache = [];
let cropsCache = [];

function showMessage(message, isError = false) {
  const box = document.getElementById("messageBox");
  box.textContent = message;
  box.style.color = isError ? "red" : "green";
}

async function register(){
    try {
        console.log("Kayıt fonksiyonu çağrıldı.");
        showMessage("Kayıt işlemi gerçekleştiriliyor...");

        const name = document.getElementById("registerName").value;
        const email = document.getElementById("registerEmail").value;
        const password = document.getElementById("registerPassword").value;

        const response = await fetch(API_URL + "/auth/register", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
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

async function login(){
    try {
        console.log("Giriş fonksiyonu çağrıldı.");
        showMessage("Giriş işlemi gerçekleştiriliyor...");

        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        const response = await fetch(API_URL + "/auth/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Giriş başarısız.");
        }

        currentUserId = data.user._id;
        localStorage.setItem("userId", currentUserId);

        showMessage(data.message);
        getProfile();
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

        const debugUserId = document.getElementById("debugUserId");
        if (debugUserId) {
            debugUserId.textContent = "Kullanıcı ID: " + (user._id || currentUserId);
        }

        showMessage("Profil bilgileri getirildi.");

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
    } 
    catch (error) {
        showMessage(error.message, true);
    }
}

function populateFieldSelects() {
    const selectIds = [
        "updateFieldSelect",
        "deleteFieldSelect",
        "cropFieldSelect",
        "updateCropFieldSelect",
        "irrigationFieldSelect",
        "alertFieldSelect"
    ];

    selectIds.forEach(id => {
        const select = document.getElementById(id);
        if (select) return;

        select.innerHTML = "<option value=''>Tarla seçiniz</option>";

        fieldsCache.forEach(field => {
            const option = document.createElement("option");
            option.value = field._id;
            option.textContent = `${field.name} - ${field.location}`;
            select.appendChild(option);
        });
    });
}

async function addField() {
  try {
    const name = document.getElementById("fieldName").value;
    const location = document.getElementById("fieldLocation").value;

    const response = await fetch(API_URL + "/fields", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, location })
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

    const list = document.getElementById("fieldList");
    if (list) {
        list.innerHTML = "";

        data.forEach(field => {
            const li = document.createElement("li");
            li.textContent = `${field.name} - ${field.location}`;
            list.appendChild(li);
        });
    }

    showMessage("Tarlalar getirildi.");

  } 
  catch (error) {
    showMessage(error.message, true);
  }
}

async function updateField() {
    try {
        const fieldId = document.getElementById("updateFieldSelect").value;
        const name = document.getElementById("updateFieldName").value;
        const location = document.getElementById("updateFieldLocation").value;

        const response = await fetch(API_URL + "/fields/" + fieldId, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, location })
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
        const fieldId = document.getElementById("deleteFieldSelect").value;
        
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
        "deleteCropSelect"
    ];

    SelectIds.forEach(id => {
        const select = document.getElementById(id);
        if (select) return;

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


async function addCrop(){
    try {
        const name = document.getElementById("cropName").value;
        const fieldId = document.getElementById("cropFieldSelect").value;

        const response = await fetch(API_URL + "/crops", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, fieldId })
        });

        const data = await response.json();

        if (response.ok) {
            getCrops();
        }

        if (!response.ok) {
            throw new Error(data.message || "Ürün eklenemedi.");
        }

        showMessage(data.message);

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
    } 
    catch (error) {
        showMessage(error.message, true);
    }
}        

async function updateCrop() {
    try {
        const cropId = document.getElementById("updateCropSelect").value;
        const name = document.getElementById("updateCropName").value;
        const fieldId = document.getElementById("updateCropFieldSelect").value;

        const response = await fetch(API_URL + "/crops/" + cropId, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, fieldId })
        });

        const data = await response.json();

        if (response.ok) {
            getCrops();
        }

        if (!response.ok) {
            throw new Error(data.message || "Ürün güncellenemedi.");
        }

        showMessage(data.message);
    } 
    catch (error) {
        showMessage(error.message, true);
    }
}

async function deleteCrop() {
    try {
        const cropId = document.getElementById("deleteCropSelect").value;
        
        const response = await fetch(API_URL + "/crops/" + cropId, {
            method: "DELETE"
        });

        const data = await response.json();

        if (response.ok) {
            getCrops();
        }

        if (!response.ok) {
            throw new Error(data.message || "Ürün silinemedi.");
        }

        showMessage(data.message);
    } 
    catch (error) {
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

window.onload = () => {
  getFields();
  getCrops();

  if(currentUserId) {
    getProfile();
  }

};