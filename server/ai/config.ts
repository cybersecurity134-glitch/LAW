// Universal Model Registry and Provider Configuration
// Centralized config file for updating model identifiers without changing code

export interface AIProviderConfig {
  id: 'gemini' | 'openai' | 'anthropic';
  name: string;
  enabled: boolean;
  models: {
    fast: string;
    longText: string;
    verification: string;
  };
  timeoutMs: number;
  envKeyName: string;
}

export interface AIModelsConfig {
  providers: {
    gemini: AIProviderConfig;
    openai: AIProviderConfig;
    anthropic: AIProviderConfig;
  };
  // Default routing strategy
  routing: {
    quickAnswer: 'fast';
    articleSummary: 'longText';
    newsVerification: 'all_parallel';
  };
  // Fallback order when a provider fails, times out, or hits rate limits
  fallbackOrder: Array<'gemini' | 'openai' | 'anthropic'>;
  providerTimeoutMs: number;
  rateLimitPerUserPerMinute: number;
  maxChatHistoryMessages: number;
  cacheTtlMinutes: number;
}

export const DEFAULT_AI_CONFIG: AIModelsConfig = {
  providers: {
    gemini: {
      id: 'gemini',
      name: 'Google Gemini',
      enabled: true,
      models: {
        fast: 'gemini-3.8-flash',
        longText: 'gemini-3.8-flash',
        verification: 'gemini-3.8-flash',
      },
      timeoutMs: 8000,
      envKeyName: 'GEMINI_API_KEY',
    },
    openai: {
      id: 'openai',
      name: 'OpenAI (ChatGPT)',
      enabled: true,
      models: {
        fast: 'gpt-4o-mini',
        longText: 'gpt-4o',
        verification: 'gpt-4o',
      },
      timeoutMs: 8000,
      envKeyName: 'OPENAI_API_KEY',
    },
    anthropic: {
      id: 'anthropic',
      name: 'Anthropic Claude',
      enabled: true,
      models: {
        fast: 'claude-3-5-haiku-20241022',
        longText: 'claude-3-7-sonnet-20250219',
        verification: 'claude-3-7-sonnet-20250219',
      },
      timeoutMs: 8000,
      envKeyName: 'ANTHROPIC_API_KEY',
    },
  },
  routing: {
    quickAnswer: 'fast',
    articleSummary: 'longText',
    newsVerification: 'all_parallel',
  },
  fallbackOrder: ['gemini', 'openai', 'anthropic'],
  providerTimeoutMs: 8000, // 8 seconds timeout per provider
  rateLimitPerUserPerMinute: 20,
  maxChatHistoryMessages: 8, // Between 5 to 10 messages of chat history
  cacheTtlMinutes: 15,
};
