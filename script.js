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

// Utils
function showPopup(html, title = '') {
    const popup = document.getElementById('popup');
    document.getElementById('popup-title').textContent = title;
    document.getElementById('popup-body').innerHTML = html;
    popup.classList.add('show');

    popup.querySelector('.popup-close').onclick = () => popup.classList.remove('show');
}

function sendNotification(message, type = 'info') {
    const container = document.getElementById('notifications');
    const notif = document.createElement('div');
    notif.className = `notification ${type}`;
    notif.textContent = message;
    container.appendChild(notif);

    requestAnimationFrame(() => notif.classList.add('show'));

    setTimeout(() => {
        notif.classList.remove('show');
        notif.addEventListener('transitionend', () => notif.remove());
    }, 3000);
}

document.addEventListener('DOMContentLoaded', function() {
    username = me();

    const usernameText = document.getElementById('username');
    const playBtn = document.getElementById('play-btn');
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');

    if (username.length > 0) {
        loginBtn.style.display = 'none';
        signupBtn.style.display = 'none';
        usernameText.textContent = 'Logged in as ' + username;
    } else {
        usernameText.style.display = 'none';
        playBtn.style.display = 'none';
    }

    loginBtn.onclick = function() {
        showPopup(`
            <form id="login-form">
                <input type="text" id="login-username" placeholder="Username" required>
                <input type="password" id="login-password" placeholder="Password" required>    
                <button type="submit">Login</button>        
            </form>
        `);
    }

    signupBtn.onclick = function() {
        showPopup(`
            <form id="login-form">
                <input type="text" id="login-username" placeholder="Username" required>
                <input type="password" id="login-password" placeholder="Password" required>    
                <button type="submit">Sign up</button>        
            </form>
        `)
    }
});