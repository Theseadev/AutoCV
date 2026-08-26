import type { Order } from "./cv";
import { supabase } from "./lib/supabase";

export interface GeminiResponse {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
  }>;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Panggil Gemini via Supabase Edge Function (API key aman di server)
export async function callGeminiAPI(
  systemPrompt: string,
  userQuery: string,
  jsonSchema?: object,
): Promise<GeminiResponse> {
  let delay = 1000;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const { data, error } = await supabase.functions.invoke("gemini-proxy", {
        body: { systemPrompt, userQuery, jsonSchema },
      });
      if (error) throw new Error(error.message);
      return data as GeminiResponse;
    } catch (err) {
      if (attempt === 2) throw err;
      await sleep(delay);
      delay *= 2;
    }
  }
  throw new Error("unreachable");
}

// Ambil nomor WA admin dari config table (public read)
export const getConfig = async (): Promise<{ waAdmin: string }> => {
  const { data, error } = await supabase
    .from("config")
    .select("value")
    .eq("key", "wa_admin")
    .single();
  if (error || !data) return { waAdmin: "628000000000" };
  return { waAdmin: data.value };
};

// Login admin via Edge Function (verify password hash)
export const loginAdmin = async (
  password: string,
): Promise<{ token?: string; error?: string }> => {
  const { data, error } = await supabase.functions.invoke("admin-login", {
    body: { password },
  });
  if (error) return { error: error.message };
  return data as { token?: string; error?: string };
};

// Ambil orders via Edge Function (butuh token admin)
export const getOrders = async (
  token: string,
): Promise<{ orders: Order[] }> => {
  const { data, error } = await supabase.functions.invoke("admin-orders", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (error) throw new Error(error.message);
  return data as { orders: Order[] };
};

// Simpan order publik (insert dengan RLS policy allow public insert)
export const createOrder = async (order: Order): Promise<{ ok: boolean }> => {
  const { error } = await supabase.from("orders").insert({
    id: order.id,
    name: order.name,
    template: order.template,
    template_id: order.templateId,
    cv_data: order.cv,
    skills_text: order.skills,
    status: order.status ?? "Menunggu WA",
    created_at: new Date().toISOString(),
  });
  if (error) throw new Error(error.message);
  return { ok: true };
};