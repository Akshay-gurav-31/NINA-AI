
import { useState } from 'react';
import EntryGate from '@/components/EntryGate';
import PublicChat from '@/components/PublicChat';

type AppState = 'entry' | 'chat';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('entry');
  
  // Direct API key integration
  const apiKey = 'AIzaSyD0ob8GO26DNiK0e3wgd0u5deOTdK37_ig';

  const handleAccessGranted = () => {
    setAppState('chat');
  };

  const handleLogout = () => {
    setAppState('entry');
  };

  if (appState === 'entry') {
    return <EntryGate onAccessGranted={handleAccessGranted} />;
  }

  return <PublicChat onLogout={handleLogout} apiKey={apiKey} />;
};

export default Index;
