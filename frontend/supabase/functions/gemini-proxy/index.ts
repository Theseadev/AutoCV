import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { systemPrompt, userQuery, jsonSchema } = await req.json();

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    const model = Deno.env.get("GEMINI_MODEL") || "gemini-2.0-flash";

    if (!apiKey) {
      // Fallback offline generator (same as old backend)
      const text = offlineGenerate(systemPrompt ?? "", userQuery ?? "");
      return new Response(
        JSON.stringify({
          candidates: [{ content: { parts: [{ text }] } }],
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

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

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await r.json();

    return new Response(JSON.stringify(data), {
      status: r.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});

// --- Offline generator (copy from old backend) ---
function offlineGenerate(systemPrompt: string, userQuery: string): string {
  const lines = (k: string) =>
    (userQuery.split("\n").find((l) => l.startsWith(k)) ?? "").replace(k, "").trim();
  if (/format setiap baris/i.test(systemPrompt)) {
    const title = lines("Target Profesi:") || "Staff Profesional";
    return [
      `Microsoft Office: Mahir untuk kebutuhan ${title}`,
      "Komunikasi: Kerja sama tim yang baik",
      "Manajemen Waktu: Prioritas tugas tepat sasaran",
      "Adaptif: Cepat mempelajari hal baru",
    ].join("\n");
  }
  if (/kata kunci/i.test(userQuery)) {
    const name = lines("Nama:") || "Kandidat";
    const title = lines("Profesi/Target Role:") || "profesional";
    const keyword = lines("Kata kunci/Latar belakang:") || "berpengalaman";
    return `Saya adalah ${name}, seorang ${title} dengan latar belakang ${keyword}. Berorientasi pada hasil, teliti, dan mampu bekerja sama dalam tim. Siap berkontribusi serta berkembang bersama perusahaan.`;
  }
  const descLines = userQuery.split("\n");
  const di = descLines.findIndex((l) => l.startsWith("Deskripsi Asli/Draft:"));
  const desc =
    di >= 0
      ? descLines
          .slice(di)
          .map((l) => l.replace(/^Deskripsi Asli\/Draft:\s*/, ""))
          .join("\n")
      : "Menjalankan tugas operasional harian dengan baik";
  return desc
    .split("\n")
    .map((l) => (l.trim() ? `• ${l.trim().replace(/^[•\-\d.]\s*/, "")}` : ""))
    .filter(Boolean)
    .join("\n");
}