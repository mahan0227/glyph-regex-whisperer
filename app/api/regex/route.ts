import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getOpenAIApiKey } from "@/lib/openai-key";

export async function POST(request: NextRequest) {
  const apiKey = getOpenAIApiKey(request);
  if (!apiKey) {
    return NextResponse.json(
      { error: "Send Authorization: Bearer <your OpenAI API key> on each request." },
      { status: 401 },
    );
  }

  let body: { description?: string; flavor?: string; model?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body.description?.trim()) {
    return NextResponse.json({ error: "`description` is required." }, { status: 400 });
  }

  const client = new OpenAI({ apiKey });
  const model = body.model?.trim() || "gpt-4o-mini";
  const flavor = body.flavor?.trim() || "JavaScript literal";

  const system = `You are Glyph Regex Whisperer. Translate natural language into safe, readable regex.
Return JSON with:
- pattern: string (the regex)
- flags: string (e.g. "i" or "")
- flavor: string (what engine syntax targets, e.g. JS, PCRE, Rust)
- explanation: string[] (step-by-step tokens)
- positives: string[] (should match)
- negatives: string[] (should not match)
- cautions: string[] (catastrophic backtracking, unicode pitfalls, etc.)
Target flavor: ${flavor}`;

  try {
    const completion = await client.chat.completions.create({
      model,
      temperature: 0.15,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: body.description },
      ],
    });
    const text = completion.choices[0]?.message?.content;
    if (!text) return NextResponse.json({ error: "Empty model response." }, { status: 502 });
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      return NextResponse.json({ raw: text }, { status: 200 });
    }
    return NextResponse.json({ result: parsed, model });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "OpenAI request failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
