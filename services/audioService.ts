// Decodes base64 string to raw bytes
export function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Decodes raw PCM data to AudioBuffer
export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      // Convert int16 to float (-1.0 to 1.0)
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export class AudioController {
  private ctx: AudioContext;
  private currentSource: AudioBufferSourceNode | null = null;
  private gainNode: GainNode;
  
  constructor() {
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    this.gainNode = this.ctx.createGain();
    this.gainNode.connect(this.ctx.destination);
  }

  async resumeContext() {
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
  }

  async pause() {
    if (this.ctx.state === 'running') {
      await this.ctx.suspend();
    }
  }

  async play(buffer: AudioBuffer, onEnded?: () => void): Promise<void> {
    this.stop(); // Stop any currently playing audio node
    
    await this.resumeContext();

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(this.gainNode);
    
    source.onended = () => {
      if (onEnded) onEnded();
    };

    source.start();
    this.currentSource = source;
  }

  stop() {
    if (this.currentSource) {
      try {
        this.currentSource.stop();
        this.currentSource.disconnect();
      } catch (e) {
        // Ignore errors if already stopped
      }
      this.currentSource = null;
    }
  }
  
  getContext() {
    return this.ctx;
  }
}

export const audioController = new AudioController();