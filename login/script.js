import { POST, GET_AccountData } from "../networking.js"

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
            const logged = POST("login", nickname, undefined, undefined, undefined, password);
            if (logged) {
                localStorage.setItem("token", btoa(nickname)+"|"+btoa(password))
            }
        } else {
            POST("register", nickname, undefined, undefined, undefined, password);
            const logged = POST("login", nickname, undefined, undefined, undefined, password);
            if (logged) {
                localStorage.setItem("token", btoa(nickname)+"|"+btoa(password))
            }
        }
    } else {
        alert('Please fill out all fields');
    }
});
