
import { useState } from 'react';
import EntryGate from '@/components/EntryGate';
import ApiKeySetup from '@/components/ApiKeySetup';
import PublicChat from '@/components/PublicChat';

type AppState = 'entry' | 'api-setup' | 'chat';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('entry');
  const [apiKey, setApiKey] = useState('');

  const handleAccessGranted = () => {
    setAppState('api-setup');
  };

  const handleApiKeySet = (key: string) => {
    setApiKey(key);
    setAppState('chat');
  };

  const handleLogout = () => {
    setAppState('entry');
    setApiKey('');
  };

  const handleBackToEntry = () => {
    setAppState('entry');
  };

  if (appState === 'entry') {
    return <EntryGate onAccessGranted={handleAccessGranted} />;
  }

  if (appState === 'api-setup') {
    return <ApiKeySetup onApiKeySet={handleApiKeySet} onBack={handleBackToEntry} />;
  }

  return <PublicChat onLogout={handleLogout} apiKey={apiKey} />;
};

export default Index;
