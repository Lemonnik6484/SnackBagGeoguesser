import { GET_AccountData } from "./networking.js";

export function saveToken(nickname, password) {
    const encodedNickname = btoa(nickname);
    const encodedPassword = btoa(password);
    localStorage.setItem("token", `${encodedNickname}|${encodedPassword}`);
}

export function fastLoadAccount() {
    let account_data = document.getElementById("account-data");
    let character = document.getElementById("character");

    let local_nickname = localStorage.getItem("nickname");
    let local_character = localStorage.getItem("character");
    if (local_nickname && local_character) {
        account_data.innerHTML = `
            <a href="./users/?user=me">
                <div id="account">
                    <img src="./characters/${local_character || ''}.png" id="avatar" alt="Avatar"><p id="Nickname">${local_nickname}</p>
                </div>
            </a>
        `;
        character.src = `./characters/${local_character}.png`;
    }
}

export async function loadAccount(nickname) {
    let account_data = document.getElementById("account-data");
    let character = document.getElementById("character");

    try {
        const data = await GET_AccountData(nickname);
        if (!data) {
            console.error("User not found");
            return;
        }

        account_data.innerHTML = `
            <a href="./users/?user=me">
                <div id="account">
                    <img src="./characters/${data[1] || ''}.png" id="avatar" alt="Avatar"><p id="Nickname">${data[0]}</p>
                </div>
            </a>
        `;

        character.src = `./characters/${data[1]}.png`;

        localStorage.setItem("character", data[1]);
        localStorage.setItem("nickname", data[0]);
    } catch (error) {
        console.error("Failed to load account:", error);
    }
}

export function loadToken() {
    const token = localStorage.getItem("token");
    const [encodedNickname, encodedPassword] = token.split('|');
    const nickname = atob(encodedNickname);
    const password = atob(encodedPassword);
    return { nickname: nickname, password: password };
}
