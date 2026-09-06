import { LawCategory } from '../types';

export const CATEGORIES: LawCategory[] = [
  {
    id: 'constitutional-law',
    name: 'Constitutional Law',
    icon_name: 'Scale',
    description: 'Fundamental rights, directive principles, governance structure, and constitutional remedies in India.',
    color: 'emerald',
    acts_count: 5,
    sections_count: 395
  },
  {
    id: 'criminal-law',
    name: 'Criminal Law',
    icon_name: 'ShieldAlert',
    description: 'Bharatiya Nyaya Sanhita (BNS 2023), IPC, offences against body, property, public peace, and safety.',
    color: 'rose',
    acts_count: 8,
    sections_count: 511
  },
  {
    id: 'civil-law',
    name: 'Civil Law',
    icon_name: 'FileText',
    description: 'Civil remedies, suits, damages, injunctions, declarations, and dispute settlements.',
    color: 'blue',
    acts_count: 6,
    sections_count: 158
  },
  {
    id: 'contract-commercial-law',
    name: 'Contract & Commercial Law',
    icon_name: 'Briefcase',
    description: 'Indian Contract Act, agreements, breach of contract, indemnity, guarantee, and agency.',
    color: 'indigo',
    acts_count: 4,
    sections_count: 238
  },
  {
    id: 'corporate-law',
    name: 'Corporate Law',
    icon_name: 'Building2',
    description: 'Companies Act 2013, corporate governance, directors liabilities, shares, and insolvency.',
    color: 'purple',
    acts_count: 5,
    sections_count: 470
  },
  {
    id: 'family-personal-law',
    name: 'Family & Personal Law',
    icon_name: 'HeartHandshake',
    description: 'Marriage, divorce, maintenance, succession, guardianship, and domestic violence protections.',
    color: 'amber',
    acts_count: 10,
    sections_count: 310
  },
  {
    id: 'property-land-law',
    name: 'Property & Land Law',
    icon_name: 'Home',
    description: 'Transfer of Property Act, tenancy, registration, RERA real estate regulations, and land titles.',
    color: 'teal',
    acts_count: 7,
    sections_count: 195
  },
  {
    id: 'labour-employment-law',
    name: 'Labour & Employment Law',
    icon_name: 'Users',
    description: 'Industrial relations, wages code, occupational safety, POSH workplace harassment, and provident fund.',
    color: 'cyan',
    acts_count: 9,
    sections_count: 280
  },
  {
    id: 'tax-law',
    name: 'Tax Law',
    icon_name: 'Receipt',
    description: 'Income Tax Act 1961, GST (Goods and Services Tax), customs, assessments, and penalties.',
    color: 'emerald',
    acts_count: 6,
    sections_count: 298
  },
  {
    id: 'intellectual-property-law',
    name: 'Intellectual Property Law',
    icon_name: 'Lightbulb',
    description: 'Copyrights, patents, trademarks, design rights, geographical indications, and infringement.',
    color: 'violet',
    acts_count: 5,
    sections_count: 175
  },
  {
    id: 'cyber-law-it',
    name: 'Cyber Law & Information Technology',
    icon_name: 'Laptop',
    description: 'Information Technology Act 2000, Digital Personal Data Protection Act (DPDPA), cyber crime, hacking, and privacy.',
    color: 'sky',
    acts_count: 4,
    sections_count: 94
  },
  {
    id: 'consumer-law',
    name: 'Consumer Law',
    icon_name: 'ShoppingBag',
    description: 'Consumer Protection Act 2019, unfair trade practices, misleading ads, product liability, and refunds.',
    color: 'orange',
    acts_count: 3,
    sections_count: 107
  },
  {
    id: 'environmental-law',
    name: 'Environmental Law',
    icon_name: 'Trees',
    description: 'Environment Protection Act 1986, Air and Water pollution control, NGT rules, and forest conservation.',
    color: 'green',
    acts_count: 6,
    sections_count: 140
  },
  {
    id: 'administrative-law',
    name: 'Administrative Law',
    icon_name: 'Scroll',
    description: 'Principles of natural justice, delegated legislation, administrative tribunals, and judicial review.',
    color: 'slate',
    acts_count: 4,
    sections_count: 85
  },
  {
    id: 'banking-financial-law',
    name: 'Banking & Financial Law',
    icon_name: 'Landmark',
    description: 'Negotiable Instruments Act (Cheque bounce), SARFAESI, RBI regulations, and prevention of money laundering.',
    color: 'yellow',
    acts_count: 8,
    sections_count: 215
  },
  {
    id: 'education-law',
    name: 'Education Law',
    icon_name: 'GraduationCap',
    description: 'Right to Education Act (RTE 2009), UGC regulations, anti-ragging guidelines, and university charters.',
    color: 'blue',
    acts_count: 4,
    sections_count: 68
  },
  {
    id: 'motor-vehicle-traffic-law',
    name: 'Motor Vehicle & Traffic Law',
    icon_name: 'Car',
    description: 'Motor Vehicles Act 1988/2019, traffic violations, drunk driving, driving license, insurance, and state rules.',
    color: 'red',
    acts_count: 3,
    sections_count: 217
  },
  {
    id: 'health-medical-law',
    name: 'Health & Medical Law',
    icon_name: 'Stethoscope',
    description: 'Clinical Establishments Act, Drugs and Cosmetics Act, medical negligence principles, and mental healthcare.',
    color: 'rose',
    acts_count: 5,
    sections_count: 110
  },
  {
    id: 'evidence-procedure',
    name: 'Evidence & Procedure',
    icon_name: 'Gavel',
    description: 'Bharatiya Nagarik Suraksha Sanhita (BNSS 2023), Bharatiya Sakshya Adhiniyam 2023 (BSA), FIR, bail, and electronic evidence.',
    color: 'zinc',
    acts_count: 3,
    sections_count: 531
  },
  {
    id: 'human-rights-law',
    name: 'Human Rights Law',
    icon_name: 'Heart',
    description: 'Protection of Human Rights Act 1993, custodial protection, NHRC/SHRC powers, and vulnerable group safeguards.',
    color: 'pink',
    acts_count: 4,
    sections_count: 43
  },
  {
    id: 'government-public-administration',
    name: 'Government & Public Administration',
    icon_name: 'Building',
    description: 'Right to Information (RTI Act 2005), Lokpal & Lokayuktas, civil services conduct rules, and public procurement.',
    color: 'stone',
    acts_count: 5,
    sections_count: 76
  },
  {
    id: 'other-laws',
    name: 'Other Laws',
    icon_name: 'Layers',
    description: 'Special and local enactments, disaster management, sports law, maritime law, and miscellaneous statutes.',
    color: 'neutral',
    acts_count: 12,
    sections_count: 180
  }
];
