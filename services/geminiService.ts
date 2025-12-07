import { GoogleGenAI, Modality } from "@google/genai";
import { SYSTEM_PROMPT_SUMMARY } from "../constants";
import { decode, decodeAudioData, audioController } from "./audioService";

interface CacheEntry {
  summary: string;
  audioBuffer: AudioBuffer;
}

export class GeminiService {
  private ai: GoogleGenAI;
  private cache: Map<string, CacheEntry>;

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
    this.cache = new Map();
  }

  // Check if we have data for this tweet ID
  getCachedData(tweetId: string): CacheEntry | undefined {
    return this.cache.get(tweetId);
  }

  // Step 1: Summarize the tweet text
  async summarizeTweet(tweetContent: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Original Post: "${tweetContent}". \n\nInstruction: ${SYSTEM_PROMPT_SUMMARY}`,
      });
      return response.text || "Could not generate summary.";
    } catch (error) {
      console.error("Summarization error:", error);
      return "Error generating summary.";
    }
  }

  // Step 2: Generate Audio from the summary
  async generateAudio(text: string, voiceName: 'Kore' | 'Fenrir' | 'Puck' | 'Charon' = 'Kore'): Promise<AudioBuffer | null> {
    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      
      if (!base64Audio) {
        throw new Error("No audio data returned");
      }

      const audioBytes = decode(base64Audio);
      const audioBuffer = await decodeAudioData(
        audioBytes, 
        audioController.getContext(), 
        24000, 
        1
      );

      return audioBuffer;

    } catch (error) {
      console.error("TTS error:", error);
      return null;
    }
  }

  async processTweet(tweetId: string, content: string): Promise<CacheEntry | null> {
    if (this.cache.has(tweetId)) {
      return this.cache.get(tweetId)!;
    }

    const summary = await this.summarizeTweet(content);
    const audioBuffer = await this.generateAudio(summary);

    if (summary && audioBuffer) {
      const entry = { summary, audioBuffer };
      this.cache.set(tweetId, entry);
      return entry;
    }
    return null;
  }
}