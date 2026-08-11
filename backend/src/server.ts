import { createHash } from "node:crypto";
import cors from "cors";
import express from "express";
import "dotenv/config";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = join(__dirname, "../data/orders.json");
const FRONTEND_DIST = join(__dirname, "../../frontend/dist");
const MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";
const WA_ADMIN = process.env.WA_ADMIN || "628000000000";

if (!process.env.GEMINI_API_KEY)
	console.warn(
		"⚠ GEMINI_API_KEY kosong — fitur AI tidak berfungsi. Isi di backend/.env",
	);
if (!ADMIN_PASSWORD)
	console.warn(
		"⚠ ADMIN_PASSWORD kosong — rute admin ditutup. Isi di backend/.env",
	);

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// --- Keamanan -----------------------------------------------------------------
// Token stateless: hash password. Ganti password = semua token lama hangus.
const adminToken = () =>
	createHash("sha256").update(ADMIN_PASSWORD).digest("hex");

const requireAdmin: express.RequestHandler = (req, res, next) => {
	const auth = req.headers.authorization || "";
	if (ADMIN_PASSWORD && auth === `Bearer ${adminToken()}`) return next();
	res.status(401).json({ error: "Unauthorized" });
};

// ponytail: rate limit per-IP in-memory, single-process. Pakai Redis bila multi-instance.
const hits = new Map<string, number[]>();
const rateLimit =
	(limit: number, windowMs: number): express.RequestHandler =>
	(req, res, next) => {
		const ip = req.ip || "unknown";
		const now = Date.now();
		const arr = (hits.get(ip) || []).filter((t) => now - t < windowMs);
		if (arr.length >= limit)
			return res
				.status(429)
				.json({ error: "Terlalu banyak permintaan. Coba lagi beberapa saat." });
		arr.push(now);
		hits.set(ip, arr);
		next();
	};

// --- Konfigurasi publik (nomor WA admin, dsb.) --------------------------------
app.get("/api/config", (_req, res) => res.json({ waAdmin: WA_ADMIN }));

// --- Admin login ---------------------------------------------------------------
app.post("/api/login", (req, res) => {
	if (!ADMIN_PASSWORD)
		return res
			.status(503)
			.json({ error: "ADMIN_PASSWORD belum diatur di backend/.env" });
	const { password } = req.body ?? {};
	if (password === ADMIN_PASSWORD) return res.json({ token: adminToken() });
	res.status(401).json({ error: "Password salah" });
});

// --- Proxy ke Gemini (API key hanya di server) ------------------------------
app.post("/api/generate", rateLimit(15, 60_000), async (req, res) => {
	const apiKey = process.env.GEMINI_API_KEY;
	if (!apiKey) {
		return res
			.status(500)
			.json({ error: "GEMINI_API_KEY belum diatur di backend/.env" });
	}
	const { systemPrompt, userQuery, jsonSchema } = req.body ?? {};

	const payload: Record<string, unknown> = {
		contents: [{ parts: [{ text: userQuery }] }],
		systemInstruction: { parts: [{ text: systemPrompt }] },
	};
	if (jsonSchema) {
		payload.generationConfig = {
			responseMimeType: "application/json",
			responseSchema: jsonSchema,
		};
	}

	const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(MODEL)}:generateContent?key=${encodeURIComponent(apiKey)}`;
	try {
		const r = await fetch(url, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});
		const data = await r.json();
		res.status(r.status).json(data);
	} catch (err) {
		res.status(502).json({
			error:
				"Gagal terhubung ke Gemini API: " +
				(err instanceof Error ? err.message : String(err)),
		});
	}
});

// --- Orders (penyimpanan JSON file) ------------------------------------------
function readOrders(): unknown[] {
	return existsSync(DATA_FILE)
		? JSON.parse(readFileSync(DATA_FILE, "utf8"))
		: [];
}
function writeOrders(orders: unknown[]): void {
	mkdirSync(dirname(DATA_FILE), { recursive: true });
	writeFileSync(DATA_FILE, JSON.stringify(orders, null, 2));
}

app.get("/api/orders", requireAdmin, (_req, res) => {
	res.json({ orders: readOrders() });
});

app.post("/api/orders", (req, res) => {
	const body = req.body ?? {};
	if (!body.id || !body.name) {
		return res.status(422).json({ error: "Field id dan name wajib diisi" });
	}
	const order = {
		...body,
		status: body.status ?? "Menunggu WA",
		created_at: new Date().toISOString(),
	};
	const orders = readOrders();
	orders.unshift(order);
	writeOrders(orders);
	res.json({ ok: true, order });
});

// --- Statik frontend hasil build (opsional, untuk production) ----------------
if (existsSync(FRONTEND_DIST)) {
	app.use(express.static(FRONTEND_DIST));
}

const PORT = Number(process.env.PORT || 3001);
app.listen(PORT, () =>
	console.log(`AIGen CV backend: http://localhost:${PORT}`),
);
