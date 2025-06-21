
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Key, ArrowRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ApiKeySetupProps {
  onApiKeySet: (apiKey: string) => void;
  onBack: () => void;
}

const ApiKeySetup = ({ onApiKeySet, onBack }: ApiKeySetupProps) => {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onApiKeySet(apiKey.trim());
      toast({
        title: "API Key Set!",
        description: "Ready to chat with Lustina AI! 💋"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-white/80 backdrop-blur-sm border-pink-200">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Key className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Setup Gemini API</h1>
          <p className="text-gray-600">Enter your Gemini API key to start chatting with Lustina AI 🩷</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Enter your Gemini API key..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="border-pink-200 focus:border-pink-400"
            />
            <p className="text-xs text-gray-500">
              Get your API key from Google AI Studio
            </p>
          </div>
          
          <div className="space-y-3">
            <Button
              type="submit"
              disabled={!apiKey.trim()}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Continue to Chat
            </Button>
            
            <Button
              type="button"
              onClick={onBack}
              variant="outline"
              className="w-full border-pink-200 text-pink-600 hover:bg-pink-50"
            >
              Back to Login
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ApiKeySetup;
