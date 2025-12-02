import { GoogleGenAI } from "@google/genai";
import { getResumeContext } from "@/app/lib/resumeContext";

export const maxDuration = 30;

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY!,
});

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        const systemPrompt = getResumeContext();

        const history = [
            {
                role: "model",
                parts: [{ text: systemPrompt }],
            },
            ...messages.map((m: { role: string; content: string }) => ({
                role: m.role,
                parts: [{ text: m.content }],
            })),
        ];

        // Create chat
        const chat = ai.chats.create({
            model: "gemini-2.5-flash",
            history,
        });

        // Stream
        const stream = await chat.sendMessageStream({
            message: messages[messages.length - 1].content,
        });

        const encoder = new TextEncoder();
        const readable = new ReadableStream({
            async start(controller) {
                for await (const chunk of stream) {
                    controller.enqueue(encoder.encode(chunk.text));
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