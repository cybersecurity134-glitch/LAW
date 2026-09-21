export interface SupportedLanguage {
  code: string;           // BCP-47 tag, e.g. 'hi-IN'
  name: string;           // English name, e.g. 'Hindi'
  nativeName: string;     // Native script, e.g. 'हिन्दी'
  sampleVoicePrompt: string; // Everyday search example
  associatedStates?: string[]; // States where this is a primary official/regional language
}

export const SUPPORTED_REGIONAL_LANGUAGES: SupportedLanguage[] = [
  {
    code: 'en-IN',
    name: 'English (India)',
    nativeName: 'English',
    sampleVoicePrompt: 'Section 420 or Bailable offence',
    associatedStates: []
  },
  {
    code: 'hi-IN',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    sampleVoicePrompt: 'धारा 420 या जमानत के नियम',
    associatedStates: [
      'Uttar Pradesh',
      'Delhi',
      'Madhya Pradesh',
      'Bihar',
      'Rajasthan',
      'Haryana',
      'Uttarakhand',
      'Himachal Pradesh',
      'Jharkhand',
      'Chhattisgarh'
    ]
  },
  {
    code: 'te-IN',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    sampleVoicePrompt: 'సెక్షన్ 420 లేదా బెయిల్ నియమాలు',
    associatedStates: ['Telangana', 'Andhra Pradesh']
  },
  {
    code: 'ta-IN',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    sampleVoicePrompt: 'பிரிவு 420 அல்லது ஜாமீன் விதிகள்',
    associatedStates: ['Tamil Nadu', 'Puducherry']
  },
  {
    code: 'mr-IN',
    name: 'Marathi',
    nativeName: 'मराठी',
    sampleVoicePrompt: 'कलम 302 किंवा जामीन तरतुदी',
    associatedStates: ['Maharashtra', 'Goa']
  },
  {
    code: 'bn-IN',
    name: 'Bengali',
    nativeName: 'বাংলা',
    sampleVoicePrompt: 'ধারা ৪২০ বা জামিন সংক্রান্ত আইন',
    associatedStates: ['West Bengal', 'Tripura']
  },
  {
    code: 'gu-IN',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    sampleVoicePrompt: 'કલમ 420 અથવા જામીનના નિયમો',
    associatedStates: ['Gujarat']
  },
  {
    code: 'kn-IN',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    sampleVoicePrompt: 'ವಿಭಾಗ 420 ಅಥವಾ ಜಾಮೀನು ನಿಯಮಗಳು',
    associatedStates: ['Karnataka']
  },
  {
    code: 'ml-IN',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    sampleVoicePrompt: 'വകുപ്പ് 420 അല്ലെങ്കിൽ ജാമ്യം',
    associatedStates: ['Kerala', 'Lakshadweep']
  },
  {
    code: 'pa-IN',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    sampleVoicePrompt: 'ਧਾਰਾ 420 ਜਾਂ ਜ਼ਮਾਨਤ ਦੇ ਨਿਯਮ',
    associatedStates: ['Punjab', 'Chandigarh']
  },
  {
    code: 'or-IN',
    name: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    sampleVoicePrompt: 'ଦଫା ୪୨୦ କିମ୍ବା ଜାମିନ ନିୟମ',
    associatedStates: ['Odisha']
  },
  {
    code: 'ur-IN',
    name: 'Urdu',
    nativeName: 'اردو',
    sampleVoicePrompt: 'دفعہ 420 یا ضمانت کے قوانین',
    associatedStates: ['Jammu and Kashmir']
  }
];

/**
 * Resolves the effective voice language based on the user profile preferences.
 * If user has explicitly selected a voice_language in profile, uses that.
 * Otherwise, falls back to the regional language mapped from their state, or English (India).
 */
export function getEffectiveVoiceLanguage(preferences?: {
  voice_language?: string;
  state?: string;
}): SupportedLanguage {
  if (preferences?.voice_language) {
    const found = SUPPORTED_REGIONAL_LANGUAGES.find(
      lang => lang.code.toLowerCase() === preferences.voice_language?.toLowerCase()
    );
    if (found) return found;
  }

  // Infer from user's state setting if available
  if (preferences?.state) {
    const matchedState = preferences.state.trim().toLowerCase();
    const stateMatchedLang = SUPPORTED_REGIONAL_LANGUAGES.find(lang =>
      lang.associatedStates?.some(st => st.toLowerCase() === matchedState)
    );
    if (stateMatchedLang) {
      return stateMatchedLang;
    }
  }

  // Default to English (India)
  return SUPPORTED_REGIONAL_LANGUAGES[0];
}

/**
 * Normalizes Indian Indic numerals into Western Arabic digits (0-9)
 * so that sections dictated in regional languages match statutory database section records.
 */
export function normalizeIndicNumerals(text: string): string {
  const indicDigitMap: Record<string, string> = {
    // Devanagari (Hindi, Marathi)
    '०': '0', '१': '1', '२': '2', '३': '3', '४': '4', '५': '5', '६': '6', '७': '7', '८': '8', '९': '9',
    // Bengali
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4', '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9',
    // Gurmukhi (Punjabi)
    '੦': '0', '੧': '1', '੨': '2', '੩': '3', '੪': '4', '੫': '5', '੬': '6', '੭': '7', '੮': '8', '੯': '9',
    // Gujarati
    '૦': '0', '૧': '1', '૨': '2', '૩': '3', '૪': '4', '૫': '5', '૬': '6', '૭': '7', '૮': '8', '૯': '9',
    // Odia
    '୦': '0', '୧': '1', '୨': '2', '୩': '3', '୪': '4', '୫': '5', '୬': '6', '୭': '7', '୮': '8', '୯': '9',
    // Telugu
    '౦': '0', '౧': '1', '౨': '2', '౩': '3', '౪': '4', '౫': '5', '౬': '6', '౭': '7', '౮': '8', '౯': '9',
    // Kannada
    '೦': '0', '೧': '1', '೨': '2', '೩': '3', '೪': '4', '೫': '5', '೬': '6', '೭': '7', '೮': '8', '೯': '9',
    // Malayalam
    '൦': '0', '൧': '1', '൨': '2', '൩': '3', '൪': '4', '൫': '5', '൬': '6', '൭': '7', '൮': '8', '൯': '9',
    // Tamil
    '௦': '0', '௧': '1', '௨': '2', '௩': '3', '௪': '4', '௫': '5', '௬': '6', '௭': '7', '௮': '8', '௯': '9'
  };

  return text.replace(/[०-९০-৯੦-੯૦-૯୦-୯౦-౯೦-೯൦-൯௦-௯]/g, match => indicDigitMap[match] || match);
}
