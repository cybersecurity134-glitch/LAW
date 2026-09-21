export interface PhaseRoadmapItem {
  phase_number: number;
  name: string;
  scope_description: string;
  status: 'active' | 'in-progress' | 'scheduled';
  verified_acts_count: number;
  total_targeted_acts: number;
  key_statutes: string[];
  completion_percentage: number;
}

export interface VerificationMetrics {
  total_central_acts_in_force: number;
  verified_central_acts_count: number;
  verified_state_acts_count: number;
  central_acts_coverage_percentage: number;
  unverified_placeholders_count: number;
  last_pipeline_audit_date: string;
  primary_sources: {
    name: string;
    authority: string;
    url: string;
    role: string;
  }[];
}

export const VERIFICATION_METRICS: VerificationMetrics = {
  total_central_acts_in_force: 903,
  verified_central_acts_count: 24,
  verified_state_acts_count: 4,
  central_acts_coverage_percentage: 2.7, // Honestly reflects 24 of 903 Central Acts
  unverified_placeholders_count: 0,
  last_pipeline_audit_date: '2024-11-15',
  primary_sources: [
    {
      name: 'India Code (National Repository of Central & State Acts)',
      authority: 'Legislative Department, Ministry of Law and Justice, Govt. of India',
      url: 'https://www.indiacode.nic.in',
      role: 'Authoritative bare act texts, chapter/section hierarchy, and definitions.'
    },
    {
      name: 'The Gazette of India (e-Gazette)',
      authority: 'Department of Publication, Ministry of Housing and Urban Affairs',
      url: 'https://egazette.gov.in',
      role: 'Commencement notifications, presidential assents, and amending act diffs.'
    },
    {
      name: 'Ministry of Home Affairs (MHA)',
      authority: 'Government of India',
      url: 'https://www.mha.gov.in',
      role: 'Notified commencement dates for BNS, BNSS, and BSA (1 July 2024).'
    }
  ]
};

export const PHASE_ROADMAP: PhaseRoadmapItem[] = [
  {
    phase_number: 1,
    name: 'Phase 1: Foundation & Core Enactments',
    scope_description: 'Constitution of India + 3 New Criminal Codes (BNS, BNSS, BSA replacing IPC, CrPC, Evidence Act) + Top 20 Most-Searched Central Acts.',
    status: 'active',
    verified_acts_count: 24,
    total_targeted_acts: 24,
    completion_percentage: 100,
    key_statutes: [
      'Constitution of India',
      'Bharatiya Nyaya Sanhita, 2023 (BNS)',
      'Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)',
      'Bharatiya Sakshya Adhiniyam, 2023 (BSA)',
      'Information Technology Act, 2000',
      'Digital Personal Data Protection Act, 2023 (DPDPA)',
      'Motor Vehicles Act, 1988 (as amended by MV Amendment Act 2019)',
      'Consumer Protection Act, 2019',
      'Right to Information Act, 2005 (RTI)',
      'Negotiable Instruments Act, 1881',
      'Indian Contract Act, 1872',
      'Code of Civil Procedure, 1908 (CPC)',
      'Companies Act, 2013',
      'Protection of Children from Sexual Offences Act, 2012 (POCSO)',
      'Arbitration and Conciliation Act, 1996',
      'Specific Relief Act, 1963',
      'Transfer of Property Act, 1882',
      'Limitation Act, 1963',
      'Prevention of Corruption Act, 1988',
      'Narcotic Drugs and Psychotropic Substances Act, 1985 (NDPS)',
      'Insolvency and Bankruptcy Code, 2016 (IBC)',
      'Competition Act, 2002',
      'Prevention of Money Laundering Act, 2002 (PMLA)',
      'SARFAESI Act, 2002'
    ]
  },
  {
    phase_number: 2,
    name: 'Phase 2: Corporate, Finance & Taxation Codes',
    scope_description: 'Comprehensive Direct & Indirect Tax Acts, LLP Act, SEBI Act, Banking Regulation Act, and Foreign Exchange Management Act (FEMA).',
    status: 'in-progress',
    verified_acts_count: 12,
    total_targeted_acts: 45,
    completion_percentage: 26.6,
    key_statutes: [
      'Income Tax Act, 1961',
      'Central Goods and Services Tax Act, 2017 (CGST)',
      'Integrated Goods and Services Tax Act, 2017 (IGST)',
      'Customs Act, 1962',
      'Limited Liability Partnership Act, 2008',
      'Securities and Exchange Board of India Act, 1992',
      'Banking Regulation Act, 1949',
      'Reserve Bank of India Act, 1934'
    ]
  },
  {
    phase_number: 3,
    name: 'Phase 3: Labour Codes & Environmental Statutes',
    scope_description: 'The four Consolidated Labour Codes (Wages, Industrial Relations, Social Security, OSH) + Environment Protection, Water, Air, Forest, and Wildlife Acts.',
    status: 'scheduled',
    verified_acts_count: 0,
    total_targeted_acts: 38,
    completion_percentage: 0,
    key_statutes: [
      'Code on Wages, 2019',
      'Industrial Relations Code, 2020',
      'Code on Social Security, 2020',
      'Occupational Safety, Health and Working Conditions Code, 2020',
      'Environment (Protection) Act, 1986',
      'Water (Prevention and Control of Pollution) Act, 1974',
      'Air (Prevention and Control of Pollution) Act, 1981',
      'Forest (Conservation) Amendment Act, 2023',
      'Wild Life (Protection) Amendment Act, 2022'
    ]
  },
  {
    phase_number: 4,
    name: 'Phase 4: State Legislation & Sectoral Statutes',
    scope_description: 'State-specific enactments (Telangana, Maharashtra, Karnataka, Delhi, etc.) kept distinctly partitioned from Central statutes.',
    status: 'scheduled',
    verified_acts_count: 4,
    total_targeted_acts: 350,
    completion_percentage: 1.1,
    key_statutes: [
      'Telangana Motor Vehicles Rules & Police Act',
      'Delhi Rent Control Act',
      'Maharashtra Land Revenue Code',
      'Karnataka Police Act'
    ]
  }
];
