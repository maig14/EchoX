import React, { useState } from 'react';
import { Key, Sparkles } from 'lucide-react';

interface OnboardingProps {
  onComplete: (apiKey: string) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [key, setKey] = useState(process.env.API_KEY || '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) {
      setError('Please enter a valid API key');
      return;
    }
    // Simple validation could go here
    onComplete(key);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative BG */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-echo-green/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-echo-purple/20 rounded-full blur-[100px]" />

      <div className="z-10 w-full max-w-sm space-y-8 text-center">
        <div className="space-y-2">
          <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-echo-green to-echo-purple rounded-xl flex items-center justify-center mb-6">
            <Sparkles className="text-white w-8 h-8" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter">EchoX</h1>
          <p className="text-gray-400 text-lg">Your X feed, reimagined as a podcast.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-8">
          <div className="space-y-2 text-left">
            <label className="text-sm font-medium text-gray-400 ml-1">Gemini API Key</label>
            <div className="relative">
              <Key className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
              <input
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-gray-900 border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-echo-green focus:border-transparent transition-all"
              />
            </div>
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          >
            Start Listening
          </button>
        </form>

        <p className="text-xs text-gray-600 pt-8 max-w-xs mx-auto">
          EchoX uses Google Gemini 2.5 Flash to summarize posts and generate real-time audio. An API key is required for the demo.
        </p>
      </div>
    </div>
  );
};

export default Onboarding;