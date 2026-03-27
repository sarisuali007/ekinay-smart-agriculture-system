const API_URL = "https://ekinay-smart-agriculture-system.onrender.com";

async function register(){
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch(API_URL + "/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();
    console.log(data);
    alert(data.message);
}

async function login(){
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const response = await fetch(API_URL + "/auth/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    console.log(data);
    alert(data.message);
}

async function updateProfile() {
    const userId = document.getElementById("userId").value;
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

async function addField(){
    const name = document.getElementById("fieldName").value;
    const location = document.getElementById("fieldLocation").value;

    const response = await fetch(API_URL + "/fields", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ name, location })
    });

    const data = await response.json();
    console.log(data);
    alert(data.message);
}

async function getFields() {
    const response = await fetch(API_URL + "/fields");
    const data = await response.json();

    console.log("FIELDS DATA:", data);

    const list = document.getElementById("fieldList");
    list.innerHTML = "";

    data.forEach(field => {
        const li = document.createElement("li");
        li.textContent = field.name + " - " + field.location;
        list.appendChild(li);
    });
}

async function updateField() {
    const fieldId = document.getElementById("updateFieldId").value;
    const name = document.getElementById("updateFieldName").value;
    const location = document.getElementById("updateFieldLocation").value;

    const response = await fetch(API_URL + "/fields/" + fieldId, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, location })
    });

    const data = await response.json();
    console.log(data);
    alert(data.message);
}

async function deleteField() {
    const fieldId = document.getElementById("deleteFieldId").value;

    const response = await fetch(API_URL + "/fields/" + fieldId, {
        method: "DELETE"
    });

    const data = await response.json();
    console.log(data);
    alert(data.message);
}

async function addCrop(){
    const name = document.getElementById("cropName").value;
    const fieldId = document.getElementById("cropFieldId").value;

    const response = await fetch(API_URL + "/crops", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ name, fieldId })
    });

    const data = await response.json();
    console.log(data);
    alert(data.message);
}

async function updateCrop() {
    const cropId = document.getElementById("updateCropId").value;
    const name = document.getElementById("updateCropName").value;
    const fieldId = document.getElementById("updateCropFieldId").value;

    const response = await fetch(API_URL + "/crops/" + cropId, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, fieldId })
    });

    const data = await response.json();
    console.log(data);
    alert(data.message);
}

async function deleteCrop() {
    const cropId = document.getElementById("deleteCropId").value;

    const response = await fetch(API_URL + "/crops/" + cropId, {
        method: "DELETE"
    });

    const data = await response.json();
    console.log(data);
    alert(data.message);
}

async function getIrrigation() {
    const fieldId = document.getElementById("irrigationFieldId").value;

    const response = await fetch(API_URL + "/recommendations/irrigation/" + fieldId);
    const data = await response.json();

    console.log(data);
    alert(data.message);
}

async function getAlert() {
    const fieldId = document.getElementById("alertFieldId").value;

    const response = await fetch(API_URL + "/recommendations/alerts/" + fieldId);
    const data = await response.json();

    console.log(data);
    alert(data.message);
}