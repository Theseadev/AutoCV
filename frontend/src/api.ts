import type { Order } from "./cv";

// Vite dev server mem-proxy /api ke backend (lihat vite.config.ts)
const API_BASE = "/api";

export interface GeminiResponse {
	candidates?: Array<{
		content?: { parts?: Array<{ text?: string }> };
	}>;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Panggil Gemini lewat proxy backend (API key tidak bocor ke browser)
export async function callGeminiAPI(
	systemPrompt: string,
	userQuery: string,
	jsonSchema?: object,
): Promise<GeminiResponse> {
	let delay = 1000;
	for (let attempt = 0; attempt < 3; attempt++) {
		try {
			const response = await fetch(`${API_BASE}/generate`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ systemPrompt, userQuery, jsonSchema }),
			});
			if (!response.ok) {
				const err: { error?: string } = await response.json().catch(() => ({}));
				throw new Error(err.error || `HTTP error ${response.status}`);
			}
			return (await response.json()) as GeminiResponse; // respons Gemini apa adanya
		} catch (err) {
			if (attempt === 2) throw err;
			await sleep(delay);
			delay *= 2;
		}
	}
	throw new Error("unreachable");
}

export const getConfig = async (): Promise<{ waAdmin: string }> => {
	const res = await fetch(`${API_BASE}/config`);
	return res.json();
};

export const loginAdmin = async (
	password: string,
): Promise<{ token?: string; error?: string }> => {
	const res = await fetch(`${API_BASE}/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ password }),
	});
	return res.json();
};

export const getOrders = async (
	token: string,
): Promise<{ orders: Order[] }> => {
	const res = await fetch(`${API_BASE}/orders`, {
		headers: { Authorization: `Bearer ${token}` },
	});
	return res.json();
};

export const createOrder = async (order: Order): Promise<{ ok: boolean }> => {
	const res = await fetch(`${API_BASE}/orders`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(order),
	});
	return res.json();
};
