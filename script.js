let username = '';

// AUTH
const backendUrl = 'http://localhost:8787';
const authToken = localStorage.getItem('token');

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

async function me() {
    if (!authToken) return;

    const res = await fetch(backend('/api/me'), {
        headers: { Authorization: authToken }
    });
    if (res.status === 401) {
        localStorage.removeItem('token');
    } else if (res.status === 200) {
        const { username } = await res.json();
        return username;
    } else {
        return 'Unknown error: ' + res.status;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    username = me();

    const playBtn = document.getElementById('play-btn');
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');

    if (username.length > 0) {
        loginBtn.style.display = 'none';
        signupBtn.style.display = 'none';
    } else {
        playBtn.style.display = 'none';
    }
});