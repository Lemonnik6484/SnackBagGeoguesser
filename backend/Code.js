const database = JSON.parse(DriveApp.getFileById("1BzXngEDIhn975vLEImSMq8sraCmX1A12").getBlob().getDataAsString());

const TOKEN_EXPIRATION_TIME = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// Utilities

function return_output(success, message, data = {}) {
    return ContentService.createTextOutput(JSON.stringify({ success: success, message: message, data: data }))
        .setMimeType(ContentService.MimeType.JSON);
}

function generateToken() {
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
            return_output(false, "Account already exists");
        } else {
            const token = generateToken();
            const tokenExpireDate = new Date().getTime() + TOKEN_EXPIRATION_TIME;
            database[login] = {
                name: login,
                avatar: "#ffffff",
                password: password,
                token: token,
                tokenExpirationDate: tokenExpireDate
            }
            return_output(true, "Account created successfully", {token: database[login].token});
        }
    } else {
        return_output(false, "Invalid request");
    }
}

function doPost(e) {
    const action = e.parameter.action;
    const payload = JSON.parse(e.postData.contents || "{}");

    switch (action) {
        case "register":
            registerUser(payload["login"], payload["password"]);
    }
}