export interface RelatedLawReference {
  section_number: string;
  act_name: string;
  title: string;
  law_id?: string;
}

export interface LawItem {
  id: string;
  act_name: string;
  short_act?: string;
  section_number: string;
  section_title: string;
  category_id: string;
  simple_explanation: string;
  official_text: string;
  what_it_means: string;
  actions_covered: string[];
  punishment: string;
  fine: string;
  imprisonment: string;
  other_consequences: string;
  is_bailable: boolean | null; // true = bailable, false = non-bailable, null = not applicable (e.g. civil/constitutional)
  is_cognizable: boolean | null; // true = cognizable, false = non-cognizable, null = not applicable
  court_triable?: string;
  exceptions: string[];
  related_sections: RelatedLawReference[];
  related_acts: string[];
  effective_date: string;
  source: string;
  source_url: string;
  last_updated: string;
  is_recently_updated?: boolean;
  update_notes?: string;
  keywords: string[];
  state_applicability: string; // 'All India', 'Telangana', etc.
  target_audience: string[];
  view_count?: number;
  featured?: boolean;
}

export interface LawCategory {
  id: string;
  name: string;
  icon_name: string;
  description: string;
  color: string;
  acts_count: number;
  sections_count: number;
  primary_acts?: string[];
}

export interface UserPreferences {
  age: number;
  state: string;
  gender_pref?: string;
  occupation: string;
  interests: string[];
  explanation_mode: 'simple' | 'detailed';
  theme: 'liquid-glass' | 'day' | 'night' | 'system';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  preferences: UserPreferences;
  onboarding_completed: boolean;
  is_guest?: boolean;
}

export interface Bookmark {
  id: string;
  law_id: string;
  created_at: string;
  notes?: string;
}

export interface SearchFilters {
  query: string;
  category_id?: string;
  act_name?: string;
  bailable?: 'all' | 'bailable' | 'non-bailable';
  cognizable?: 'all' | 'cognizable' | 'non-cognizable';
  state?: string;
  has_fine_only?: boolean;
  has_imprisonment?: boolean;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: {
    law_id: string;
    section_number: string;
    act_name: string;
    source_url: string;
  }[];
  is_uncertain?: boolean;
}

export interface LegalUpdateHistory {
  id: string;
  law_id: string;
  act_name: string;
  section_number: string;
  change_type: 'Amendment' | 'New Section' | 'Repealed' | 'Clarification';
  description: string;
  effective_date: string;
  source: string;
  updated_at: string;
}
