const SCRIPT_ID = "";
const API = `https://script.google.com/macros/s/${SCRIPT_ID}/exec`;
let name = "";
let avatar = "";

function showMessage(type, message) { // warning, success, error
    let notification = document.createElement("div");
    notification.classList.add("notification");
    notification.classList.add(type);
    notification.innerText = message;

    document.body.appendChild(notification);
    setTimeout(() => {
        notification.classList.add("show");
    }, 10);

    setTimeout(() => {
        notification.classList.add("hide");
        notification.addEventListener("transitionend", () => {
            notification.remove();
        });
    }, 3000);
}


function sendRegisterData(login, password) {
    fetch(`${API}?action=register`, {
        redirect: "follow",
        method: "POST",
        headers: {"Content-Type": "text/plain;charset=utf-8"},
        body: JSON.stringify({
            login: login,
            password: password
        })
    })
        .then(responce => responce.json())
        .then(data => {
            if (data.success) {
                localStorage.setItem("token", data.token);
                name = login;
                avatar = "#ffffff";
                showMessage("success", data.message);
            }
        })
        .catch(error => {
            console.error(error);
            showMessage("error", "Unknown error occurred")
        });
}

function sendLoginData(login, password) {
    fetch(`${API}?action=login&login=${login}&password=${password}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                avatar = data.avatar;
                name = data.name;
                localStorage.setItem("token", data.token);
                showMessage("success", data.message);
            } else {
                showMessage("error", data.message);
            }
        })
        .catch(error => {
            console.error(error);
            showMessage("error", "Unknown error occurred")
        })
}

function sendLoginToken(token) {
    fetch(`${API}?action=login&token=${token}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                avatar = data.avatar;
                name = data.name;
                showMessage("success", data.message);
            } else {
                showMessage("error", data.message);
            }
        })
        .catch(error => {
            console.error(error);
            showMessage("error", "Unknown error occurred")
        })
}

function sendNewAvatar(token, color) {
    fetch(`${API}?action=change-avatar&token=${token}&color=${color}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                avatar = color;
                showMessage("success", data.message);
            } else {
                showMessage("error", data.message);
            }
        })
        .catch(error => {
            console.error(error);
            showMessage("error", "Unknown error occurred")
        })
}

function sendNewName(token, newName) {
    fetch(`${API}?action=change-avatar&token=${token}&name=${newName}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                name = newName;
                showMessage("success", data.message);
            } else {
                showMessage("error", data.message);
            }
        })
        .catch(error => {
            console.error(error);
            showMessage("error", "Unknown error occurred")
        })
}

// ------------------------------------- //

if (localStorage.getItem("token")) {
    sendLoginToken(localStorage.getItem("token"));
}

