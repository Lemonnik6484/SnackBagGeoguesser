import { sha256 } from "crypto-hash";

async function createJWT(payload, secret) {
	const encoder = new TextEncoder();
	const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
	const body = btoa(JSON.stringify(payload));
	const data = `${header}.${body}`;
	const key = await crypto.subtle.importKey(
		"raw",
		encoder.encode(secret),
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["sign"]
	);
	const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
	const sigBase64 = btoa(String.fromCharCode(...new Uint8Array(signature)));
	return `${data}.${sigBase64}`;
}

async function verifyJWT(token, secret) {
	try {
		const [header, body, sig] = token.split(".");
		const encoder = new TextEncoder();
		const key = await crypto.subtle.importKey(
			"raw",
			encoder.encode(secret),
			{ name: "HMAC", hash: "SHA-256" },
			false,
			["verify", "sign"]
		);
		const signatureCheck = await crypto.subtle.sign("HMAC", key, encoder.encode(`${header}.${body}`));
		const sigBase64 = btoa(String.fromCharCode(...new Uint8Array(signatureCheck)));
		if (sigBase64 !== sig) return null;
		return JSON.parse(atob(body));
	} catch {
		return null;
	}
}

export default {
	async fetch(request, env) {
		const url = new URL(request.url);
		const { users_db } = env;

		// SIGNUP
		if (url.pathname === "/api/signup" && request.method === "POST") {
			const { username, password } = await request.json();
			const hash = await sha256(password);

			try {
				await users_db.prepare("INSERT INTO users (username, password_hash) VALUES (?, ?)")
					.bind(username, hash)
					.run();
				return new Response("Signup success", { status: 200 });
			} catch {
				return new Response("Username taken", { status: 400 });
			}
		}

		// LOGIN
		if (url.pathname === "/api/login" && request.method === "POST") {
			const { username, password } = await request.json();
			const user = await users_db.prepare("SELECT * FROM users WHERE username = ?")
				.bind(username)
				.first();
			const hash = await sha256(password);

			if (!user || user.password_hash !== hash) {
				return new Response("Invalid credentials", { status: 401 });
			}

			const token = await createJWT({ username }, env.SECRET);
			return new Response(JSON.stringify({ token }), {
				headers: { "Content-Type": "application/json" }
			});
		}

		// WHOIAM
		if (url.pathname === "/api/me") {
			const auth = request.headers.get("Authorization");
			if (!auth?.startsWith("Bearer ")) return new Response("No token", { status: 401 });

			const payload = await verifyJWT(auth.slice(7), env.SECRET);
			if (!payload) return new Response("Invalid token", { status: 401 });

			return new Response(JSON.stringify(payload), { headers: { "Content-Type": "application/json" } });
		}

		return new Response("Not found", { status: 404 });
	}
};
