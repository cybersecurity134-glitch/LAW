import { LawItem, LegalUpdateHistory } from '../types';
import { TRAFFIC_LAWS } from './laws/trafficLaws';
import { CYBER_TECH_LAWS } from './laws/cyberAndTechLaws';
import { CRIMINAL_LAWS } from './laws/criminalLaws';
import { COMMERCIAL_CIVIL_LAWS } from './laws/commercialAndCivilLaws';
import { PUBLIC_RIGHTS_LAWS } from './laws/publicAndRightsLaws';
import { COMPREHENSIVE_INDIAN_STATUTES } from './laws/comprehensiveIndianStatutes';
import { enrichLawWithAuthoritativeData } from './lawsVerificationEnricher';

const RAW_LAWS_COLLECTION: LawItem[] = [
  ...CYBER_TECH_LAWS,
  ...TRAFFIC_LAWS,
  ...CRIMINAL_LAWS,
  ...COMMERCIAL_CIVIL_LAWS,
  ...PUBLIC_RIGHTS_LAWS,
  ...COMPREHENSIVE_INDIAN_STATUTES
];

export const LAWS_DATABASE: LawItem[] = RAW_LAWS_COLLECTION.map(enrichLawWithAuthoritativeData);

export const UPDATE_HISTORY: LegalUpdateHistory[] = [
  {
    id: 'upd-1',
    law_id: 'bns-sec-103',
    act_name: 'Bharatiya Nyaya Sanhita, 2023',
    section_number: 'Section 103',
    change_type: 'New Section',
    description: 'BNS 2023 replaced IPC 1860. Section 103 replaced Section 302 IPC, introducing explicit capital punishment & life imprisonment for mob lynching by groups of five or more.',
    effective_date: '1 July 2024',
    source: 'Ministry of Home Affairs, Gazette of India Notification S.O. 848(E)',
    updated_at: '2024-07-01 00:00:00 IST'
  },
  {
    id: 'upd-2',
    law_id: 'bnss-sec-173',
    act_name: 'Bharatiya Nagarik Suraksha Sanhita, 2023',
    section_number: 'Section 173',
    change_type: 'New Section',
    description: 'BNSS 2023 replaced CrPC 1973. Mandates Zero FIR registration irrespective of jurisdiction and authorizes electronic communication e-FIR.',
    effective_date: '1 July 2024',
    source: 'Ministry of Home Affairs, Gazette of India Notification S.O. 849(E)',
    updated_at: '2024-07-01 00:00:00 IST'
  },
  {
    id: 'upd-3',
    law_id: 'telangana-mvr-traffic-rule',
    act_name: 'Telangana Motor Vehicles Rules & Hyderabad Police Act',
    section_number: 'Rule 493 & Sec 21',
    change_type: 'Clarification',
    description: 'Telangana Transport & Police department notified enhanced enforcement of wrong-side driving with driving license suspension on 3rd violation.',
    effective_date: '15 June 2024',
    source: 'Telangana State Transport Department / DGP Telangana Notification',
    updated_at: '2024-06-15 11:30:00 IST'
  },
  {
    id: 'upd-4',
    law_id: 'copra-sec-35',
    act_name: 'Consumer Protection Act, 2019',
    section_number: 'Section 35',
    change_type: 'Amendment',
    description: 'Central Consumer Protection Authority (CCPA) issued updated guidelines for prevention of greenwashing and misleading influencer endorsements.',
    effective_date: '15 October 2024',
    source: 'Department of Consumer Affairs, CCPA Notification F.No. J-25/44/2023',
    updated_at: '2024-10-15 14:00:00 IST'
  }
];

export const POPULAR_SEARCH_TERMS = [
  'cyber crime',
  'drunk driving',
  'Section 66',
  'Section 185',
  'Section 103 BNS',
  'Section 420 IPC',
  'cheque bounce',
  'domestic violence',
  'wrong side driving',
  'consumer complaint',
  'zero fir',
  'article 21',
  'helmet fine',
  'telangana traffic'
];

export const INDIAN_STATES = [
  'Telangana',
  'Andhra Pradesh',
  'Maharashtra',
  'Karnataka',
  'Delhi (NCT)',
  'Tamil Nadu',
  'Uttar Pradesh',
  'West Bengal',
  'Gujarat',
  'Rajasthan',
  'Kerala',
  'Madhya Pradesh',
  'Punjab',
  'Haryana',
  'Bihar',
  'Odisha',
  'Assam',
  'Jharkhand',
  'Chhattisgarh',
  'Uttarakhand',
  'Himachal Pradesh',
  'Goa',
  'Jammu and Kashmir',
  'Chandigarh',
  'All India'
];
