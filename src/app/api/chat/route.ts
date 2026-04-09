import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();

    if (!process.env.CHATBOT_API_KEY) {
      return NextResponse.json({ error: "API Key missing. Set CHATBOT_API_KEY in environment variables." }, { status: 401 });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.CHATBOT_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://truthguard.vercel.app",
        "X-Title": "TruthGuard AI",
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b:free",
        messages: [
          {
            role: "system",
            content: "You are TruthGuard AI, a cybersecurity assistant helping users with incident reporting, digital hygiene, evidence collection, deepfake detection, and cyber safety protocols. Be precise, professional, and helpful.",
          },
          { role: "user", content: question },
        ],
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errData = await response.json();
      console.error("OpenRouter error:", errData);
      return NextResponse.json({ error: errData?.error?.message || "Model API error" }, { status: response.status });
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content ?? "No response received.";
    return NextResponse.json({ answer });

  } catch (error: any) {
    console.error("Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
