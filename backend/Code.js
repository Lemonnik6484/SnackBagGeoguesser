const database = JSON.parse(DriveApp.getFileById("1BzXngEDIhn975vLEImSMq8sraCmX1A12").getBlob().getDataAsString());

const TOKEN_EXPIRATION_TIME = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// Utilities

function generateUuid() {
    return Utilities.getUuid();
}

function isTokenExpired(user) {
    if (!user.token) return true;

    const currentDate = new Date().getTime();
    const expirationDate = user.tokenExpirationDate;
    return currentDate > expirationDate;
}

// Post functions

function registerUser(login, password) {
    if (login && password) {
        if (database[login]) {
            return ContentService.createTextOutput(JSON.stringify({ success: false, message: "Account already exists"}))
                .setMimeType(ContentService.MimeType.JSON);
        } else {
            const uuid = generateUuid();
            const token = generateUuid();
            const tokenExpireDate = new Date().getTime() + TOKEN_EXPIRATION_TIME;
            database[uuid] = {
                name: login,
                avatar: "#ffffff",
                password: password,
                token: token,
                tokenExpirationDate: tokenExpireDate
            }
            return ContentService.createTextOutput(JSON.stringify({ success: true, message: "Account created successfully", token: database[login].token }))
                .setMimeType(ContentService.MimeType.JSON);
        }
    } else {
        return ContentService.createTextOutput(JSON.stringify({ success: false, message: "Invalid request" }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

function changeAvatar(token, color) {
    if (token) {
        Object.arguments(database).forEach((user) => {
            if (user["token"] === token) {
                if (isTokenExpired(user)) {
                    return ContentService.createTextOutput(JSON.stringify({ success: false, message: "Session expired" }))
                        .setMimeType(ContentService.MimeType.JSON);
                } else {
                    user["avatar"] = color;
                    return ContentService.createTextOutput(JSON.stringify({ success: true, message: "Avatar color changed" }))
                        .setMimeType(ContentService.MimeType.JSON);
                }
            }
        });
        
    } else {
        return ContentService.createTextOutput(JSON.stringify({ success: false, message: "Invalid request" }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

function changeName(token, name) {
    if (token) {
        Object.arguments(database).forEach((user) => {
            if (user["token"] === token) {
                if (isTokenExpired(user)) {
                    return ContentService.createTextOutput(JSON.stringify({ success: false, message: "Session expired" }))
                        .setMimeType(ContentService.MimeType.JSON);
                } else {
                    return ContentService.createTextOutput(JSON.stringify({ success: true, message: "Avatar color changed" }))
                        .setMimeType(ContentService.MimeType.JSON);
                }
            }
        })
    }
}

function doPost(e) {
    const action = e.parameter.action;
    const payload = JSON.parse(e.postData.contents || "{}");

    switch (action) {
        case "register":
            registerUser(payload["login"], payload["password"]);
            break;
        case "change-avatar":
            changeAvatar(payload["token"], payload["color"]);
            break;
        case "change-name":
            changeName(payload["token"], payload["name"]);
            break;
        default:
            return ContentService.createTextOutput(JSON.stringify({ success: false, message: "Invalid action" }))
                .setMimeType(ContentService.MimeType.JSON);
    }
}

// Get functions

function loginUser(login = null, password = null, token = null) {
    if (token) {
        Object.arguments(database).forEach((user) => {
            if (user["token"] === token) {
                user["tokenExpirationDate"] = new Date().getTime() + TOKEN_EXPIRATION_TIME;
                if (isTokenExpired(user)) {
                    return ContentService.createTextOutput(JSON.stringify({ success: false, message: "Session expired" }))
                        .setMimeType(ContentService.MimeType.JSON);
                } else {
                    return ContentService.createTextOutput(JSON.stringify({ success: true, message: "Session continued", avatar: user["avatar"], name: user["name"] }))
                        .setMimeType(ContentService.MimeType.JSON);
                }
            }
        })
    } else {
        if (login && password) {
            Object.arguments(database).forEach((user) => {
                if (user.login === login && user.password === password) {
                    database[user]["token"] = generateUuid();
                    database[user]["tokenExpirationDate"] = new Date().getTime() + TOKEN_EXPIRATION_TIME;
                    return ContentService.createTextOutput(JSON.stringify({ success: true, message: "Login successfull", avatar: database[user]["avatar"], name: database[user]["name"], token: database[user]["token"] }))
                        .setMimeType(ContentService.MimeType.JSON);
                } else {
                    return ContentService.createTextOutput(JSON.stringify({ success: false, message: "Invalid login or password" }))
                        .setMimeType(ContentService.MimeType.JSON);
                }
            });
        } else {
            return ContentService.createTextOutput(JSON.stringify({ success: false, message: "Invalid login data" }))
                .setMimeType(ContentService.MimeType.JSON);
        }
    }
}

function doGet(e) {
    const action = e.parameter.action;
    const payload = JSON.parse(e.postData.contents || "{}");

    switch (action) {
        case "login":
            payload["token"] ?
                loginUser(null, null, payload["token"]):
                loginUser(payload["login"], payload["password"], null);
            break;
        default:
            return ContentService.createTextOutput(JSON.stringify({ success: false, message: "Invalid action" }))
                .setMimeType(ContentService.MimeType.JSON);
    }
}