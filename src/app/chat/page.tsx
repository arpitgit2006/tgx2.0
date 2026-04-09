import Chatbot from "@/components/Chatbot";

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-tg pt-20 pb-4 px-4 flex flex-col items-center">
      <div className="w-full max-w-5xl mb-4 space-y-1 text-center">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white tracking-wider">
          Digital <span className="text-neo-cyan">Assistant</span>
        </h1>
        <p className="text-text-mid font-body text-sm max-w-2xl mx-auto">
          Ask anything about incident reporting, evidence collection, and cyber safety.
        </p>
      </div>
      
      <div className="w-full max-w-5xl flex-1">
        <Chatbot />
      </div>
    </div>
  );
}
