import { useState, useEffect, useRef, useCallback } from 'react';
import { normalizeIndicNumerals } from '../data/languages';

export interface UseSpeechRecognitionOptions {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
}

export interface UseSpeechRecognitionReturn {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  error: string | null;
  currentLang: string;
  startListening: () => void;
  stopListening: () => void;
  toggleListening: () => void;
  clearError: () => void;
}

/**
 * Intelligent multilingual voice command pre-processor for Indian legal search.
 * Trims regional voice command triggers, normalizes Indic numerals into standard digits,
 * and harmonizes statutory section references (e.g. "धारा 420", "సెక్షన్ 420", "பிரிவு 420" -> "Section 420").
 */
export function cleanLegalVoiceQuery(raw: string, _lang?: string): string {
  if (!raw) return '';

  // 1. Normalize Indic regional digits (Devanagari, Bengali, Telugu, Tamil, Gujarati, etc.) into 0-9
  let cleaned = normalizeIndicNumerals(raw.trim());

  // 2. Remove leading voice command triggers (English & Indian regional languages)
  const prefixes = [
    // English triggers
    /^(?:please\s+)?search\s+(?:for\s+)?/i,
    /^(?:please\s+)?find\s+(?:law\s+on\s+|statute\s+for\s+|section\s+for\s+|)/i,
    /^(?:please\s+)?look\s+up\s+/i,
    /^(?:what\s+is\s+the\s+(?:law|penalty|punishment|fine|section)\s+(?:for|on|about)\s+)/i,
    /^(?:show\s+me\s+(?:laws|sections|information|rules)\s+(?:about|on|for)\s+)/i,
    /^(?:tell\s+me\s+about\s+)/i,

    // Hindi / Urdu prefixes
    /^(?:कृपया\s+)?(?:खोजें|ढूंढें|बताएं|तलाश करें)\s+/i,
    /^(?:के बारे में बताएं|की धारा बताएं|का कानून बताएं)\s+/i,

    // Telugu prefixes
    /^(?:దయచేసి\s+)?(?:వెతకండి|చూపించండి|చెప్పండి)\s+/i,

    // Tamil prefixes
    /^(?:தயவுசெய்து\s+)?(?:தேடுங்கள்|தேடு|சொல்லுங்கள்)\s+/i,

    // Marathi prefixes
    /^(?:कृपया\s+)?(?:शोधा|सांगा|माहिती द्या)\s+/i,

    // Bengali prefixes
    /^(?:দয়া করে\s+)?(?:খুঁজুন|বলুন|দেখান)\s+/i,

    // Gujarati prefixes
    /^(?:કૃપા કરીને\s+)?(?:શોધો|જણાવો|બતાવો)\s+/i,

    // Kannada prefixes
    /^(?:ದಯವಿಟ್ಟು\s+)?(?:ಹುಡುಕಿ|ತಿಳಿಸಿ|ತೋರಿಸಿ)\s+/i,

    // Malayalam prefixes
    /^(?:ദയവായി\s+)?(?:തിരയുക|പറയുക|കാണിക്കുക)\s+/i,

    // Punjabi prefixes
    /^(?:ਕਿਰਪਾ ਕਰਕੇ\s+)?(?:ਲੱਭੋ|ਦੱਸੋ|ਦਿਖਾਓ)\s+/i
  ];

  for (const rx of prefixes) {
    if (rx.test(cleaned)) {
      cleaned = cleaned.replace(rx, '').trim();
      break;
    }
  }

  // 3. Remove trailing command triggers (e.g. "...की सजा क्या है", "...గురించి చెప్పండి", "...பற்றி சொல்")
  const suffixes = [
    /\s+(?:खोजें|ढूंढें|बताएं|की धारा क्या है|की सजा क्या है|का क्या नियम है)$/i,
    /\s+(?:గురించి చెప్పండి|చట్టం ఏమిటి|శిక్ష ఏమిటి)$/i,
    /\s+(?:பற்றி சொல்லுங்கள்|சட்டம் என்ன|தண்டனை என்ன)$/i,
    /\s+(?:बद्दल सांगा|कायदा काय आहे|शिक्षा काय आहे)$/i,
    /\s+(?:সম্পর্কে বলুন|আইন কি|শাস্তি কি)$/i,
    /\s+(?:વિશે જણાવો|કાયદો શું છે|સજા શું છે)$/i,
    /\s+(?:ಬಗ್ಗೆ ತಿಳಿಸಿ|ಕಾನೂನು ಏನು|ಶಿಕ್ಷೆ ಏನು)$/i,
    /\s+(?:കുറിച്ച് പറയുക|നിയമം എന്താണ്|ശിക്ഷ എന്താണ്)$/i,
    /\s+(?:ਬਾਰੇ ਦੱਸੋ|ਕਾਨੂੰਨ ਕੀ ਹੈ|ਸਜ਼ਾ ਕੀ ਹੈ)$/i
  ];

  for (const rx of suffixes) {
    if (rx.test(cleaned)) {
      cleaned = cleaned.replace(rx, '').trim();
      break;
    }
  }

  // 4. Standardize regional "Section" words followed by a number to "Section <number>"
  // Covers Hindi (धारा), Marathi (कलम), Telugu (సెక్షన్), Tamil (பிரிவு), Kannada (ವಿಭಾಗ), Malayalam (വകുപ്പ്), Punjabi (ਧਾਰਾ), Odia (ଦଫା), Urdu (دفعہ)
  cleaned = cleaned.replace(
    /(?:धारा|कलम|दफा|సెక్షన్|విభాగం|பிரிவு|செக்ஷன்|ವಿಭಾಗ|ಕಲಂ|വകുപ്പ്|സെക്ഷൻ|ਧਾਰਾ|ଦଫା|دفعہ)\s*(\d+[A-Za-z]?)/gi,
    'Section $1'
  );

  // 5. Remove trailing periods, question marks, and Indic dandas (।)
  cleaned = cleaned.replace(/[?.!।]+$/, '').trim();

  return cleaned || raw.trim();
}

export function useSpeechRecognition(
  options: UseSpeechRecognitionOptions = {}
): UseSpeechRecognitionReturn {
  const {
    lang = 'en-IN',
    continuous = false,
    interimResults = true,
    onResult,
    onError,
    onEnd
  } = options;

  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(true);

  const recognitionRef = useRef<any>(null);
  const langRef = useRef(lang);
  const onResultRef = useRef(onResult);
  const onErrorRef = useRef(onError);
  const onEndRef = useRef(onEnd);

  // Keep callback refs and lang dynamically updated
  useEffect(() => {
    onResultRef.current = onResult;
    onErrorRef.current = onError;
    onEndRef.current = onEnd;
  });

  // Dynamically synchronize SpeechRecognition.lang when profile setting updates
  useEffect(() => {
    langRef.current = lang;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.lang = lang;
      } catch {
        // Some browser engines do not allow mutating lang mid-session; will apply on next start
      }
    }
  }, [lang]);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        // Ignored if already stopped
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      const msg = 'Speech recognition is not supported in this browser. Try Chrome, Edge, or Safari.';
      setError(msg);
      onErrorRef.current?.(msg);
      return;
    }

    // Stop any existing instance
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
      recognitionRef.current = null;
    }

    setError(null);
    setTranscript('');

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = continuous;
      recognition.interimResults = interimResults;
      // Dynamically use current language from user profile settings
      recognition.lang = langRef.current || lang || 'en-IN';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        let isFinal = false;

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          const text = res[0]?.transcript || '';
          currentTranscript += text;
          if (res.isFinal) {
            isFinal = true;
          }
        }

        const cleaned = cleanLegalVoiceQuery(currentTranscript, langRef.current);
        setTranscript(cleaned);
        onResultRef.current?.(cleaned, isFinal);
      };

      recognition.onerror = (event: any) => {
        let errMessage = 'Speech recognition error occurred';
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          errMessage = 'Microphone permission denied. Please allow microphone access in browser settings.';
        } else if (event.error === 'no-speech') {
          errMessage = 'No speech detected. Please speak clearly into your microphone.';
        } else if (event.error === 'network') {
          errMessage = 'Network error with speech recognition service.';
        } else if (event.error === 'language-not-supported') {
          errMessage = `Language "${langRef.current}" is not installed or supported on this system. Falling back to English (India).`;
          langRef.current = 'en-IN';
        } else if (event.error === 'aborted') {
          // Normal abort, don't show user alert
          return;
        }

        setError(errMessage);
        onErrorRef.current?.(errMessage);
        stopListening();
      };

      recognition.onend = () => {
        setIsListening(false);
        onEndRef.current?.();
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      const msg = err?.message || 'Unable to access microphone for speech recognition.';
      setError(msg);
      onErrorRef.current?.(msg);
      setIsListening(false);
    }
  }, [continuous, interimResults, lang, stopListening]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
        recognitionRef.current = null;
      }
    };
  }, []);

  return {
    isListening,
    isSupported,
    transcript,
    error,
    currentLang: langRef.current || lang,
    startListening,
    stopListening,
    toggleListening,
    clearError,
  };
}
