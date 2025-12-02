"use client";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, X, Send, Sparkles, User, Bot, RotateCcw } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface Message {
    id: string;
    role: "user" | "model";
    content: string;
}

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const sendMessage = async (content: string, retryCount = 0) => {
        if (!content.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: content,
        };

        // Add user message to state
        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");
        setIsLoading(true);

        // Create abort controller for this request
        abortControllerRef.current = new AbortController();

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [...messages, userMessage],
                }),
                signal: abortControllerRef.current.signal,
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }
            if (!response.body) throw new Error("No response body");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let done = false;
            let accumulatedContent = "";
            const aiMessageId = (Date.now() + 1).toString();

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                const chunkValue = decoder.decode(value, { stream: true });
                accumulatedContent += chunkValue;

                // Update or create the AI message
                setMessages((prev) => {
                    const existingIndex = prev.findIndex(msg => msg.id === aiMessageId);
                    if (existingIndex >= 0) {
                        // Update existing message
                        return prev.map((msg, idx) =>
                            idx === existingIndex
                                ? { ...msg, content: accumulatedContent }
                                : msg
                        );
                    } else {
                        // Create new message on first chunk
                        return [...prev, { id: aiMessageId, role: "model", content: accumulatedContent }];
                    }
                });
            }

        } catch (error: unknown) {
            // Handle abort
            if (error instanceof Error && error.name === 'AbortError') {
                console.log('Request aborted');
                return;
            }

            console.error("Chat Error:", error);

            // Retry logic for network errors
            if (retryCount < 2 && error instanceof Error && error.message?.includes('fetch')) {
                console.log(`Retrying... (${retryCount + 1}/2)`);
                setTimeout(() => sendMessage(content, retryCount + 1), 1000);
                return;
            }

            const errorMessage = error instanceof Error && error.message?.includes('500')
                ? "The AI is temporarily unavailable. Please try again in a moment."
                : "Sorry, I encountered an error. Please try again.";

            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now().toString(),
                    role: "model",
                    content: errorMessage,
                },
            ]);
        } finally {
            setIsLoading(false);
            abortControllerRef.current = null;
        }
    };

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        sendMessage(inputValue);
    };

    // Handle predefined questions
    const handlePredefinedClick = (question: string) => {
        sendMessage(question);
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="mb-4 w-[90vw] sm:w-[400px] h-[500px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5" />
                                <div>
                                    <h3 className="font-bold text-sm">Orlando&apos;s AI Assistant</h3>
                                    <p className="text-xs text-blue-100">Ask me anything about his work!</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                {messages.length > 0 && (
                                    <button
                                        onClick={() => setMessages([])}
                                        className="p-1 hover:bg-white/20 rounded-full transition"
                                        title="Clear chat"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                    </button>
                                )}
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 hover:bg-white/20 rounded-full transition"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-950/50">
                            {messages.length === 0 && (
                                <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
                                    <p className="text-sm mb-2">👋 Hi! I&apos;m Orlando&apos;s AI assistant.</p>
                                    <p className="text-xs">Ask me about his projects, skills, or experience.</p>
                                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                                        <button
                                            onClick={() => handlePredefinedClick("What are Orlando's main skills?")}
                                            className="text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                        >
                                            What are his main skills?
                                        </button>
                                        <button
                                            onClick={() => handlePredefinedClick("What is his product philosophy?")}
                                            className="text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                        >
                                            What is his product philosophy?
                                        </button>
                                        <button
                                            onClick={() => handlePredefinedClick("How does he approach AI projects?")}
                                            className="text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                        >
                                            How does he approach AI projects?
                                        </button>
                                        <button
                                            onClick={() => handlePredefinedClick("Tell me about his background")}
                                            className="text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                        >
                                            Tell me about his background
                                        </button>
                                        <button
                                            onClick={() => handlePredefinedClick("What makes him different as an engineer?")}
                                            className="text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                        >
                                            What makes him different?
                                        </button>
                                        <button
                                            onClick={() => handlePredefinedClick("What technologies does he prefer?")}
                                            className="text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                        >
                                            What technologies does he prefer?
                                        </button>
                                    </div>
                                </div>
                            )}

                            {messages.map((m) => (
                                <div
                                    key={m.id}
                                    className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : "flex-row"
                                        }`}
                                >
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${m.role === "user"
                                            ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                                            : "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
                                            }`}
                                    >
                                        {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                    </div>
                                    <div
                                        className={`p-3 rounded-2xl text-sm max-w-[80%] ${m.role === "user"
                                            ? "bg-blue-600 text-white rounded-tr-none"
                                            : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none shadow-sm"
                                            }`}
                                    >
                                        {/* Enhanced markdown parsing */}
                                        {m.content.split(/\n/).map((line: string, lineIdx: number) => {
                                            // Check if it's a heading (strip # symbols)
                                            const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
                                            if (headingMatch) {
                                                const level = headingMatch[1].length;
                                                const text = headingMatch[2];
                                                const fontSize = level === 1 ? "text-base" : level === 2 ? "text-sm" : "text-sm";
                                                return (
                                                    <div key={lineIdx} className={`font-bold ${fontSize} mt-3 mb-2`}>
                                                        {text.split("**").map((part, i) =>
                                                            i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                                                        )}
                                                    </div>
                                                );
                                            }

                                            // Check if it's a bullet point (strip * or -)
                                            const isBullet = /^[\s]*[-*]\s/.test(line);
                                            const cleanLine = line.replace(/^[\s]*[-*]\s+/, '');

                                            return (
                                                <div key={lineIdx} className={isBullet ? "ml-4 mb-1" : "mb-1"}>
                                                    {isBullet && <span className="mr-2">•</span>}
                                                    {cleanLine.split("**").map((part, i) =>
                                                        i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}

                            {isLoading && messages[messages.length - 1]?.role === "user" && (
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                                        <Bot className="w-4 h-4" />
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSubmit} className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                            <div className="relative">
                                <input
                                    value={inputValue}
                                    onChange={handleInputChange}
                                    placeholder="Ask a question..."
                                    className="w-full pl-4 pr-12 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || !inputValue.trim()}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
            </motion.button>
        </div>
    );
}