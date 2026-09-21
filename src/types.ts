export interface RelatedLawReference {
  section_number: string;
  act_name: string;
  title: string;
  law_id?: string;
}

export interface StatutoryDefinition {
  term: string;
  meaning: string;
  section_ref?: string;
}

export type ActStatus = 
  | 'In Force' 
  | 'Repealed' 
  | 'Partially Struck Down' 
  | 'Amended' 
  | 'Superseded' 
  | 'UNVERIFIED — needs source';

export type VerificationStatus = 
  | 'Verified' 
  | 'Pending Verification' 
  | 'UNVERIFIED — needs source';

export interface HierarchyNode {
  chapter_number: string;
  chapter_title: string;
  section_number: string;
  sub_section?: string;
  source_page_url: string;
}

export interface AmendmentHistoryItem {
  amending_act: string;
  act_number_year: string;
  date: string;
  what_changed: string;
  citation: string;
  gazette_url?: string;
}

export interface SubordinateLegislation {
  title: string;
  type: 'Rules' | 'Regulations' | 'Notification' | 'Order';
  number: string;
  date: string;
  issuing_authority: string;
  source_url: string;
}

export type LawRelatedSection = RelatedLawReference;
export type LawFilters = SearchFilters;

export interface LawItem {
  id: string;
  // 1. Official name & Statutory Identifiers
  official_name: string;
  act_name: string;
  short_act?: string;
  act_number_year?: string; // e.g. 'Act No. 45 of 2023'
  enacting_body?: string; // e.g. 'Parliament of India' or 'Telangana State Legislature'
  is_central_act?: boolean;
  state_name?: string; // For state-specific legislation
  category_tags?: string[]; // Cross-tagging across categories

  // Statutory Dates & Status
  date_of_assent?: string; // Presidential / Governor assent date
  date_of_commencement?: string; // Gazette commencement date
  status?: ActStatus; // In Force | Repealed | Partially Struck Down | Amended | Superseded
  status_citation?: string; // Gazette notification / repealing act citation

  // Full Chapter -> Section -> Sub-section hierarchy linked to official source page
  chapter_hierarchy?: HierarchyNode;

  // 2. Short description & Explanations (Strictly separated)
  short_description: string;
  simple_explanation: string;
  unofficial_explanation_label?: string; // Explicitly labeled as 'Unofficial Explanation'

  // 3. Year enacted
  year_enacted: number;

  // 4. Sections
  sections: string;
  section_number: string;
  section_title: string;

  // 5. Sub-sections
  sub_sections: string[];

  // 6. Definitions
  definitions: StatutoryDefinition[];

  // 7. Offences
  offences: string[];
  actions_covered: string[];

  // 8. Penalties/fines
  penalties_fines: string;
  punishment: string;
  fine: string;
  imprisonment: string;

  // 9. Consequences
  consequences: string[];
  other_consequences: string;

  // 10. Exceptions
  exceptions: string[];

  // 11. Amendments & Amendment History
  amendments: string[];
  amendment_history?: AmendmentHistoryItem[];

  // Subordinate Legislation (Rules / Regulations / Notifications)
  subordinate_legislation?: SubordinateLegislation[];

  // 12. Related laws
  related_laws: string[];
  related_acts: string[];
  related_sections: RelatedLawReference[];

  // 13. Current status
  current_status: string;

  // Verification Metadata (Mandatory on every entry)
  verification_status?: VerificationStatus;
  last_verified_date?: string; // Date retrieved / verified against India Code / e-Gazette
  primary_source_name?: string; // e.g. 'India Code (indiacode.nic.in)' or 'e-Gazette of India'
  verification_method?: string; // 'Automated Diff against India Code & e-Gazette'

