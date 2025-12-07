import React, { useState, useMemo } from 'react';
import Navbar from './components/Navbar';
import Feed from './components/Feed';
import Search from './components/Search';
import Onboarding from './components/Onboarding';
import { Tab } from './types';
import { TRENDING_TWEETS, MY_FEED_TWEETS } from './constants';
import { GeminiService } from './services/geminiService';
import { audioController } from './services/audioService';
import { Menu } from 'lucide-react';

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<Tab>(Tab.Trending);

  // Initialize Gemini Service only when API Key is present
  const geminiService = useMemo(() => {
    if (!apiKey) return null;
    return new GeminiService(apiKey);
  }, [apiKey]);

  const handleOnboardingComplete = async (key: string) => {
    // Attempt to resume audio context on user interaction (form submit)
    await audioController.resumeContext();
    setApiKey(key);
  };

  if (!apiKey || !geminiService) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="relative w-full h-[100dvh] bg-black text-white font-sans overflow-hidden flex flex-col">
      
      {/* Top Header - Spotify Style */}
      <header className="absolute top-0 left-0 w-full z-40 px-4 py-3 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        {/* Logo / Brand (Left) */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
            {/* Simple Logo Icon */}
            <div className="w-4 h-4 bg-black rounded-full" />
          </div>
          <span className="font-bold text-lg tracking-tight">EchoX</span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4 pointer-events-auto">
          <button className="bg-white text-black text-xs font-bold px-4 py-2 rounded-full hover:scale-105 transition-transform">
            Open App
          </button>
          <button className="text-white">
            <Menu size={28} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full relative">
        {currentTab === Tab.Trending && (
          <Feed 
            tweets={TRENDING_TWEETS} 
            geminiService={geminiService} 
            feedTitle="Trending"
          />
        )}
        
        {currentTab === Tab.MyFeed && (
          <Feed 
            tweets={MY_FEED_TWEETS} 
            geminiService={geminiService} 
            feedTitle="My Feed"
          />
        )}
        
        {currentTab === Tab.Search && (
          <Search />
        )}
      </main>

      {/* Navigation */}
      <Navbar currentTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  );
};

export default App;