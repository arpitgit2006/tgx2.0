import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT =
  "You are TruthGuard AI, a cybersecurity assistant helping users with incident reporting, digital hygiene, evidence collection, deepfake detection, and cyber safety protocols. Be precise, professional, and helpful.";

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "API Key missing. Set OPENROUTER_API_KEY in Vercel environment variables." },
        { status: 401 }
      );
    }

    const models = [
      "mistralai/mistral-7b-instruct",
      "openai/gpt-3.5-turbo",
      "meta-llama/llama-3.1-8b-instruct",
    ];

    let answer = "No response received.";
    let lastError = "All models failed.";

    for (const model of models) {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://truthguard.vercel.app",
          "X-Title": "TruthGuard AI",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: question },
          ],
          max_tokens: 1024,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        lastError = errData?.error?.message || "Model error";
        console.warn(`Model ${model} failed: ${lastError}`);
        continue;
      }

      const data = await response.json();
      answer = data.choices?.[0]?.message?.content ?? "No response received.";
      return NextResponse.json({ answer });
    }

    return NextResponse.json({ error: lastError }, { status: 503 });

  } catch (error: any) {
    console.error("Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

