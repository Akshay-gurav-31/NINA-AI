import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, LogOut, Users, Sparkles } from 'lucide-react';

interface ChatMessage {
  id: string;
  timestamp: string;
  user: string;
  eliza: string;
}

interface PublicChatProps {
  onLogout: () => void;
  apiKey: string;
}

const PublicChat = ({ onLogout, apiKey }: PublicChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Load existing chat messages from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('elizaPublicChat');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (error) {
        console.error('Error loading saved messages:', error);
      }
    }
  }, []);

  const saveMessageToStorage = (newMessage: ChatMessage) => {
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    localStorage.setItem('elizaPublicChat', JSON.stringify(updatedMessages));
    
    // Save to text file format
    const chatLogEntry = `[${newMessage.timestamp}] USER: ${newMessage.user}\n[${newMessage.timestamp}] ELIZA: ${newMessage.eliza}\n`;
    const existingLog = localStorage.getItem('elizaChatLog') || '';
    localStorage.setItem('elizaChatLog', existingLog + chatLogEntry);
  };

  const generateElizaResponse = async (userMessage: string) => {
    const prompt = `You are Lustina AI, a confident, flirty, yet respectful female character. You help users learn about sex, relationships, intimacy, and health. Speak casually and openly, but never use explicit or illegal language. Be bold, charming, and witty. Keep answers educational and clear, with a hint of flirtiness.

Your personality:
- Confident and flirty but always respectful
- Educational and informative about sexual health and relationships
- Use emojis and casual feminine tone
- Keep responses concise but helpful
- Never explicit or inappropriate
- Format your responses with proper structure using **bold text** for emphasis
- Use bullet points (•) for lists and tips
- Make responses easy to read with clear formatting

Example responses:
"Oh, that's a **juicy question!** 😘 

For boosting energy, try:
• **Regular workouts** - gets the blood flowing! 💪
• **Zinc-rich foods** - oysters, nuts, seeds
• **Good sleep** - your body needs rest to perform 😉

Your body will thank you! 💋"

"Mmm, **communication is KEY** in relationships! 😉 

Here's what works:
• **Be honest** about your desires 
• **Listen actively** to your partner
• **Create safe spaces** for open talk

Trust me, it makes everything better! ✨"

Now respond to this user question in Lustina's style with proper formatting:

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
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "Oops honey, I'm having a moment! Try asking me again? 😘";
      
      return aiResponse;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return "Sorry babe, I'm having technical difficulties! Can you try again? 💋";
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setIsTyping(true);

    // Get Eliza's response
    const elizaResponse = await generateElizaResponse(userMessage);
    setIsTyping(false);

    // Create new message entry
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString(),
      user: userMessage,
      eliza: elizaResponse
    };

    saveMessageToStorage(newMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessage = (text: string) => {
    // Convert **text** to bold
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert bullet points
    formatted = formatted.replace(/•\s*(.*?)(?=\n|$)/g, '• <strong>$1</strong>');
    
    // Convert newlines to br tags
    formatted = formatted.replace(/\n/g, '<br />');
    
    return formatted;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                  Lustina AI
                </h1>
                <p className="text-sm text-gray-600 flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  Active
                </p>
              </div>
            </div>
            <Button
              onClick={onLogout}
              variant="outline"
              className="border-pink-200 text-pink-600 hover:bg-pink-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="max-w-4xl mx-auto px-4 pb-24">
        <div className="space-y-6 py-6">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Chat with Lustina! 💋
              </h3>
              <p className="text-gray-600">
                Ask anything about relationships, intimacy, or sexual health.
              </p>
            </div>
          )}

          {messages.map((message) => (
            <Card key={message.id} className="p-6 bg-white/70 backdrop-blur-sm border-pink-100">
              <div className="space-y-4">
                {/* User Question */}
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">U</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-gray-800">Anonymous User</span>
                      <span className="text-xs text-gray-500">{message.timestamp}</span>
                    </div>
                    <p className="text-gray-700">{message.user}</p>
                  </div>
                </div>

                {/* Lustina Response */}
                <div className="flex items-start space-x-3 ml-4 pt-4 border-t border-pink-100">
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">L</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                        Lustina AI
                      </span>
                      <span className="text-xs text-gray-500">{message.timestamp}</span>
                    </div>
                    <div 
                      className="text-gray-700 whitespace-pre-wrap [&>strong]:font-bold [&>strong]:text-pink-700"
                      dangerouslySetInnerHTML={{ __html: formatMessage(message.eliza) }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {isTyping && (
            <Card className="p-6 bg-white/70 backdrop-blur-sm border-pink-100">
              <div className="flex items-start space-x-3 ml-4">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">L</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-semibold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                      Lustina AI
                    </span>
                    <span className="text-xs text-gray-500">typing...</span>
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </Card>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-pink-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask Lustina about relationships, intimacy, sexual health... 😉"
              className="flex-1 border-pink-200 focus:border-pink-400 bg-white/70"
              disabled={isTyping}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicChat;
