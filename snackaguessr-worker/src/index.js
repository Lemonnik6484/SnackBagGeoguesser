import { sha256 } from 'crypto-hash';

export default {
	async fetch(request, env) {
		const url = new URL(request.url);
		const { pathname } = url;

		if (pathname === '/api/setup' && request.method === 'POST')
			return setup(request, env);
		if (pathname === '/api/signup' && request.method === 'POST')
			return signup(request, env);
		if (pathname === '/api/login' && request.method === 'POST')
			return login(request, env);
		if (pathname === '/api/me' && request.method === 'GET')
			return me(request, env);

		return cors(new Response('Not found', { status: 404 }));
	}
};

function cors(response) {
	response.headers.set("Access-Control-Allow-Origin", "*");
	response.headers.set("Access-Control-Allow-Headers", "*");
	response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
	return response;
}

async function setup(request, env) {
	try {
		await env.users_db.exec(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL, password TEXT NOT NULL);`);

		await env.users_db.exec(`CREATE TABLE IF NOT EXISTS sessions (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, token TEXT UNIQUE NOT NULL, created_at INTEGER NOT NULL, FOREIGN KEY(user_id) REFERENCES users(id));`);

		return new Response('Tables created or already exist', { status: 200 });
	} catch (err) {
		return new Response('DB setup error: ' + err.message, { status: 500 });
	}
}

async function signup(request, env) {
	const { username, password } = await request.json();
	if (!username || !password)
		return cors(new Response('Missing fields', { status: 400 }));

	const hashed = await sha256(password);
	try {
		await env.users_db.prepare(
			'INSERT INTO users (username, password) VALUES (?, ?)'
		).bind(username, hashed).run();
		return cors(new Response('OK', { status: 200 }));
	} catch {
		return cors(new Response('User exists', { status: 409 }));
	}
}

async function login(request, env) {
	const { username, password } = await request.json();
	if (!username || !password)
		return cors(new Response('Missing fields', { status: 400 }));

	const hashed = await sha256(password);
	const user = await env.users_db.prepare(
		'SELECT * FROM users WHERE username = ? AND password = ?'
	).bind(username, hashed).first();

	if (!user) return cors(new Response('Invalid credentials', { status: 401 }));

	const token = crypto.randomUUID();
	const now = Date.now();
	await env.users_db.prepare(
		'INSERT INTO sessions (user_id, token, created_at) VALUES (?, ?, ?)'
	).bind(user.id, token, now).run();

	return cors(Response.json({ token }));
}

async function me(request, env) {
	const token = request.headers.get('Authorization');
	if (!token) return cors(new Response('Unauthorized', { status: 401 }));

	const session = await env.users_db.prepare(
		`SELECT users.username
     FROM sessions JOIN users ON sessions.user_id = users.id
     WHERE token = ?`
	).bind(token).first();

	if (!session) return cors(new Response('Invalid token', { status: 401 }));
	return cors(Response.json(session));
}
