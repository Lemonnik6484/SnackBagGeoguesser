import { sha256 } from 'crypto-hash';

export default {
	async fetch(request, env) {
		if (request.method === 'OPTIONS')
			return cors(new Response(null, { status: 204 }));

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

		return cors(new Response(null, { status: 404 }));
	}
};

function cors(response) {
	const headers = new Headers(response.headers);
	headers.set("Access-Control-Allow-Origin", "*");
	headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
	headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers
	});
}

async function setup(request, env) {
	try {
		await env.users_db.exec(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL, password TEXT NOT NULL);`);

		await env.users_db.exec(`CREATE TABLE IF NOT EXISTS sessions (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, token TEXT UNIQUE NOT NULL, created_at INTEGER NOT NULL, FOREIGN KEY(user_id) REFERENCES users(id));`);

		return new Response(null, { status: 200, statusText: 'Tables created or already exist' });
	} catch (err) {
		return new Response(err.message, { status: 500, statusText: 'DB setup error' });
	}
}

async function signup(request, env) {
	const { username, password } = await request.json();
	if (!username || !password)
		return cors(new Response(null, { status: 400, statusText: 'Missing fields' }));

	const hashed = await sha256(password);
	try {
		await env.users_db.prepare(
			'INSERT INTO users (username, password) VALUES (?, ?)'
		).bind(username, hashed).run();

		/* LOGIN START */
		const user = await env.users_db.prepare(
			'SELECT * FROM users WHERE username = ? AND password = ?'
		).bind(username, hashed).first();

		if (!user) return cors(new Response(null, { status: 401, statusText: 'Invalid credentials' }));

		const token = crypto.randomUUID();
		const now = Date.now();
		await env.users_db.prepare(
			'INSERT INTO sessions (user_id, token, created_at) VALUES (?, ?, ?)'
		).bind(user.id, token, now).run();

		return cors(Response.json({ token }));
		/* LOGIN END */
	} catch {
		return cors(new Response(null, { status: 409, statusText: 'User exists' }));
	}
}

async function login(request, env) {
	const { username, password } = await request.json();
	if (!username || !password)
		return cors(new Response(null, { status: 400, statusText: 'Missing fields' }));

	const hashed = await sha256(password);
	const user = await env.users_db.prepare(
		'SELECT * FROM users WHERE username = ? AND password = ?'
	).bind(username, hashed).first();

	if (!user) return cors(new Response(null, { status: 401, statusText: 'Invalid credentials' }));

	const token = crypto.randomUUID();
	const now = Date.now();
	await env.users_db.prepare(
		'INSERT INTO sessions (user_id, token, created_at) VALUES (?, ?, ?)'
	).bind(user.id, token, now).run();

	return cors(Response.json({ token }));
}

async function me(request, env) {
	const token = request.headers.get('Authorization');
	if (!token) return cors(new Response(null, { status: 401, statusText: 'Missing token' }));

	const session = await env.users_db.prepare(
		`SELECT users.username
     FROM sessions JOIN users ON sessions.user_id = users.id
     WHERE token = ?`
	).bind(token).first();

	if (!session) return cors(new Response(null, { status: 401, statusText: 'Invalid token' }));
	return cors(Response.json(session));
}
