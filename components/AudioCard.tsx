import React from 'react';
import { Tweet } from '../types';
import { Loader2 } from 'lucide-react';

interface AudioCardProps {
  tweet: Tweet;
  summary: string | null;
  isLoading: boolean;
}

const AudioCard: React.FC<AudioCardProps> = ({ tweet, summary, isLoading }) => {
  // Use tweet image if available, otherwise high-res user avatar, otherwise standard avatar
  const displayImage = tweet.imageUrl || tweet.user.avatar;

  return (
    <div className="w-full h-full flex flex-col items-center px-6 relative overflow-hidden">
      
      {/* Background Ambience - blurred version of image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div 
          className="w-full h-full bg-cover bg-center blur-3xl opacity-30 scale-125 transition-all duration-700"
          style={{ backgroundImage: `url(${displayImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black" />
      </div>

      {/* Main Content Wrapper */}
      <div className="z-10 w-full max-w-sm flex flex-col h-full py-2">
        
        {/* Flexible Image Container - This shrinks if needed */}
        <div className="flex-1 min-h-0 flex items-center justify-center py-4">
          <div className="relative w-full h-full max-h-full aspect-square shadow-2xl rounded-xl overflow-hidden border border-white/10 bg-gray-900">
             <img 
              src={displayImage} 
              alt="Content" 
              className="w-full h-full object-cover"
            />
             {/* Badge */}
            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white border border-white/10">
              {tweet.topic || 'Trending'}
            </div>
          </div>
        </div>

        {/* Track Info & Summary - Fixed Height Content */}
        <div className="shrink-0 space-y-4 pb-2">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-white leading-tight line-clamp-1">{tweet.user.name}</h2>
              <p className="text-gray-400 text-sm font-medium">{tweet.user.handle}</p>
            </div>
          </div>

          {/* AI Summary / Lyrics View */}
          <div className="relative min-h-[100px]">
             {isLoading ? (
               <div className="flex flex-col items-center justify-center h-24 gap-3 text-echo-green animate-pulse">
                 <Loader2 className="animate-spin w-6 h-6" />
                 <span className="text-xs font-medium tracking-wide uppercase">Synthesizing...</span>
               </div>
             ) : (
               <div className="space-y-2">
                 <p className="text-lg font-medium text-white leading-relaxed line-clamp-4">
                   {summary ? `"${summary}"` : tweet.content}
                 </p>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioCard;