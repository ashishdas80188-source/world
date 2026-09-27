import { VoiceSettings } from '../types/settings';

export interface VoiceStatus {
  isSynthesizerSupported: boolean;
  isRecognitionSupported: boolean;
  availableVoices: SpeechSynthesisVoice[];
  hasExactLocaleVoice: boolean;
}

export class VoiceService {
  private static recognitionInstance: any = null;
  private static isListening: boolean = false;

  public static checkSupport(): VoiceStatus {
    const isSynthesizerSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
    const isRecognitionSupported =
      typeof window !== 'undefined' &&
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

    const availableVoices = isSynthesizerSupported ? window.speechSynthesis.getVoices() : [];

    return {
      isSynthesizerSupported,
      isRecognitionSupported,
      availableVoices,
      hasExactLocaleVoice: availableVoices.length > 0,
    };
  }

  public static getVoices(): Promise<SpeechSynthesisVoice[]> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        return resolve([]);
      }

      let voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        return resolve(voices);
      }

      // Voice loading event in Chrome / Safari
      window.speechSynthesis.onvoiceschanged = () => {
        voices = window.speechSynthesis.getVoices();
        resolve(voices);
      };

      // Fallback timeout in case event doesn't fire
      setTimeout(() => {
        resolve(window.speechSynthesis.getVoices());
      }, 500);
    });
  }

  public static speak(
    text: string,
    settings: VoiceSettings,
    targetLocaleBcp47: string = 'en-US'
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        return reject(new Error('Speech synthesis is unsupported on this browser'));
      }

      window.speechSynthesis.cancel(); // cancel pending speech

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = settings.rate;
      utterance.pitch = settings.pitch;
      utterance.volume = settings.volume;

      const voices = window.speechSynthesis.getVoices();
      let matchedVoice: SpeechSynthesisVoice | undefined;

      // 1. Check user configured voice URI
      if (settings.voiceUri && settings.voiceUri !== 'auto') {
        matchedVoice = voices.find((v) => v.voiceURI === settings.voiceUri);
      }

      // 2. Try matching target language locale
      if (!matchedVoice) {
        const langCode = targetLocaleBcp47.split('-')[0].toLowerCase();
        matchedVoice = voices.find(
          (v) =>
            v.lang.toLowerCase() === targetLocaleBcp47.toLowerCase() ||
            v.lang.toLowerCase().startsWith(langCode)
        );
      }

      // 3. Fallback to default
      if (matchedVoice) {
        utterance.voice = matchedVoice;
        utterance.lang = matchedVoice.lang;
      } else {
        utterance.lang = targetLocaleBcp47;
      }

      utterance.onend = () => resolve();
      utterance.onerror = (e) => reject(e);

      window.speechSynthesis.speak(utterance);
    });
  }

  public static stopSpeaking(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public static startListening(
    bcp47: string,
    onResult: (transcript: string) => void,
    onError: (err: string) => void,
    onEnd: () => void
  ): () => void {
    if (typeof window === 'undefined') {
      onError('Environment does not support audio input');
      return () => {};
    }

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      onError('Speech Recognition is not supported on this browser');
      return () => {};
    }

    if (this.isListening && this.recognitionInstance) {
      try {
        this.recognitionInstance.abort();
      } catch {}
    }

    try {
      const recognition = new SpeechRec();
      this.recognitionInstance = recognition;
      this.isListening = true;

      recognition.lang = bcp47;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          onResult(finalTranscript);
        } else if (event.results[0] && event.results[0][0]) {
          onResult(event.results[0][0].transcript);
        }
      };

      recognition.onerror = (event: any) => {
        this.isListening = false;
        onError(event.error || 'Speech recognition error');
      };

      recognition.onend = () => {
        this.isListening = false;
        onEnd();
      };

      recognition.start();

      return () => {
        try {
          this.isListening = false;
          recognition.stop();
        } catch {}
      };
    } catch (e: any) {
      this.isListening = false;
      onError(e.message || 'Failed to start microphone');
      return () => {};
    }
  }
}
