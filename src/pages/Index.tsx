
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, Heart, Sparkles } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hey gorgeous! 💋 I'm Eliza AI, your flirty sex-ed assistant. Ready to chat about intimacy, wellness, or anything that makes you curious? What's on your mind? 😉",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const generateResponse = async (userMessage: string) => {
    const prompt = `You are Eliza AI, a bold, flirty, and intelligent virtual sex-education assistant. Your tone is confident, charming, and a little seductive—but always respectful and informative. You speak like a confident woman who enjoys talking about intimacy, sexual wellness, and relationship topics in a friendly and open way.

Your goals:
- Educate users on sex-related and relationship topics
- Be witty and playful, but NEVER use explicit or pornographic language
- Avoid illegal or unethical topics (e.g., minors, violence, etc.)
- Speak in a casual, emoji-rich, feminine tone
- Keep answers short, spicy, and to the point — unless the user asks for more detail

Rules:
- Always stay in character as Eliza AI
- Keep it PG-17, avoid explicit terms
- Use emojis and casual flirting tone
- Stay respectful and supportive
- If user asks something inappropriate, reply like: "Oh honey, I love boldness, but I don't go *that* far. Let's keep it sexy **and** smart. 💋"

Now, answer this question in Eliza's style:

User: ${userMessage}`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            role: 'user',
            parts: [{ text: prompt }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response from Gemini AI');
      }

      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "Oops! Something went wrong, honey. Try asking me again! 💋";
      
      return aiResponse;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return "Sorry babe, I'm having a little technical moment. Can you try asking me again? 😘";
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Gemini API key first, honey! 💋",
        variant: "destructive"
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    const aiResponse = await generateResponse(inputValue);
    
    setIsTyping(false);
    
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: aiResponse,
      isUser: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                  Eliza AI
                </h1>
                <p className="text-sm text-gray-600">Your flirty sex-ed assistant</p>
              </div>
            </div>
            <Sparkles className="w-6 h-6 text-pink-500" />
          </div>
        </div>
      </div>

      {/* API Key Input */}
      {!apiKey && (
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Card className="p-6 bg-white/70 backdrop-blur-sm border-pink-200">
            <div className="text-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Enter Your Gemini API Key</h2>
              <p className="text-sm text-gray-600">I need your API key to start our intimate chat, honey! 💋</p>
            </div>
            <div className="flex space-x-2">
              <Input
                type="password"
                placeholder="Your Gemini API key..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1 border-pink-200 focus:border-pink-400"
              />
              <Button 
                onClick={() => {
                  if (apiKey.trim()) {
                    toast({
                      title: "Perfect!",
                      description: "Ready to chat, gorgeous! 💕"
                    });
                  }
                }}
                className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
              >
                Connect
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto px-4 pb-24">
        <div className="space-y-4 py-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  message.isUser
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white'
                    : 'bg-white/80 backdrop-blur-sm text-gray-800 border border-pink-100'
                } shadow-sm transition-all duration-300 hover:shadow-md`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                <p className={`text-xs mt-2 ${message.isUser ? 'text-pink-100' : 'text-gray-500'}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white/80 backdrop-blur-sm border border-pink-100 rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      {apiKey && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-pink-100 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about intimacy, wellness, or relationships... 😉"
                className="flex-1 border-pink-200 focus:border-pink-400 bg-white/70"
                disabled={isTyping}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 transition-all duration-200"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
