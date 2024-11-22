const postUrl = "https://script.google.com/macros/s/AKfycby5KaaewHvPBzrVb3luKjsH2JrEWn8sILLUVjiwZDR5ISPmsZw15ebEQwIu6VaYSVvK/exec"
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
        const payload = {
            action: action,
            nickname: nickname,
            password: password
        };
        fetch(postUrl, {
            redirect: "follow",
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8'
            },
            body: JSON.stringify(payload)
        })
        .then(response => {
            console.info("Request sent: " + JSON.stringify(payload));
            if (response) {
                console.info("Status: " + response.status);
                return response.json();
            }
        })
        .then(data => {
            console.log(data);
            if (data.status == "success") {
                return true;
            } else {
                return false;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        })
    }
    if (action != "login") {
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
            if (data.status === "failure") {
                alert(data.message);
            }
            console.info("Status: " + data.status + ". Msg: " + data.message)
        })
        .catch(error => {
            console.error('Error:', error);
        })
    }
}

export function GET_AccountData() {
    fetch(getUrl)
        .then(response => response.json())
        .then(data => {
            return data
        })
        .catch(error => {
            console.error(error);
        });
}