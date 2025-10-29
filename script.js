// AUTH
const backendUrl = 'http://localhost:8787';

function backend(endpoint) {
    return backendUrl + endpoint;
}

async function signup(username, password) {
    const res = await fetch(backend('/api/signup'), {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username: username, password: password})
    });
    if (res.status === 409) {
        return 'User exists';
    } else if (res.status === 200) {
        return 'OK';
    } else {
        return 'Unknown error: ' + res.status;
    }
}

async function login(username, password) {
    const res = await fetch(backend('/api/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username, password: password })
    });
    const { token } = await res.json();
    return token;
}

async function me(token) {
    await fetch(backend('/api/me'), {
        headers: { Authorization: token }
    });
}
