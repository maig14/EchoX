import React, { useState, useEffect, useRef } from 'react';
import { Tweet } from '../types';
import { GeminiService } from '../services/geminiService';
import { audioController } from '../services/audioService';
import AudioCard from './AudioCard';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat } from 'lucide-react';

interface FeedProps {
  tweets: Tweet[];
  geminiService: GeminiService;
  feedTitle: string;
}

const Feed: React.FC<FeedProps> = ({ tweets, geminiService, feedTitle }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Track Data
  const [summary, setSummary] = useState<string | null>(null);
  
  // Progress
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const progressInterval = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Load current track data when index changes
  useEffect(() => {
    let mounted = true;
    
    const loadTrack = async () => {
      setIsLoading(true);
      setSummary(null);
      setProgress(0);
      setCurrentTime(0);
      setDuration(0); // Reset duration while loading
      
      // Stop previous track if playing
      audioController.stop();

      const tweet = tweets[currentIndex];
      
      try {
        const data = await geminiService.processTweet(tweet.id, tweet.content);
        
        if (mounted && data) {
          setSummary(data.summary);
          setDuration(data.audioBuffer.duration);
          
          // Auto-play
          await playAudio(data.audioBuffer);
        }
      } catch (e) {
        console.error("Error loading track", e);
        if (mounted) setIsLoading(false);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadTrack();

    return () => { 
      mounted = false; 
      stopProgressLoop();
      audioController.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, tweets]); // Reload when index or playlist changes

  const startProgressLoop = () => {
    stopProgressLoop();
    progressInterval.current = window.setInterval(() => {
      const ctx = audioController.getContext();
      // Calculate elapsed time relative to when we started this specific track segment
      const curr = ctx.currentTime - startTimeRef.current;
      
      if (curr >= duration && duration > 0) {
        // Handled by onEnded, but just in case
        setProgress(100);
      } else {
        setCurrentTime(curr);
        setProgress((curr / duration) * 100);
      }
    }, 100);
  };

  const stopProgressLoop = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  };

  const playAudio = async (buffer: AudioBuffer) => {
    // Set start time to now
    startTimeRef.current = audioController.getContext().currentTime;
    
    await audioController.play(buffer, () => {
      handleTrackEnd();
    });
    
    setIsPlaying(true);
    startProgressLoop();
  };

  const handleTrackEnd = () => {
    stopProgressLoop();
    setIsPlaying(false);
    setProgress(100);
    // Auto-advance
    handleNext();
  };

  const togglePlay = async () => {
    if (isLoading) return;

    if (isPlaying) {
      await audioController.pause();
      setIsPlaying(false);
      stopProgressLoop();
    } else {
      await audioController.resumeContext();
      setIsPlaying(true);
      startProgressLoop();
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % tweets.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + tweets.length) % tweets.length);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-gray-900 to-black text-white pb-24 relative">
      {/* Feed Header - Reduced top padding */}
      <div className="pt-20 px-6 pb-2 shrink-0 z-10">
        <h3 className="text-xs font-bold tracking-widest text-gray-400 uppercase">Playing From {feedTitle}</h3>
      </div>

      {/* Main Card Area - min-h-0 allows it to shrink */}
      <div className="flex-1 min-h-0 w-full">
        <AudioCard 
          tweet={tweets[currentIndex]} 
          summary={summary} 
          isLoading={isLoading} 
        />
      </div>

      {/* Player Controls - Spotify Style */}
      <div className="px-6 pb-4 pt-2 shrink-0 space-y-4 z-20">
        
        {/* Progress Bar */}
        <div className="w-full space-y-1.5 group">
          <div className="relative w-full h-1 bg-gray-600 rounded-full overflow-hidden">
             <div 
               className="absolute top-0 left-0 h-full bg-white rounded-full transition-all duration-100 ease-linear group-hover:bg-echo-green"
               style={{ width: `${Math.min(progress, 100)}%` }}
             />
          </div>
          <div className="flex justify-between text-[10px] font-medium text-gray-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between px-2">
          <button className="text-gray-400 hover:text-white transition-colors">
            <Shuffle size={20} />
          </button>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={handlePrev}
              className="text-white hover:scale-110 transition-transform"
            >
              <SkipBack size={28} fill="currentColor" />
            </button>

            <button 
              onClick={togglePlay}
              className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform shadow-lg shadow-white/10"
              disabled={isLoading}
            >
               {isLoading ? (
                 <div className="w-6 h-6 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
               ) : isPlaying ? (
                 <Pause size={30} fill="currentColor" />
               ) : (
                 <Play size={30} fill="currentColor" className="ml-1" />
               )}
            </button>

            <button 
              onClick={handleNext}
              className="text-white hover:scale-110 transition-transform"
            >
              <SkipForward size={28} fill="currentColor" />
            </button>
          </div>

          <button className="text-gray-400 hover:text-white transition-colors">
            <Repeat size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Feed;