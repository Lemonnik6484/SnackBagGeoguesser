let Username = '';

// AUTH
const backendUrl = 'http://localhost:8787';
let authToken = localStorage.getItem('token');

function backend(endpoint) {
    return backendUrl + endpoint;
}

async function signup(username, password) {
    const res = await fetch(backend('/api/signup'), {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username: username, password: password})
    });
    if (res.status === 200) {
        const {token} = await res.json();
        localStorage.setItem('token', token);
        return res;
    } else {
        return res;
    }
}

async function login(username, password) {
    const res = await fetch(backend('/api/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username, password: password })
    });
    if (res.status === 200) {
        const { token } = await res.json();
        localStorage.setItem('token', token);
        return res;
    } else {
        return res;
    }
}

async function me() {
    if (!authToken) return;

    const res = await fetch(backend('/api/me'), {
        headers: { Authorization: authToken }
    });
    if (res.status === 401) {
        Username = '';
        localStorage.removeItem('token');
        return res;
    } else if (res.status === 200) {
        const { username } = await res.json();
        Username = username;
        return res;
    } else {
        return res;
    }
}

// Utils
function showPopup(html, title = '') {
    const popup = document.getElementById('popup');
    document.getElementById('popup-title').textContent = title;
    document.getElementById('popup-body').innerHTML = html;
    popup.classList.add('show');

    popup.querySelector('.popup-close').onclick = () => popup.classList.remove('show');

    return popup;
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

async function load() {
    authToken = localStorage.getItem('token');

    await me().then();

    const usernameText = document.getElementById('username');
    const playBtn = document.getElementById('play-btn');
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');

    if (Username.length > 0) {
        usernameText.textContent = 'Logged in as ' + Username;
        playBtn.style.display = 'block';
        loginBtn.style.display = 'none';
        signupBtn.style.display = 'none';
    } else {
        usernameText.style.display = 'none';
        playBtn.style.display = 'none';
        loginBtn.style.display = 'block';
        signupBtn.style.display = 'block';
    }

    loginBtn.onclick = function () {
        let popup = showPopup(`
            <form id="login-form">
                <input type="text" id="login-username" placeholder="Username" required>
                <input type="password" id="login-password" placeholder="Password" required>    
                <button type="submit">Login</button>        
            </form>
        `);

        const form = document.getElementById('login-form');
        form.onsubmit = (e) => {
            e.preventDefault();
            const usr = document.getElementById('login-username').value;
            const pass = document.getElementById('login-password').value;
            login(usr, pass).then(r => {
                if (r.status === 200) {
                    sendNotification(r.statusText, 'success');
                    popup.classList.remove('show');
                    load();
                } else {
                    sendNotification(r.statusText, 'error');
                }
            });
        };
    }

    signupBtn.onclick = function () {
        let popup = showPopup(`
            <form id="login-form">
                <input type="text" id="login-username" placeholder="Username" required>
                <input type="password" id="login-password" placeholder="Password" required>    
                <button type="submit">Sign up</button>        
            </form>
        `)

        const form = document.getElementById('login-form');
        form.onsubmit = (e) => {
            e.preventDefault();
            const usr = document.getElementById('login-username').value;
            const pass = document.getElementById('login-password').value;
            signup(usr, pass).then(r => {
                if (r.status === 200) {
                    sendNotification(r.statusText, 'success');
                    popup.classList.remove('show');
                    load();
                } else {
                    sendNotification(r.statusText, 'error');
                }
            });
        };
    }
}

document.addEventListener('DOMContentLoaded', function() {
    load().then();
});