import { showNotification } from "../notifications.js";
import { saveToken, loadAccount, fastLoadAccount } from "./accountManager.js";

const postUrl = "https://script.google.com/macros/s/AKfycbyim_G5k_PgBK7qY1j24iduboG8Q-4vKAnA4802zmm1wQMVbtERqSuLh8y6ztGKSJpA/exec"
const getUrl = "https://sheets.googleapis.com/v4/spreadsheets/1tqE0Lic-eZLNRyEnTQwzhLq5fn5GePkjipkrlK-nNTw/values/Database!A2:D500?key=AIzaSyC7opujheDheDJagCtkg9PGJNNariKwWrE"

export function POST(action = '', nickname = '', character = '', level = 1, xp = 0, password = '') {
    if (action === "register") {
        var payload = {
            action: action,
            nickname: nickname,
            password: password
        };
    } else if (action === "levelup") {
        var payload = {
            action: action,
            level: level,
            xp: xp
        };
    } else if (action === "character") {
        var payload = {
            action: action, 
            character: character
        };
    } else if (action === "login") {
        var payload = {
            action: action,
            nickname: nickname,
            password: password
        };
    }
    if (action) {
        fetch(postUrl, {
            redirect: "follow",
            method: "POST",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify(payload)
        })
        .then(response => {
            console.info("Request sent: " + JSON.stringify(payload));
            if (response) {
                console.info("Status: " + response.status)
                return response.json();
            }
        })
        .then(data => {
            console.log(data)
            if (data) {
                showNotification(data.status, data.message);
                if (data.status === "success" && action === "login") {
                    saveToken(payload.nickname, payload.password);
                    fastLoadAccount();
                    loadAccount(payload.nickname);
                }
            } else {
                showNotification("failure", "Unknown error occurred!")
            }
            console.info("Status: " + data.status + ". Msg: " + data.message)
        })
        .catch(error => {
            console.error('Error:', error);
        })
    }
}

export function GET_AccountData(nickname) {
    return fetch(getUrl)
        .then(response => response.json())
        .then(data => {
            const row = data.values.find(row => row[0] === nickname);
            return row || null;
        })
        .catch(error => {
            console.error(error);
            throw error;
        });
}
