import React, { memo } from 'react';
import { BookOpen } from 'lucide-react';
import { LawItem, LawCategory, LawRelatedSection } from '../../types';
import {
  LawDetailTitleBanner,
  LawDetailAIQuickActions,
  LawDetailExplanationSection,
  LawDetailActionsSection,
  LawDetailPenaltiesSection,
  LawDetailExceptionsSection,
  LawDetailDefinitionsSection,
  LawDetailSubSections,
  LawDetailAmendmentsSection,
  LawDetailRelatedLawsSection,
  LawDetailOfficialTextSection,
  LawDetailRelatedSections,
  LawDetailSourceMetadata,
  LawDetailHierarchySection,
  LawDetailAuthoritativeAmendmentsTable,
  LawDetailSubordinateLegislationSection
} from './LawDetailSections';

export interface LawDetailMainContentProps {
  law: LawItem;
  category?: LawCategory;
  explanationMode: 'simple' | 'detailed';
  expandedSection: { [key: string]: boolean };
  onSetSimpleMode: () => void;
  onSetDetailedMode: () => void;
  onToggleMeaning: () => void;
  onToggleActions: () => void;
  onTogglePenalties: () => void;
  onToggleExceptions: () => void;
  onToggleDefinitions?: () => void;
  onToggleSubSections?: () => void;
  onToggleAmendments?: () => void;
  onToggleRelatedLaws?: () => void;
  onToggleOfficialText: () => void;
  onToggleRelated: () => void;
  onSelectRelated: (rel: LawRelatedSection) => void;
  onAskAIWithPrompt?: (prompt: string) => void;
}

