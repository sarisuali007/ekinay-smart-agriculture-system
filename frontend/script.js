const API_URL = "https://ekinay-smart-agriculture-system.onrender.com";

function showMessage(message, isError = false) {
  const box = document.getElementById("messageBox");
  box.textContent = message;
  box.style.color = isError ? "red" : "green";
}

async function register(){
    try {
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

        showMessage(data.message);

    } 
    catch (error) {
        showMessage(error.message, true);
    }
}

async function updateProfile() {
    try {
        const name = document.getElementById("updateName").value;
        const email = document.getElementById("updateEmail").value;
        const password = document.getElementById("updatePassword").value;

        const response = await fetch(API_URL + "/users/" + userId, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();
        console.log(data);
        alert(data.message);
    } 
    catch (error) {
        showMessage(error.message, true);
    }

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

    const list = document.getElementById("fieldList");
    list.innerHTML = "";

    data.forEach(field => {
      const li = document.createElement("li");
      li.textContent = `${field.name} - ${field.location}`;
      list.appendChild(li);
    });
  } 
  catch (error) {
    showMessage("Tarlalar getirilemedi.", true);
  }
}

async function updateField() {
    try {
        const fieldId = document.getElementById("updateFieldId").value;
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
        const fieldId = document.getElementById("deleteFieldId").value;
        
        const response = await fetch(API_URL + "/fields/" + fieldId, {
            method: "DELETE"
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Tarla silinemedi.");
        }

        showMessage(data.message);
        getFields();
    } 
    catch (error) {
        showMessage(error.message, true);
    }

}

async function addCrop(){
    try {
        const name = document.getElementById("cropName").value;
        const fieldId = document.getElementById("cropFieldId").value;

        const response = await fetch(API_URL + "/crops", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, fieldId })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Ürün eklenemedi.");
        }

        showMessage(data.message);

    } 
    catch (error) {
        showMessage(error.message, true);
    }
}

async function updateCrop() {
    try {
        const cropId = document.getElementById("updateCropId").value;
        const name = document.getElementById("updateCropName").value;
        const fieldId = document.getElementById("updateCropFieldId").value;

        const response = await fetch(API_URL + "/crops/" + cropId, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, fieldId })
        });

        const data = await response.json();

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
        const cropId = document.getElementById("deleteCropId").value;
        
        const response = await fetch(API_URL + "/crops/" + cropId, {
            method: "DELETE"
        });

        const data = await response.json();

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
        const fieldId = document.getElementById("irrigationFieldId").value;

        const response = await fetch(API_URL + "/recommendations/irrigation/" + fieldId);
        const data = await response.json();

        console.log(data);
        alert(data.message);
    } 
    catch (error) {
        showMessage(error.message, true);
    }

}

async function getAlert() {
    try {
        const fieldId = document.getElementById("alertFieldId").value;

        const response = await fetch(API_URL + "/recommendations/alerts/" + fieldId);
        const data = await response.json();

        console.log(data);
        alert(data.message);
    }
    catch (error) {
        showMessage(error.message, true);
    }
}

window.onload = () => {
  getFields();
};