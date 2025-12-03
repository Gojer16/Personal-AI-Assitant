import { GoogleGenAI } from "@google/genai";
import { getResumeContext } from "@/app/lib/resumeContext";
import { filterResponseContent } from "@/lib/filter";
import { getLanguageSystemPrompt } from "@/lib/i18n/languageDetection";

export const maxDuration = 30;

export async function POST(req: Request) {
    try {
        const { messages, language } = await req.json();
        const apiKey = process.env.GOOGLE_API_KEY;

        if (!apiKey) {
            const msg = `Missing Google API key. Set the environment variable GOOGLE_API_KEY or configure Application Default Credentials. See https://cloud.google.com/docs/authentication/getting-started`;
            console.error("API Error:", msg);
            return new Response(msg, { status: 500 });
        }

        const ai = new GoogleGenAI({ apiKey });
        let systemPrompt = getResumeContext();

        // Add language instruction if specified
        if (language && language !== 'en') {
            const instruction = getLanguageSystemPrompt(language);
            if (instruction) {
                systemPrompt = `${instruction}\n\n${systemPrompt}`;
            }
        }

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            const msg = "Bad Request: `messages` array is required";
            console.error("API Error:", msg);
            return new Response(msg, { status: 400 });
        }

        const normalizeRole = (role?: string) => {
            if (!role) return "user";
            const r = role.toLowerCase();
            if (r === "assistant" || r === "system") return "model";
            if (r === "model" || r === "user") return r;
            return "user"; // fallback
        };

        const history = [
            {
                role: "model",
                parts: [{ text: systemPrompt }],
            },
            ...messages.map((m: { role?: string; content: string }) => ({
                role: normalizeRole(m.role),
                parts: [{ text: m.content }],
            })),
        ];

        // Create chat
        const chat = ai.chats.create({
            model: "gemini-2.5-flash",
            history,
        });

        // Stream
        const lastMessage = messages[messages.length - 1];
        const userMessage = lastMessage?.content ?? "";

        const stream = await chat.sendMessageStream({
            message: userMessage,
        });

        const encoder = new TextEncoder();
        const readable = new ReadableStream({
            async start(controller) {
                for await (const chunk of stream) {
                    const filteredText = filterResponseContent(chunk.text || "");
                    controller.enqueue(encoder.encode(filteredText));
                }
                controller.close();
            },
        });

        return new Response(readable, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Cache-Control": "no-cache",
                "X-Accel-Buffering": "no",
            },
        });
    } catch (err) {
        console.error("API Error:", err);
        return new Response("Internal Server Error", { status: 500 });
    }
}