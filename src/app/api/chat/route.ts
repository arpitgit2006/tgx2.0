import { NextRequest, NextResponse } from "next/server";

const FREE_MODELS = [
  "mistralai/mistral-7b-instruct:free",
  "meta-llama/llama-3.1-8b-instruct:free",
  "google/gemma-2-9b-it:free",
  "qwen/qwen-2-7b-instruct:free",
];

const SYSTEM_PROMPT =
  "You are TruthGuard AI, a cybersecurity assistant helping users with incident reporting, digital hygiene, evidence collection, deepfake detection, and cyber safety protocols. Be precise, professional, and helpful.";

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();

    if (!process.env.CHATBOT_API_KEY) {
      return NextResponse.json(
        { error: "API Key missing. Set CHATBOT_API_KEY in Vercel environment variables." },
        { status: 401 }
      );
    }

    let lastError = "All models are currently unavailable. Please try again shortly.";

    for (const model of FREE_MODELS) {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.CHATBOT_API_KEY}`,
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

      // If rate-limited or provider error, try next model
      if (response.status === 429 || response.status === 503) {
        const errData = await response.json();
        lastError = errData?.error?.message || lastError;
        console.warn(`Model ${model} failed (${response.status}), trying next...`);
        continue;
      }

      if (!response.ok) {
        const errData = await response.json();
        lastError = errData?.error?.message || lastError;
        console.error(`Model ${model} error:`, errData);
        continue;
      }

      const data = await response.json();
      const answer = data.choices?.[0]?.message?.content ?? "No response received.";
      console.log(`Responded using model: ${model}`);
      return NextResponse.json({ answer });
    }

    // All models failed
    return NextResponse.json({ error: lastError }, { status: 429 });

  } catch (error: any) {
    console.error("Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

