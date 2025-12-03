'use client';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '@/app/chat/components/ui/Button';
import { Input } from '@/app/chat/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/chat/components/ui/Card';
import { Modal, ModalFooter } from '@/app/chat/components/ui/Modal';
import { Toast } from '@/app/chat/components/ui/Toast';
import { LanguageSelector } from '@/app/chat/components/ui/LanguageSelector';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Lightbulb,
  Brain,
  Code,
  Zap,
  RotateCcw,
  Copy,
  Check,
  Mail,
  Globe,
  Github,
  Linkedin,
  Menu
} from 'lucide-react';
import { ragContext } from '@/app/lib/ragContext';
import { detectLanguage } from '@/lib/i18n/languageDetection';
import { useHtmlRenderer } from '@/lib/hooks/useHtmlRenderer';

export default function EnhancedChatPage() {
  const { t, i18n } = useTranslation();
  const { renderHtml } = useHtmlRenderer();
  const [messages, setMessages] = useState<{ id: string; role: 'user' | 'assistant'; content: string; timestamp: Date }[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info' | 'warning'>('info');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + L to clear chat
      if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        clearChat();
      }

      // Escape key to close modal
      if (e.key === 'Escape' && showClearModal) {
        handleClearChatCancel();
      }

      // Toggle sidebar with Cmd/Ctrl + B
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showClearModal]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (content?: string) => {
    const messageContent = content || inputValue;
    if (!messageContent.trim() || isLoading) return;

    // Close sidebar on mobile if a quick question is selected
    if (content && typeof window !== 'undefined' && window.innerWidth < 768) {
      setSidebarOpen(false);
    }

    // Show toast for quick questions to give immediate feedback
    if (content) {
      showToastMessage(t('sendingQuestion'), 'info');
    }

    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: messageContent,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Detect language from user message or use current UI language
      const detectedLang = detectLanguage(messageContent);
      const currentLang = i18n.language;
      const languageToUse = detectedLang !== 'en' ? detectedLang : currentLang;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: messageContent }
          ],
          language: languageToUse
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      const decoder = new TextDecoder();
      let assistantMessage = '';
      let buffer = '';

      const assistantMessageId = `assistant-${Date.now()}`;
      const initialAssistantMessage = {
        id: assistantMessageId,
        role: 'assistant' as const,
        content: '',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, initialAssistantMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        // Process the buffer for complete responses
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.trim()) {
            assistantMessage += line;
            setMessages(prev =>
              prev.map(msg =>
                msg.id === assistantMessageId
                  ? { ...msg, content: msg.content + line }
                  : msg
              )
            );
          }
        }
      }

      // Process any remaining buffer
      if (buffer) {
        assistantMessage += buffer;
        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantMessageId
              ? { ...msg, content: msg.content + buffer }
              : msg
          )
        );
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: t('errorOccurred'),
          timestamp: new Date(),
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setShowClearModal(true);
  };

  const handleClearChatConfirm = () => {
    setMessages([]);
    setShowClearModal(false);
    showToastMessage(t('chatCleared'), 'success');
  };

  const handleClearChatCancel = () => {
    setShowClearModal(false);
  };

  const showToastMessage = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);

    // Auto-hide the toast after 3 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const copyMessage = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  // Get some key info about you for the sidebar
  const skillsCount = Object.keys(ragContext.technicalProfile).length + ragContext.softSkills.length;
  const projectCount = 16; // Based on the dataProjects file
  const hobbyCount = ragContext.personalInterests.split('- **').length - 1; // Count hobbies from the personalInterests field

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur border-b border-zinc-200 dark:border-zinc-800 shrink-0">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl font-bold text-zinc-900 dark:text-white truncate">{t('appTitle')}</h1>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate hidden sm:block">{t('appSubtitle')}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 ml-2">
              <LanguageSelector />
              <Button
                variant="outline"
                onClick={toggleSidebar}
                aria-label={t('toggleSidebar')}
                size="icon"
              >
                <Menu className="w-4 h-4" />
              </Button>
              <div className="relative group">
                <Button
                  variant="outline"
                  onClick={clearChat}
                  aria-label={t('clearChat')}
                  size="icon"
                  className="hidden md:flex"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={clearChat}
                  aria-label={t('clearChat')}
                  className="px-3 py-2 md:hidden text-sm"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">{t('clearChat')}</span>
                </Button>
                <div className="absolute hidden group-hover:block right-0 bottom-full mb-2 w-48 p-2 bg-zinc-800 text-white text-xs rounded shadow-lg z-20">
                  <p>{t('keyboardShortcuts')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - now positioned as overlay on mobile */}
        <aside className={`${sidebarOpen ? 'w-96 block' : 'hidden'} bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 overflow-y-auto z-10 fixed inset-y-0 left-0 md:static md:inset-auto md:h-full transition-transform duration-300 ease-in-out`}>
          <div className="p-6 h-full overflow-y-auto">
            {/* Close button for mobile */}
            <div className="md:hidden flex justify-end mb-4">
              <Button
                variant="ghost"
                onClick={toggleSidebar}
                className="p-2 rounded-full"
                aria-label="Close sidebar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Button>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                {t('quickStartQuestions')}
              </h3>
              <div className="space-y-2">
                {[
                  t('question1'),
                  t('question2'),
                  t('question3'),
                  t('question4'),
                  t('question5'),
                  t('question6'),
                  t('question7'),
                ].map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3 px-4"
                    onClick={() => handleSendMessage(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-500" />
                {t('getInTouch')}
              </h3>
              <div className="space-y-3">
                <a
                  href={`mailto:${ragContext.contact.email}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                    <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">{t('email')}</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 truncate">{ragContext.contact.email}</p>
                  </div>
                </a>

                <a
                  href={ragContext.contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                    <Linkedin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">LinkedIn</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 truncate">{ragContext.contact.linkedin.replace('https://www.', '').replace('https://', '')}</p>
                  </div>
                </a>

                <a
                  href={ragContext.contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
                    <Github className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">GitHub</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 truncate">{ragContext.contact.github.replace('https://', '')}</p>
                  </div>
                </a>

                <div className="flex items-center gap-3 p-3 rounded-lg">
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                    <Globe className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">{t('location')}</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{ragContext.contact.location}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto px-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                    <Bot className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-3">
                    {t('welcomeTitle')}
                  </h2>
                  <p className="text-lg text-zinc-600 dark:text-zinc-300 mb-6">
                    {t('welcomeSubtitle')}
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  {[
                    { icon: Brain, text: t('technicalExpertise'), desc: t('technicalExpertiseDesc') },
                    { icon: Code, text: t('projectDetails'), desc: t('projectDetailsDesc') },
                    { icon: Zap, text: t('personalInterests'), desc: t('personalInterestsDesc') },
                    { icon: User, text: t('lifePhilosophy'), desc: t('lifePhilosophyDesc') },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => handleSendMessage(item.desc)}>
                        <CardContent className="p-5 flex items-start gap-4">
                          <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                            <item.icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-zinc-900 dark:text-white">{item.text}</h3>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{item.desc}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto space-y-6">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[90%] md:max-w-[85%] rounded-2xl p-5 ${message.role === 'user'
                        ? 'bg-purple-600 text-white rounded-br-none'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-none shadow-sm'
                        }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg shrink-0 ${message.role === 'user' ? 'bg-purple-700' : 'bg-zinc-200 dark:bg-zinc-700'}`}>
                          {message.role === 'user' ? (
                            <User className="w-5 h-5" />
                          ) : (
                            <Bot className="w-5 h-5" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div
                            className="prose prose-sm max-w-none dark:prose-invert text-base leading-relaxed
                              prose-p:mb-4 prose-p:last:mb-0
                              prose-ul:my-4 prose-ul:space-y-2
                              prose-ol:my-4 prose-ol:space-y-2
                              prose-li:my-1
                              prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-lg prose-h3:font-semibold
                              prose-h4:mt-4 prose-h4:mb-2 prose-h4:text-base prose-h4:font-semibold"
                            dangerouslySetInnerHTML={renderHtml(message.content)}
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyMessage(message.content, message.id)}
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                        >
                          {copiedId === message.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                      <div className={`text-xs mt-2 ${message.role === 'user' ? 'text-purple-200' : 'text-zinc-500 dark:text-zinc-400'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="max-w-[85%] bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-2xl rounded-bl-none p-5 shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-zinc-200 dark:bg-zinc-700">
                          <Bot className="w-5 h-5" />
                        </div>
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce"></div>
                          <div className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900">
            <div className="max-w-4xl mx-auto">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t('inputPlaceholder')}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-center text-zinc-500 dark:text-zinc-400 mt-2">
                {t('footerText')}
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* Clear Chat Modal */}
      <Modal
        isOpen={showClearModal}
        onClose={handleClearChatCancel}
        title={t('clearChatTitle')}
      >
        <p className="text-zinc-600 dark:text-zinc-300 mb-2">
          {t('clearChatMessage')}
        </p>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6">
          {t('clearChatWarning')}
        </p>
        <ModalFooter>
          <Button variant="outline" onClick={handleClearChatCancel}>
            {t('cancel')}
          </Button>
          <Button
            variant="destructive"
            onClick={handleClearChatConfirm}
          >
            {t('clearChat')}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
      />
    </div>
  );
}