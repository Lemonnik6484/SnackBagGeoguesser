const database = JSON.parse(DriveApp.getFileById("1BzXngEDIhn975vLEImSMq8sraCmX1A12").getBlob().getDataAsString());

const TOKEN_EXPIRATION_TIME = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// Utilities

function return_output(success, message, data = {}) {
    return ContentService.createTextOutput(JSON.stringify({ success: success, message: message, data: data }))
        .setMimeType(ContentService.MimeType.JSON);
}

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
            return return_output(false, "Account already exists");
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
            return return_output(true, "Account created successfully", {token: database[login].token});
        }
    } else {
        return return_output(false, "Invalid request");
    }
}

function changeAvatar(token, color) {
    if (token) {
        Object.arguments(database).forEach((user) => {
            if (user["token"] === token) {
                if (isTokenExpired(user)) {
                    return return_output(false, "Session expired");
                } else {
                    user["avatar"] = color;
                    return return_output(true, "Avatar color changed");
                }
            }
        });
        
    } else {
        return return_output(false, "Invalid request");
    }
}

function changeName(token, name) {
    if (token) {
        Object.arguments(database).forEach((user) => {
            if (user["token"] === token) {
                if (isTokenExpired(user)) {
                    return return_output(false, "Session expired");
                } else {
                    return return_output(true, "Avatar color changed");
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
            return return_output(false, "Invalid action");
    }
}

// Get functions

function loginUser(login = null, password = null, token = null) {
    if (token) {
        Object.arguments(database).forEach((user) => {
            if (user["token"] === token) {
                user["tokenExpirationDate"] = new Date().getTime() + TOKEN_EXPIRATION_TIME;
                if (isTokenExpired(user)) {
                    return return_output(false, "Session expired");
                } else {
                    return return_output(true, "Auto login successfull", {
                        avatar: user["avatar"],
                        name: user["name"]
                    });
                }
            }
        })
    } else {
        if (login && password) {
            Object.arguments(database).forEach((user) => {
                if (user.login === login && user.password === password) {
                    database[user]["token"] = generateUuid();
                    database[user]["tokenExpirationDate"] = new Date().getTime() + TOKEN_EXPIRATION_TIME;
                    return return_output(true, "Login successfull", {
                        avatar: database[user]["avatar"],
                        name: database[user]["name"],
                        token: database[user]["token"]
                    });
                } else {
                    return return_output(false, "Invalid password or login");
                }
            });
        } else {
            return return_output(false, "Invalid login data");
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
            return return_output(false, "Invalid action");
    }
}