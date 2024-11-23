import { POST } from "../networking.js"
import { showNotification } from "../notifications.js";

let login_switch = document.getElementById("login-switch");
let login_switch_text = document.getElementById("login-switch-text");
let login_title = document.getElementById("login-title");
let mode = "login";

function switchVar() {
    if (mode === "login") {
        mode = "register";
    } else {
        mode = "login";
    }
}

login_switch.addEventListener("click", (e) => {
    switchVar();

    if (mode === "login") {
        login_title.innerText = "Log in";
        login_switch_text.innerText = "Switch to register";
    } else {
        login_title.innerText = "Register";
        login_switch_text.innerText = "Switch to log in";
    }
})

document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const nickname = event.target[0].value;
    const password = event.target[1].value;

    if (nickname && password) {
        if (mode === "login") {
            POST("login", nickname, undefined, undefined, undefined, password);
        } else {
            POST("register", nickname, undefined, undefined, undefined, password);
        }
    } else {
        showNotification("failure", "Please fill out all fields!")
    }
});
