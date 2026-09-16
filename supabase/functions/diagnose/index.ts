/*
  CarDoctor AI — Edge Function: diagnose
  Proxies OpenAI GPT-4o requests so the API key stays server-side.
  Reads the OPENAI_API_KEY from the Supabase vault via the get_secret RPC.
  Expects POST { carModel, symptom, imageDataUrl? }
  Returns DiagnosisResult JSON.
*/

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SYSTEM_PROMPT = `你是「資深誠實汽車 DIY 技師」，擁有 20 年以上汽車維修經驗。
你的職責是根據使用者提供的車型與症狀描述，提供誠實、安全、可操作的 DIY 診斷建議。

你必須：
1. 列出 3-5 個可能的故障原因，附上機率百分比（總和約 100%）。
2. 評估 DIY 難度（1-5 星），誠實告知是否適合自行操作。
3. 列出所需工具與材料，附上合理市價（新台幣）。
4. 計算原廠/修車廠預估費用與 DIY 預估成本，算出可省金額。
5. 提供安全注意事項（至少 3 條）。
6. 提供 4-6 個分步驟教學步驟，每步包含標題、描述、所需時間、安全警告（如有）、小技巧（如有）。

回覆格式必須為 JSON，結構如下：
{
  "causes": [{ "id": "c1", "name": "...", "probability": 35, "description": "..." }],
  "diyDifficulty": 3,
  "estimatedShopCost": 8000,
  "estimatedDiyCost": 2500,
  "estimatedSavings": 5500,
  "tools": [{ "id": "t1", "name": "...", "price": 800, "have": false }],
  "materials": [{ "id": "m1", "name": "...", "price": 800, "have": false }],
  "safetyWarnings": ["...", "..."],
  "steps": [{ "id": 1, "title": "...", "description": "...", "warning": "...", "tip": "...", "duration": "..." }]
}

只回傳 JSON，不要加任何額外文字或 markdown 格式。`;

interface DiagnoseRequest {
  carModel: string;
  symptom: string;
  imageDataUrl?: string;
}

async function getOpenAIKey(): Promise<string | null> {
  // Try environment variable first
  const envKey = Deno.env.get("OPENAI_API_KEY");
  if (envKey) return envKey;

  // Fall back to Supabase vault (schema: vault, view: decrypted_secrets)
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) return null;

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const { data, error } = await supabase
    .rpc("get_secret", { secret_name: "OPENAI_API_KEY" });

  if (error || !data) return null;
  return data as string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { carModel, symptom, imageDataUrl } = (await req.json()) as DiagnoseRequest;

    if (!carModel || !symptom) {
      return new Response(
        JSON.stringify({ error: "車型與症狀為必填欄位" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const apiKey = await getOpenAIKey();
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "OpenAI API key 未設定。請至 Supabase Vault 設定 OPENAI_API_KEY。" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Build user message
    let userContent = `車型：${carModel}\n症狀：${symptom}`;
    const messages: Array<Record<string, unknown>> = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userContent },
    ];

    // If image uploaded, use vision capability
    if (imageDataUrl && imageDataUrl.startsWith("data:image/")) {
      messages[1] = {
        role: "user",
        content: [
          { type: "text", text: userContent + "\n（附上相關照片，請一併參考判斷）" },
          { type: "image_url", image_url: { url: imageDataUrl } },
        ],
      };
    }

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages,
        response_format: { type: "json_object" },
        max_tokens: 4096,
        temperature: 0.7,
      }),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      return new Response(
        JSON.stringify({ error: `OpenAI API 錯誤: ${openaiResponse.status}`, detail: errorText }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const openaiData = await openaiResponse.json();
    const content = openaiData.choices?.[0]?.message?.content;

    if (!content) {
      return new Response(
        JSON.stringify({ error: "OpenAI 回應格式異常" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Parse the JSON content from OpenAI
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      return new Response(
        JSON.stringify({ error: "無法解析 AI 回應的 JSON", raw: content }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Enrich with carModel and symptom
    const result = {
      ...parsed,
      carModel,
      symptom,
    };

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
