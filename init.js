import { loadToken } from "./accountManager.js"
import { POST } from "./networking.js";

export function INIT() {
    try {
        const accountData = loadToken();
        POST("login", accountData.nickname, undefined, undefined, undefined, accountData.password);
    } catch {
        return;
    }
}