export const LawDetailMainContent = memo<LawDetailMainContentProps>(({
  law,
  category,
  explanationMode,
  expandedSection,
  onSetSimpleMode,
  onSetDetailedMode,
  onToggleMeaning,
  onToggleActions,
  onTogglePenalties,
  onToggleExceptions,
  onToggleDefinitions,
  onToggleSubSections,
  onToggleAmendments,
  onToggleRelatedLaws,
  onToggleOfficialText,
  onToggleRelated,
  onSelectRelated,
  onAskAIWithPrompt
}) => {
  return (
    <div 
      id="law-detail-main-content-container" 
      className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6"
    >
      {/* 1. Provision Title & Classification Badges */}
      <LawDetailTitleBanner 
        law={law} 
        categoryName={category?.name} 
      />

      {/* 1.5 Quick AI Statutory Actions Bar */}
      <LawDetailAIQuickActions
        law={law}
        onAskAIWithPrompt={onAskAIWithPrompt}
      />

      {/* 2. Mode Switcher Banner: Citizen Friendly vs Official Statutory Text */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#292929]">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-orange-500 dark:text-[#7C5CFF]" />
          <span className="text-xs font-semibold text-slate-700 dark:text-[#B3B3B3]">
            Explanation Language
          </span>
        </div>
        <div className="flex items-center p-0.5 rounded-xl bg-slate-200/60 dark:bg-[#151515] border border-slate-200 dark:border-[#292929] text-xs font-medium">
          <button
            type="button"
            onClick={onSetSimpleMode}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              explanationMode === 'simple'
                ? 'bg-orange-500 dark:bg-[#7C5CFF] text-white font-bold shadow-xs'
                : 'text-slate-600 dark:text-[#777777] hover:text-slate-900 dark:hover:text-[#FFFFFF]'
            }`}
          >
            Simple Citizen Mode
          </button>
          <button
            type="button"
            onClick={onSetDetailedMode}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              explanationMode === 'detailed'
                ? 'bg-orange-500 dark:bg-[#7C5CFF] text-white font-bold shadow-xs'
                : 'text-slate-600 dark:text-[#777777] hover:text-slate-900 dark:hover:text-[#FFFFFF]'
            }`}
          >
            Detailed Legal Text
          </button>
        </div>
      </div>

      {/* 3. Meaning / Explanation */}
      <LawDetailExplanationSection
        isExpanded={expandedSection.meaning ?? true}
        simpleExplanation={law.simple_explanation}
        whatItMeans={law.what_it_means}
        onToggle={onToggleMeaning}
      />

      {/* 4. Sub-Sections & Clauses (if present) */}
      {law.sub_sections && law.sub_sections.length > 0 && (
        <LawDetailSubSections
          isExpanded={expandedSection.subSections ?? true}
          subSections={law.sub_sections}
          onToggle={onToggleSubSections || onToggleMeaning}
        />
      )}

      {/* 5. Statutory Definitions (if present) */}
      {law.definitions && law.definitions.length > 0 && (
        <LawDetailDefinitionsSection
          isExpanded={expandedSection.definitions ?? true}
          definitions={law.definitions}
          onToggle={onToggleDefinitions || onToggleMeaning}
        />
      )}

      {/* 6. Causes & Actions Covered (Offences) */}
      <LawDetailActionsSection
        isExpanded={expandedSection.actions ?? true}
        actionsCovered={law.offences || law.actions_covered}
        onToggle={onToggleActions}
      />

      {/* 7. Punishment, Fine & Consequences */}
      <LawDetailPenaltiesSection
        isExpanded={expandedSection.penalties ?? true}
        punishment={law.penalties_fines || law.punishment}
        imprisonment={law.imprisonment}
        fine={law.fine}
        otherConsequences={
          law.consequences && law.consequences.length > 0
            ? law.consequences.join('; ')
            : law.other_consequences
        }
        onToggle={onTogglePenalties}
      />

      {/* 8. Important Exceptions & Defenses */}
      <LawDetailExceptionsSection
        isExpanded={expandedSection.exceptions ?? true}
        exceptions={law.exceptions}
        onToggle={onToggleExceptions}
      />

      {/* 9. Amendments & Legislative History (if present) */}
      {law.amendments && law.amendments.length > 0 && (
        <LawDetailAmendmentsSection
          isExpanded={expandedSection.amendments ?? true}
          amendments={law.amendments}
          onToggle={onToggleAmendments || onToggleExceptions}
        />
      )}

      {/* 9.5 Authoritative Amendment History Table with Gazette Citations */}
      {law.amendment_history && law.amendment_history.length > 0 && (
        <LawDetailAuthoritativeAmendmentsTable
          isExpanded={expandedSection.amendmentHistory ?? true}
          history={law.amendment_history}
          onToggle={onToggleAmendments || onToggleExceptions}
        />
      )}

      {/* 9.6 Statutory Subordinate Legislation (Rules & Notifications) */}
      {law.subordinate_legislation && law.subordinate_legislation.length > 0 && (
        <LawDetailSubordinateLegislationSection
          isExpanded={expandedSection.subordinateLegislation ?? true}
          subordinate={law.subordinate_legislation}
          onToggle={onToggleAmendments || onToggleExceptions}
        />
      )}

      {/* 10. Related Laws & Statutory Codes (if present) */}
      {law.related_laws && law.related_laws.length > 0 && (
        <LawDetailRelatedLawsSection
          isExpanded={expandedSection.relatedLaws ?? true}
          relatedLaws={law.related_laws}
          onToggle={onToggleRelatedLaws || onToggleRelated}
        />
      )}

      {/* 10.5 Statutory Hierarchy & Chapter Mapping */}
      {law.chapter_hierarchy && (
        <LawDetailHierarchySection
          isExpanded={expandedSection.hierarchy ?? true}
          law={law}
          onToggle={onToggleRelatedLaws || onToggleRelated}
        />
      )}

      {/* 11. Official Bare Act Text */}
      <LawDetailOfficialTextSection
        isExpanded={expandedSection.officialText ?? false}
        officialText={law.official_text}
        onToggle={onToggleOfficialText}
      />

      {/* 12. Related Sections & Cross-References */}
      <LawDetailRelatedSections
        isExpanded={expandedSection.related ?? true}
        relatedSections={law.related_sections}
        onToggle={onToggleRelated}
        onSelectRelated={onSelectRelated}
      />

      {/* 13. Official Source & Verification Metadata */}
      <LawDetailSourceMetadata
        source={law.source}
        sourceUrl={law.source_url}
        effectiveDate={law.effective_date}
        lastUpdated={law.last_updated}
        updateNotes={law.update_notes}
        primarySourceName={law.primary_source_name}
        verificationStatus={law.verification_status}
        verificationMethod={law.verification_method}
      />
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.law.id === nextProps.law.id &&
    prevProps.explanationMode === nextProps.explanationMode &&
    prevProps.expandedSection === nextProps.expandedSection &&
    prevProps.category?.id === nextProps.category?.id
  );
});

LawDetailMainContent.displayName = 'LawDetailMainContent';
