import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT_SUMMARY } from "../constants";
import { getXAIService, GrokVoice } from "./xaiService";

// All available Grok voices for variety
const GROK_VOICES: GrokVoice[] = ['Ara', 'Rex', 'Sal', 'Eve', 'Una', 'Leo'];

interface CacheEntry {
  summary: string;
  audioBuffer: AudioBuffer;
  voice: GrokVoice;
}

export class GeminiService {
  private ai: GoogleGenAI;
  private cache: Map<string, CacheEntry>;
  private voiceIndex: number = 0;
  private useRandomVoice: boolean = true; // Set to false to cycle sequentially

  constructor(apiKey: string) {
    console.log('Initializing GeminiService with API key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'MISSING');
    this.ai = new GoogleGenAI({ apiKey });
    this.cache = new Map();
  }

  // Get next voice - either random or sequential cycling
  private getNextVoice(): GrokVoice {
    if (this.useRandomVoice) {
      // Random voice selection
      const randomIndex = Math.floor(Math.random() * GROK_VOICES.length);
      const voice = GROK_VOICES[randomIndex];
      console.log(`🎤 Selected random voice: ${voice}`);
      return voice;
    } else {
      // Sequential cycling through voices
      const voice = GROK_VOICES[this.voiceIndex];
      this.voiceIndex = (this.voiceIndex + 1) % GROK_VOICES.length;
      console.log(`🎤 Cycling to voice: ${voice} (index: ${this.voiceIndex})`);
      return voice;
    }
  }

  // Set whether to use random or sequential voice selection
  setVoiceMode(random: boolean) {
    this.useRandomVoice = random;
    console.log(`🎤 Voice mode: ${random ? 'Random' : 'Sequential'}`);
  }

  // Check if we have data for this tweet ID
  getCachedData(tweetId: string): CacheEntry | undefined {
    return this.cache.get(tweetId);
  }

  // Step 1: Summarize the tweet text
  async summarizeTweet(tweetContent: string): Promise<string> {
    console.log('Summarizing tweet:', tweetContent.substring(0, 50));
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: `Original Post: "${tweetContent}". \n\nInstruction: ${SYSTEM_PROMPT_SUMMARY}`,
      });
      const summary = response.text || "Could not generate summary.";
      console.log('Summary generated:', summary.substring(0, 50));
      return summary;
    } catch (error) {
      console.error("Summarization error:", error);
      return "Error generating summary.";
    }
  }

  // Step 2: Generate Audio from the summary using Grok TTS (xAI)
  async generateAudio(text: string, voice?: GrokVoice): Promise<{ audioBuffer: AudioBuffer; voice: GrokVoice } | null> {
    const selectedVoice = voice || this.getNextVoice();
    console.log(`🎤 Generating audio with Grok TTS (voice: ${selectedVoice}) for:`, text.substring(0, 50));
    
    const xaiService = getXAIService();
    
    if (!xaiService) {
      console.error('xAI service not available for TTS - check XAI_API_KEY');
      return null;
    }

    try {
      const audioBuffer = await xaiService.textToSpeech({
        text,
        voice: selectedVoice,
        responseFormat: 'wav', // WAV works well with Web Audio API
      });

      if (audioBuffer) {
        console.log(`✅ Grok TTS (${selectedVoice}) audio buffer created, duration:`, audioBuffer.duration.toFixed(2) + 's');
        return { audioBuffer, voice: selectedVoice };
      }
      
      return null;
    } catch (error) {
      console.error("Grok TTS error:", error);
      return null;
    }
  }

  /**
   * Process a tweet/trend for audio playback
   * @param tweetId - Unique ID for caching
   * @param content - The raw content (used if no podcastScript)
   * @param podcastScript - Pre-written podcast narration (skips summarization if provided)
   */
  async processTweet(tweetId: string, content: string, podcastScript?: string): Promise<{ summary: string; audioBuffer: AudioBuffer; voice?: GrokVoice } | null> {
    console.log('🎙️ Processing content:', tweetId);
    
    if (this.cache.has(tweetId)) {
      const cached = this.cache.get(tweetId)!;
      console.log(`✅ Returning cached data for: ${tweetId} (voice: ${cached.voice})`);
      return cached;
    }

    // Use podcast script directly if available, otherwise summarize
    let textForAudio: string;
    
    if (podcastScript && podcastScript.length > 10) {
      console.log('🎙️ Using pre-written podcast script');
      textForAudio = podcastScript;
    } else {
      console.log('📝 No podcast script, generating summary...');
      textForAudio = await this.summarizeTweet(content);
    }

    const result = await this.generateAudio(textForAudio);

    if (textForAudio && result) {
      console.log(`✅ Successfully processed: ${tweetId} with voice: ${result.voice}`);
      const entry: CacheEntry = { 
        summary: textForAudio, 
        audioBuffer: result.audioBuffer, 
        voice: result.voice 
      };
      this.cache.set(tweetId, entry);
      return entry;
    }
    
    console.error('❌ Failed to process:', tweetId, 'text:', !!textForAudio, 'audio:', !!result);
    return null;
  }
}