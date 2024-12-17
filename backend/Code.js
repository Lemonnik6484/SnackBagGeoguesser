const database = JSON.parse(DriveApp.getFileById("1BzXngEDIhn975vLEImSMq8sraCmX1A12").getBlob().getDataAsString());

function return_output(success, message, data = {}) {
    return ContentService.createTextOutput(JSON.stringify({ success: success, message: message }))
        .setMimeType(ContentService.MimeType.JSON);
}

function registerUser(login, password) {
    if (login && password) {
        if (database[login]) {
            return_output(false, "Account already exists");
        } else {
            database[login] = {
                name: login,
                avatar: "#ffffff",
                password: password,
                token: "",
                tokenExpireDate: ""
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