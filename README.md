# 🤖 Orlando's AI Assistant - Demo

This is an enhanced version of the AI assistant that serves as a comprehensive demo interface. The chatbot leverages RAG (Retrieval Augmented Generation) technology to provide contextually rich responses about Orlando Ascanio's background, projects, skills, and personal interests.

## ✨ Key Features

### 🧠 AI & RAG Implementation
- **Contextual Intelligence**: RAG system with 15+ context categories (bio, philosophy, projects, skills, etc.)
- **Streaming Responses**: Real-time token streaming for instant feedback
- **Grounded Answers**: AI responses strictly based on provided context (no hallucinations)
- **Multi-turn Conversations**: Maintains conversation history for coherent dialogue
- **Smart Filtering**: Content filtering and safety measures

### 🎨 User Experience
- **Modern UI**: Clean, responsive design with dark mode support
- **Smooth Animations**: Framer Motion for delightful interactions
- **Quick Start Questions**: Pre-defined prompts for easy exploration
- **Mobile-First**: Fully responsive with adaptive sidebar
- **Real-time Feedback**: Loading states, toasts, and visual indicators
- **Keyboard Shortcuts**: Power-user features (Cmd+L to clear, Cmd+B to toggle sidebar)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Google Gemini API key ([Get one here](https://ai.google.dev/))

### Installation

1. **Clone the repository**
   ```bash
   cd "AI-Assitant demo/client"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env.local file in the client directory
   echo "GOOGLE_API_KEY=your_gemini_api_key_here" > .env.local
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🧩 Tech Stack

### Frontend
- **Framework**: Next.js 
- **UI Library**: React
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend
- **AI Model**: Google Gemini 2.5 Flash
- **Streaming**: ReadableStream API
- **Context Management**: Custom RAG implementation

### 🌍 Internationalization
- **Multi-Language Support**: Automatic language detection and UI translation
- **7 Languages Supported**: English, Spanish, French, German, Portuguese, Chinese, Japanese
- **Smart Language Detection**: Detects user language from messages
- **Persistent Preferences**: Saves language selection in local storage
- **Dynamic AI Responses**: AI responds in the user's preferred language

## 📝 License

This project is for demonstration purposes. Feel free to use it as inspiration for your own AI projects.

## 📧 Contact

**Orlando Ascanio**
- Email: operation927@gmail.com
- LinkedIn: [orlando-ascanio-dev](https://linkedin.com/in/orlando-ascanio-dev)
- GitHub: [Gojer16](https://github.com/Gojer16)

---

**Built with ❤️ by Orlando Ascanio**
