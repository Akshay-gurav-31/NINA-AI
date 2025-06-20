
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Lock, Heart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface EntryGateProps {
  onAccessGranted: () => void;
}

const EntryGate = ({ onAccessGranted }: EntryGateProps) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      if (password === 'FUCKYOUBABY') {
        toast({
          title: "Access Granted",
          description: "Welcome to Lustina AI! 💋"
        });
        onAccessGranted();
      } else {
        toast({
          title: "Access Denied",
          description: "Invalid access code. Try again.",
          variant: "destructive"
        });
      }
      setIsLoading(false);
      setPassword('');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-rose-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-black/20 backdrop-blur-lg border-pink-500/30">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Lustina AI</h1>
          <p className="text-pink-200">Enter access code to continue</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Enter access code..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/10 border-pink-500/30 text-white placeholder:text-pink-200 focus:border-pink-400"
              disabled={isLoading}
            />
          </div>
          
          <Button
            type="submit"
            disabled={!password.trim() || isLoading}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-3"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Verifying...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4" />
                <span>Enter</span>
              </div>
            )}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-pink-300/60 text-sm">
            Adult content • Educational purposes only
          </p>
        </div>
      </Card>
    </div>
  );
};

export default EntryGate;