  // Platform & Domain Metadata
  category_id: string;
  official_text: string;
  what_it_means: string;
  is_bailable: boolean | null; // true = bailable, false = non-bailable, null = not applicable
  is_cognizable: boolean | null; // true = cognizable, false = non-cognizable, null = not applicable
  court_triable?: string;
  effective_date: string;
  source: string;
  source_url: string; // Exact India Code / e-Gazette URL (mandatory citation)
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
  theme: 'day' | 'night' | 'system';
  voice_language?: string;
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

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: number;
  type: 'term' | 'law';
  law_id?: string;
  act_name?: string;
  section_number?: string;
  section_title?: string;
  category_id?: string;
  result_count?: number;
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

export interface AIAttachment {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  data: string; // base64 encoded
  previewUrl?: string;
  type: 'image' | 'pdf' | 'document' | 'audio';
}

export interface WebCitation {
  title: string;
  url: string;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  attachments?: AIAttachment[];
  sources?: {
    law_id: string;
    section_number: string;
    act_name: string;
    source_url: string;
  }[];
  webCitations?: WebCitation[];
  searchQueries?: string[];
  is_uncertain?: boolean;
  model_used?: string;
  isStreaming?: boolean;
}

export interface LegalUpdateHistory {
  id: string;
  law_id: string;
  act_name: string;
  section_number: string;
  section?: string;
  change_type: 'Amendment' | 'New Section' | 'Repealed' | 'Clarification' | 'Amended' | 'New' | 'Substituted' | 'Notified';
  description: string;
  effective_date: string;
  source: string;
  updated_at: string;
  gazette_number?: string;
  gazette_notification_id?: string;
  source_url?: string;
  is_urgent?: boolean;
}

export interface LegalCircularNotice {
  id: string;
  title: string;
  issuing_authority: string;
  circular_number: string;
  date_published: string;
  issue_date?: string;
  summary: string;
  category: string;
  source_url: string;
  verified_at: string;
  is_breaking?: boolean;
  is_critical?: boolean;
}

export interface HelplineDirectoryItem {
  id: string;
  name: string;
  number: string;
  service: string;
  description?: string;
  authority: string;
  timing: string;
  availability_hours?: string;
  portalUrl: string;
  portalLabel: string;
  notes: string;
  category: 'cyber' | 'legal-aid' | 'consumer' | 'women' | 'emergency' | 'child';
  status: 'active' | 'degraded' | 'maintenance';
  last_verified: string;
}

export interface SyncAuditLog {
  id: string;
  timestamp: string;
  triggered_by: 'daily_cron' | 'admin_override' | 'manual_refresh';
  status: 'success' | 'fallback';
  sources_checked: string[];
  items_checked: number;
  changes_detected: number;
  changes_summary: string[];
  summary?: string;
  duration_ms: number;
  error_details?: string;
}

export interface SyncStatusResponse {
  success: boolean;
  last_updated: string;
  last_attempt: string;
  next_scheduled_sync: string;
  next_sync_expected?: string;
  nextSyncEstimatedHours?: number;
  status: 'synced' | 'fallback' | 'updating';
  synced_sources: string[];
  verified_acts: number;
  verified_acts_count?: number;
  total_updates: number;
  totalUpdatesLogged?: number;
  total_circulars: number;
  audit_logs: SyncAuditLog[];
}

// ==========================================
// LAW BOOK DATA INGESTION ENGINE TYPES
// ==========================================

export interface ExtractedSection {
  section_number: string;
  heading: string;
  text: string;
  sub_sections: { number: string; text: string }[];
  provisos: string[];
  explanations: string[];
  illustrations: string[];
  amendment_notes: string[];
  penalty: { applicable: boolean; details: string };
}

export interface ExtractedChapter {
  chapter_number: string;
  heading: string;
  sections: ExtractedSection[];
}

export interface ExtractedDefinition {
  term: string;
  definition: string;
  section_ref: string;
}

export interface ExtractedSchedule {
  schedule_number: string;
  title: string;
  content: string;
}

export interface ExtractedActDocument {
  act_title: string;
  act_number: string;
  year: string;
  jurisdiction: string;
  enforcement_date: string;
  preamble: string;
  definitions: ExtractedDefinition[];
  chapters: ExtractedChapter[];
  schedules: ExtractedSchedule[];
  completeness_check?: {
    continuous_sections: boolean;
    total_sections: number;
    total_definitions: number;
    total_schedules: number;
    penalty_provisions_count: number;
    notes?: string;
  };
}
