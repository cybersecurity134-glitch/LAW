import { LawItem } from '../../types';

export const COMMERCIAL_CIVIL_LAWS: LawItem[] = [
  // 1. Commercial & Corporate Law: Section 138 NI Act (Cheque Bounce)
  {
    id: 'ni-act-sec-138',
    official_name: 'Negotiable Instruments Act, 1881',
    act_name: 'Negotiable Instruments Act, 1881 (Amended 2018)',
    short_act: 'Negotiable Instruments Act',
    short_description: 'Criminalizes the dishonour of bank cheques issued for the discharge of legally enforceable debts due to insufficient funds or stop-payment orders.',
    simple_explanation: 'If a bank cheque you received bounces due to insufficient funds or account closed, and the person who issued the cheque does not pay within 15 days of receiving a legal demand notice, they face criminal prosecution.',
    year_enacted: 1881,
    sections: 'Section 138',
    section_number: 'Section 138',
    section_title: 'Dishonour of Cheque for Insufficiency of Funds in Accounts',
    sub_sections: [
      'Operative Clause: Cheque returned unpaid due to funds being insufficient or exceeding arrangement',
      'Proviso (a): Cheque presented within three months of its date',
      'Proviso (b): Statutory demand notice in writing within thirty days of bank dishonour memo receipt',
      'Proviso (c): Drawer fails to pay within fifteen days of receiving the statutory notice',
      'Penal Provision: Imprisonment up to two years, or fine up to twice the amount of the cheque, or both'
    ],
    definitions: [
      {
        term: 'Cheque',
        meaning: 'A bill of exchange drawn on a specified banker and not expressed to be payable otherwise than on demand, including electronic and truncated cheques.'
      },
      {
        term: 'Legally Enforceable Debt',
        meaning: 'A lawful monetary liability or debt that is not barred by the law of limitation or prohibited by statute.'
      },
      {
        term: 'Dishonour Memo',
        meaning: 'The official return slip issued by the bank specifying why payment was refused (e.g., "Funds Insufficient").'
      }
    ],
    offences: [
      'Issuing a cheque knowing the bank balance is insufficient to clear it',
      'Stopping payment on a cheque given to settle a genuine business or personal debt',
      'Instructing the bank to close the account before an issued cheque is cleared',
      'Failing to pay the cheque amount within 15 days of receiving the legal notice'
    ],
    actions_covered: [
      'Issuing a cheque knowing bank balance is insufficient to clear it',
      'Stopping payment on a cheque given to settle a genuine business debt',
      'Instructing the bank to close the account before an issued cheque is cleared'
    ],
    penalties_fines: 'Imprisonment up to 2 years, or fine extending up to twice (2x) the cheque amount, or both.',
    punishment: 'Imprisonment for a term up to 2 years, or with fine up to twice the amount of the cheque, or with both.',
    fine: 'Up to twice the face value of the bounced cheque',
    imprisonment: 'Up to 2 years',
    consequences: [
      'Interim compensation order under Section 143A directing accused drawer to deposit up to 20% of the cheque value during trial',
      'Mandatory deposit of at least 20% fine/compensation on appeal under Section 148',
      'Non-bailable warrant and proclamation of offender if accused evades court summons',
      'Severe adverse impact on CIBIL credit score and commercial banking lines'
    ],
    other_consequences: 'Interim compensation under Section 143A (accused may be ordered to deposit up to 20% of cheque amount during trial); adverse CIBIL credit score impact.',
    exceptions: [
      'Cheque given as a pure gift, family handout, or charity without any pre-existing legal debt',
      'Cheque issued for an unlawful or void contract (such as illegal gambling or contraband)',
      'Failure of payee to send the legal notice within the mandatory 30-day window'
    ],
    amendments: [
      'Negotiable Instruments (Amendment) Act, 1988: Introduced Section 138 criminalizing cheque dishonour to boost commercial trust',
      'Negotiable Instruments (Amendment) Act, 2018 (Act 20 of 2018): Inserted Section 143A (20% interim compensation during trial) and Section 148 (deposit on appeal)'
    ],
    related_laws: [
      'Negotiable Instruments Act, 1881 - Section 141 (Offences by companies and vicarious liability of directors)',
      'Negotiable Instruments Act, 1881 - Section 143A (Power to direct interim compensation)',
      'Payment and Settlement Systems Act, 2007 - Section 25 (Dishonour of electronic funds transfer / NACH mandate)',
      'Bharatiya Nagarik Suraksha Sanhita, 2023 - Summary trial procedure'
    ],
    current_status: 'In Force (Active - Widely litigated commercial criminal provision across all Magistrate courts in India)',
    category_id: 'banking-financial-law',
    official_text: 'Where any cheque drawn by a person on an account maintained by him with a banker for payment of any amount of money to another person from out of that account for the discharge, in whole or in part, of any debt or other liability, is returned by the bank unpaid... such person shall be deemed to have committed an offence.',
    what_it_means: 'Cheque bounce is a criminal case under Section 138. Three conditions are mandatory: 1) Cheque presented within 3 months; 2) Legal demand notice sent within 30 days of bounce memo; 3) Drawer fails to pay within 15 days of notice receipt.',
    is_bailable: true,
    is_cognizable: false,
    court_triable: 'Judicial Magistrate of the First Class / Metropolitan Magistrate',
    related_sections: [
      { section_number: 'Section 141', act_name: 'Negotiable Instruments Act, 1881', title: 'Offences by companies (Director liability)' },
      { section_number: 'Section 143A', act_name: 'Negotiable Instruments Act, 1881', title: 'Power to direct interim compensation (20%)' }
    ],
    related_acts: ['Payment and Settlement Systems Act, 2007', 'Bharatiya Nagarik Suraksha Sanhita, 2023'],
    effective_date: '1 April 1989 (Substantive amendments in 2002 and 2018)',
    source: 'Ministry of Finance, Department of Financial Services, Govt of India / India Code',
    source_url: 'https://financialservices.gov.in/',
    last_updated: '2024-04-12',
    keywords: ['cheque bounce', 'section 138', 'dishonour of cheque', '15 days legal notice', 'interim compensation', 'bounced cheque', 'banking law'],
    state_applicability: 'All India',
    target_audience: ['Business Owners', 'General Citizens', 'Working Professional'],
    featured: true,
    view_count: 16800
  },

  // 2. Commercial & Corporate Law: Section 447 Companies Act, 2013 (Corporate Fraud)
  {
    id: 'companies-act-sec-447',
    official_name: 'Companies Act, 2013',
    act_name: 'Companies Act, 2013',
    short_act: 'Companies Act',
    short_description: 'Prescribes severe criminal liability, mandatory imprisonment, and multi-fold financial penalties for corporate officers or auditors guilty of fraud.',
    simple_explanation: 'Imposes severe criminal penalties on directors, auditors, and management who commit corporate fraud, falsify balance sheets, siphon company money, or deceive shareholders and banks.',
    year_enacted: 2013,
    sections: 'Section 447',
    section_number: 'Section 447',
    section_title: 'Punishment for Fraud in Corporate Affairs',
    sub_sections: [
      'Main Clause: Fraud involving at least ₹10 Lakhs or 1% of company turnover, whichever is lower',
      'Base Penal Scale: Imprisonment not less than six months extending to ten years and fine from 100% to 300% of fraud amount',
      'First Proviso (Public Interest): Where fraud involves public interest, minimum imprisonment is three years',
      'Second Proviso (Minor Fraud): Where fraud is below ₹10 Lakhs/1% turnover and no public interest is involved, imprisonment up to five years or fine up to ₹50 Lakhs'
    ],
    definitions: [
      {
        term: 'Fraud',
        meaning: 'Any act, omission, concealment of any fact or abuse of position committed by any person with intent to deceive, gain undue advantage, or injure the interests of the company, shareholders, or creditors, whether or not there is wrongful gain or wrongful loss.'
      },
      {
        term: 'Serious Fraud Investigation Office (SFIO)',
        meaning: 'The premier statutory multidisciplinary investigative agency established under Section 211 of Companies Act, 2013.'
      }
    ],
    offences: [
      'Siphoning corporate funds into shell entities or personal accounts of promoters',
      'Falsifying company accounts, inflated revenue entries, or bogus invoices',
      'Misrepresenting company financial health in prospectus to defraud public investors',
      'Collusive banking frauds and round-tripping of sanctioned credit lines'
    ],
    actions_covered: [
      'Siphoning corporate funds into shell companies or personal accounts',
      'Falsifying company accounts, balance sheets, or tax audit reports',
      'Misrepresenting company health in prospectus to deceive investors (IPO fraud)',
      'Defrauding banks and financial institutions via circular transactions'
    ],
    penalties_fines: 'Imprisonment from 6 months up to 10 years (minimum 3 years if public interest involved), plus mandatory fine from 100% up to 300% (three times) of the fraud amount.',
    punishment: 'Imprisonment from 6 months up to 10 years (minimum 3 years if public interest is involved). Non-compoundable.',
    fine: 'Fine shall not be less than the amount involved in the fraud, but may extend to 3 times (300%) the amount involved',
    imprisonment: '6 months to 10 years (minimum 3 years for public interest frauds)',
    consequences: [
      'Disqualification from serving as a director in any company for 5 years under Section 164',
      'Investigation and arrest powers by Serious Fraud Investigation Office (SFIO)',
      'Asset attachment under Prevention of Money Laundering Act (PMLA) by ED',
      'Cancellation of Chartered Accountant (CA) or CS professional licenses by ICAI/ICSI'
    ],
    other_consequences: 'Disqualification as a director for 5 years under Section 164; personal asset attachment by Serious Fraud Investigation Office (SFIO); PMLA attachment.',
    exceptions: [
      'Commercial business failures or honest errors of business judgment where there was no deceitful intent or concealment of facts',
      'Minor administrative errors lacking fraudulent mens rea (governed by civil compounding under Section 441)'
    ],
    amendments: [
      'Companies (Amendment) Act, 2017: Clarified thresholds for minor non-public interest frauds under second proviso',
      'Companies (Amendment) Act, 2020: Decriminalized procedural infractions while keeping Section 447 strictly criminal and non-compoundable'
    ],
    related_laws: [
      'Companies Act, 2013 - Section 212 (Investigation into affairs of company by SFIO)',
      'Companies Act, 2013 - Section 448 (Punishment for false statement)',
      'Prevention of Money Laundering Act, 2002 (PMLA)',
      'Insolvency and Bankruptcy Code, 2016 (IBC)',
      'Bharatiya Nyaya Sanhita, 2023 - Section 318 (Cheating)'
    ],
    current_status: 'In Force (Active - Enforced by Ministry of Corporate Affairs, SFIO, and Special Courts)',
    category_id: 'corporate-law',
    official_text: 'Without prejudice to any liability including repayment of any debt under this Act or any other law for the time being in force, any person who is found to be guilty of fraud involving an amount of at least ten lakh rupees or one per cent of the turnover of the company... shall be punishable with imprisonment for a term which shall not be less than six months but which may extend to ten years and shall also be liable to fine.',
    what_it_means: 'Section 447 defines corporate fraud broadly. Crucially, proving actual wrongful gain or wrongful loss is NOT required — mere intent to deceive or abuse position to injure the company or its creditors is enough.',
    is_bailable: false,
    is_cognizable: true,
    court_triable: 'Special Court established under Companies Act, 2013',
    related_sections: [
      { section_number: 'Section 212', act_name: 'Companies Act, 2013', title: 'Investigation into affairs of Company by SFIO' },
      { section_number: 'Section 448', act_name: 'Companies Act, 2013', title: 'Punishment for false statement in returns/records' }
    ],
    related_acts: ['Prevention of Money Laundering Act, 2002', 'Insolvency and Bankruptcy Code, 2016'],
    effective_date: '12 September 2013',
    source: 'Ministry of Corporate Affairs, Government of India (mca.gov.in) / India Code',
    source_url: 'https://www.mca.gov.in/',
    last_updated: '2023-11-01',
    keywords: ['corporate fraud', 'section 447', 'sfio', 'companies act', 'auditor fraud', 'white collar crime', 'director liability'],
    state_applicability: 'All India',
    target_audience: ['Business Owners', 'Working Professional', 'Law Student / Advocate'],
    view_count: 8900
  },

  // 3. Civil & Contract Law: Section 10 Indian Contract Act, 1872 (Enforceability)
  {
    id: 'contract-act-sec-10',
    official_name: 'Indian Contract Act, 1872',
    act_name: 'Indian Contract Act, 1872',
    short_act: 'Contract Act, 1872',
    short_description: 'Defines the essential criteria for legally enforceable contracts, stipulating free consent, competent parties, lawful consideration, and lawful object.',
    simple_explanation: 'Explains what makes a business agreement, lease, freelance deal, or employment contract legally binding in court: free consent (no coercion or threat), competent parties (adults of sound mind), and lawful purpose.',
    year_enacted: 1872,
    sections: 'Sections 10 & 23',
    section_number: 'Section 10 & 23',
    section_title: 'What Agreements are Contracts & What Considerations and Objects are Lawful',
    sub_sections: [
      'Section 10: All agreements are contracts if made by free consent of parties competent to contract, for lawful consideration and with a lawful object',
      'Section 23: Consideration or object is lawful unless forbidden by law, defeats provisions of law, is fraudulent, causes injury to person or property, or is immoral/opposed to public policy',
      'Section 23 Proviso: Every agreement of which the object or consideration is unlawful is void'
    ],
    definitions: [
      {
        term: 'Contract',
        meaning: 'An agreement enforceable by law under Section 2(h) of the Indian Contract Act.'
      },
      {
        term: 'Free Consent',
        meaning: 'Consent is free when not caused by coercion (Sec 15), undue influence (Sec 16), fraud (Sec 17), misrepresentation (Sec 18), or mistake (Sec 20).'
      },
      {
        term: 'Lawful Consideration',
        meaning: 'The price or promise exchanged between parties which must not be prohibited by law or opposed to public policy.'
      }
    ],
    offences: [
      'Civil violation: Breach of contract by failing or refusing to honor commercial promises without lawful excuse',
      'Procuring signatures or agreement under physical coercion, duress, or undue financial influence',
      'Entering into contracts with minors or persons of unsound mind (void ab initio)',
      'Agreements with unlawful objects (such as smuggling, bribery, or restraint of trade)'
    ],
    actions_covered: [
      'Breaching freelance delivery terms after taking advance payment',
      'Landlord illegally withholding security deposit after tenant vacates',
      'Company refusing to pay vendors despite satisfactory invoice delivery',
      'Signing contracts under coercion, blackmail, or duress'
    ],
    penalties_fines: 'Civil court decrees compensatory damages for financial losses suffered under Section 73, specific performance under Specific Relief Act, or restitution of benefits.',
    punishment: 'Civil remedy: Court decrees compensatory damages for financial losses suffered, specific performance of contract, or injunction restraining breach.',
    fine: 'Damages and compensation determined by Civil Court based on actual financial loss suffered',
    imprisonment: 'Civil prison in execution proceedings if debtor willfully refuses to obey court decree despite ability to pay.',
    consequences: [
      'Decree for specific performance ordering defaulting party to perform the promise (e.g. execute property sale deed)',
      'Execution petition and attachment of bank accounts and properties before Commercial Courts',
      'Interim injunction orders restraining third-party transfers',
      'Restitution of advantages received under void agreements under Section 65'
    ],
    other_consequences: 'Court attachment of bank accounts and property in execution petitions; specific performance decreed by Commercial Courts.',
    exceptions: [
      'Agreements declared void by statute: agreements in restraint of marriage (Sec 26), restraint of trade (Sec 27), and wagering agreements (Sec 30)',
      'Frustration of contract under Section 56 due to unforeseen supervening impossibility (Force Majeure)'
    ],
    amendments: [
      'Specific Relief (Amendment) Act, 2018: Made specific performance of contracts a general rule rather than an exceptional discretionary remedy',
      'Commercial Courts Act, 2015: Established specialized Commercial Courts for fast-track resolution of high-value business contracts'
    ],
    related_laws: [
      'Indian Contract Act, 1872 - Section 73 (Compensation for loss or damage caused by breach of contract)',
      'Specific Relief Act, 1963',
      'Commercial Courts Act, 2015',
      'Sale of Goods Act, 1930'
    ],
    current_status: 'In Force (Active - Foundational commercial civil statute governing all contracts in India)',
    category_id: 'contract-commercial-law',
    official_text: 'All agreements are contracts if they are made by the free consent of parties competent to contract, for a lawful consideration and with a lawful object, and are not hereby expressly declared to be void.',
    what_it_means: 'Not all agreements are contracts. An agreement becomes a legally binding contract enforceable in court only if all essential ingredients under Section 10 are met: Offer + Acceptance + Free Consent + Competent Parties + Lawful Consideration + Lawful Object.',
    is_bailable: true,
    is_cognizable: false,
    court_triable: 'Commercial Court / City Civil Court / District Civil Judge',
    related_sections: [
      { section_number: 'Section 73', act_name: 'Indian Contract Act, 1872', title: 'Compensation for loss or damage caused by breach of contract' },
      { section_number: 'Section 56', act_name: 'Indian Contract Act, 1872', title: 'Agreement to do impossible act (Doctrine of Frustration)' }
    ],
    related_acts: ['Specific Relief Act, 1963', 'Commercial Courts Act, 2015'],
    effective_date: '1 September 1872',
    source: 'Ministry of Law and Justice, Government of India / India Code (indiacode.nic.in)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/2187',
    last_updated: '2023-08-10',
    keywords: ['contract act', 'section 10', 'breach of contract', 'legal agreement', 'commercial agreement', 'damages', 'freelance contract'],
    state_applicability: 'All India',
    target_audience: ['Business Owners', 'Working Professional', 'Consumers', 'Students'],
    featured: true,
    view_count: 11900
  },

  // 4. Real Estate & Property Law: Section 18 RERA (Delay in Possession)
  {
    id: 'rera-sec-18',
    official_name: 'Real Estate (Regulation and Development) Act, 2016',
    act_name: 'Real Estate (Regulation and Development) Act, 2016',
    short_act: 'RERA Act, 2016',
    short_description: 'Protects homebuyers by granting statutory rights to full refunds with interest or monthly delay compensation when builders fail to deliver possession on schedule.',
    simple_explanation: 'Guarantees homebuyers the right to claim a 100% refund of money paid along with interest, or monthly interest for every month of construction delay until possession is delivered by the builder.',
    year_enacted: 2016,
    sections: 'Section 18',
    section_number: 'Section 18',
    section_title: 'Return of Amount and Compensation for Delay in Handing Over Possession',
    sub_sections: [
      'Section 18(1)(a): Failure by promoter to give possession in accordance with agreement for sale or due to discontinuance of business',
      'Section 18(1) Exit Option: Promoter liable to return amount received with interest at prescribed rate including compensation',
      'Section 18(1) Continuance Option: If allottee does not withdraw, promoter shall pay interest for every month of delay until possession',
      'Section 18(2): Promoter shall compensate allottee for loss caused due to defective title of the land'
    ],
    definitions: [
      {
        term: 'Promoter',
        meaning: 'A person or corporate developer who constructs an apartment building, converts building into apartments, or develops land into plots for sale to the public.'
      },
      {
        term: 'Allottee',
        meaning: 'A person to whom an apartment, plot, or building has been allotted, sold, or transferred by the promoter.'
      },
      {
        term: 'Prescribed Rate of Interest',
        meaning: 'Under State RERA rules (such as TSRERA/MahaRERA), typically State Bank of India (SBI) Highest MCLR + 2%.'
      }
    ],
    offences: [
      'Real estate developer failing to deliver apartment possession within the agreed handover date',
      'Builder unilaterally changing apartment plans without consent of two-thirds of buyers',
      'Diverting buyer funds to other projects in violation of mandatory 70% escrow account rules',
      'Marketing or selling apartments in unregistered real estate projects'
    ],
    actions_covered: [
      'Builder delaying possession of flat/apartment beyond date promised in agreement',
      'Builder unilaterally changing apartment plans without consent of two-thirds of buyers',
      'Builder diverting buyer funds into other projects in violation of 70% escrow rules'
    ],
    penalties_fines: 'Defaulting promoters: Fine up to 10% of estimated project cost under Section 59/61; defying RERA Appellate Tribunal orders carries imprisonment up to 3 years or additional fine up to 10% under Section 63.',
    punishment: 'RERA Authority directs full refund with SBI MCLR + 2% interest within 45 to 60 days. Defying RERA Appellate Tribunal orders carries up to 3 years imprisonment or fine under Section 63.',
    fine: 'Up to 10% of the estimated cost of the real estate project for promoter non-compliance',
    imprisonment: 'Up to 3 years for continuous defiance of RERA Appellate Tribunal orders',
    consequences: [
      'State RERA order directing immediate 100% refund of principal amount along with compounding interest within 45 to 60 days',
      'Revocation of project RERA registration and freezing of developer\'s designated project bank accounts',
      'Issuance of Revenue Recovery Certificates (RRC) executed through District Collector to attach builder land assets',
      'Blacklisting of promoter from launching new residential or commercial projects'
    ],
    other_consequences: 'Revocation of project registration, freezing of promoter project bank accounts, and attachment of builder assets via District Collector Revenue Recovery Certificates (RRC).',
    exceptions: [
      'Force majeure events (war, flood, drought, fire, cyclone, earthquake) formally approved by the Real Estate Regulatory Authority, granting an extension of up to 1 year',
      'Delays caused exclusively by failure of the allottee to pay agreed construction-linked installments'
    ],
    amendments: [
      'Newtech Promoters and Developers Pvt. Ltd. v. State of U.P. (2021) Supreme Court: Affirmed that RERA applies retroactively to all ongoing projects for which completion certificates had not been issued as of 1 May 2017',
      'Establishment of permanent State RERA Authorities and Appellate Tribunals (e.g. TSRERA in Telangana)'
    ],
    related_laws: [
      'RERA Act, 2016 - Section 4(2)(l)(D) (Mandatory 70% escrow account)',
      'RERA Act, 2016 - Section 31 (Filing of complaints)',
      'Consumer Protection Act, 2019 (Parallel consumer commission remedies)',
      'Insolvency and Bankruptcy Code, 2016 (Homebuyers as financial creditors)'
    ],
    current_status: 'In Force (Active - Enforced by State Real Estate Regulatory Authorities across all Indian States and UTs)',
    category_id: 'property-land-law',
    official_text: 'If the promoter fails to complete or is unable to give possession of an apartment, plot or building, in accordance with the terms of the agreement for sale... he shall be liable on demand to the allottees, in case the allottee wishes to withdraw from the project, without prejudice to any other remedy available, to return the amount received by him in respect of that apartment, plot, building, with interest at such rate as may be prescribed in this behalf including compensation.',
    what_it_means: 'Section 18 gives home buyers an absolute statutory right to either: 1) Exit the project and receive 100% of their money back with monthly compounding interest; OR 2) Stay in the project and receive monthly delay compensation interest until physical possession is handed over.',
    is_bailable: true,
    is_cognizable: false,
    court_triable: 'State Real Estate Regulatory Authority (e.g., TSRERA, MahaRERA, HRERA)',
    related_sections: [
      { section_number: 'Section 31', act_name: 'RERA Act, 2016', title: 'Filing of complaints with the Authority or Adjudicating Officer' },
      { section_number: 'Section 59', act_name: 'RERA Act, 2016', title: 'Punishment for non-registration of project' }
    ],
    related_acts: ['Consumer Protection Act, 2019', 'Insolvency and Bankruptcy Code, 2016'],
    effective_date: '1 May 2017',
    source: 'Ministry of Housing and Urban Affairs (MoHUA), Govt of India / State RERA Portals (rera.telangana.gov.in)',
    source_url: 'https://mohua.gov.in/cms/real-estate-act-2016.php',
    last_updated: '2024-04-01',
    keywords: ['rera', 'section 18', 'builder delay', 'flat possession', 'homebuyer rights', 'real estate fraud', 'refund with interest', 'tsrera'],
    state_applicability: 'All India',
    target_audience: ['Consumers', 'General Citizens', 'Working Professional'],
    featured: true,
    view_count: 14900
  },

  // 5. Consumer Protection: Consumer Protection Act, 2019 (COPRA Section 35 & 89)
  {
    id: 'copra-sec-35',
    official_name: 'Consumer Protection Act, 2019',
    act_name: 'Consumer Protection Act, 2019',
    short_act: 'Consumer Protection Act',
    short_description: 'Enables consumers to file direct complaints against unfair trade practices, defective products, and service deficiencies, with strict penalties for false ads.',
    simple_explanation: 'Empowers any buyer or service subscriber to file a consumer complaint online via the e-Daakhil portal against deficient services, expired/damaged goods, fake e-commerce items, or misleading celebrity endorsements.',
    year_enacted: 2019,
    sections: 'Sections 35 & 89',
    section_number: 'Section 35 & 89',
    section_title: 'Manner of Making Complaint to District Commission & Penalty for Misleading Advertisement',
    sub_sections: [
      'Section 35(1): Manner of filing a consumer complaint before District Commission by consumer, voluntary consumer association, or Central/State Government',
      'Section 35(2): Electronic filing of complaints via e-Daakhil portal and hearing through video-conferencing',
      'Section 89 Base Penal Scale: Any manufacturer or service provider causing false or misleading advertisement punishable with imprisonment up to two years and fine up to ten lakh rupees',
      'Section 89 Proviso: Subsequent offence punishable with imprisonment up to five years and fine up to fifty lakh rupees'
    ],
    definitions: [
      {
        term: 'Consumer',
        meaning: 'Any person who buys goods or hires services for consideration, including offline transactions, e-commerce, direct selling, and tele-shopping, excluding goods bought for commercial resale.'
      },
      {
        term: 'Misleading Advertisement',
        meaning: 'An advertisement which falsely describes a product or service, gives false guarantees, or conceals important information likely to mislead consumers.'
      },
      {
        term: 'Product Liability',
        meaning: 'The responsibility of a product manufacturer, service provider, or seller to compensate a consumer for harm caused by a defective product or deficient service.'
      }
    ],
    offences: [
      'E-commerce company refusing to refund or replace defective/counterfeit goods',
      'Airlines or travel aggregators denying statutory refunds upon flight cancellation',
      'Publishing misleading advertisements promising false cures or guarantees',
      'Charging over Maximum Retail Price (MRP) or failing to disclose ingredients'
    ],
    actions_covered: [
      'E-commerce company refusing to refund or replace defective/fake goods',
      'Airlines or travel aggregators denying statutory refunds upon flight cancellation',
      'Publishing misleading advertisements promising false medical or fitness cures',
      'Charging over Maximum Retail Price (MRP) or hidden surge fees without disclosure'
    ],
    penalties_fines: 'Misleading ads: Imprisonment up to 2 years and fine up to ₹10 Lakhs (first offence); up to 5 years and fine up to ₹50 Lakhs for repeat offence. Defying Commission: Imprisonment up to 3 years and fine up to ₹1 Lakh under Section 72.',
    punishment: 'Misleading ads: Imprisonment up to 2 years and fine up to ₹10 Lakhs (first offence); up to 5 years and fine up to ₹50 Lakhs for repeat offence. Defying Commission: Imprisonment up to 3 years and fine up to ₹1 Lakh under Section 72.',
    fine: 'Up to ₹10 Lakhs for first misleading advertisement; up to ₹50 Lakhs for repeat violation',
    imprisonment: 'Up to 2 years (first offence); up to 5 years (repeat offence) for misleading ads',
    consequences: [
      'Central Consumer Protection Authority (CCPA) order for nationwide product recall and mandatory consumer refund',
      'Disqualification of celebrity endorsers or influencers from endorsing any product or service for up to 3 years',
      'Cancellation of retail, e-commerce, or manufacturing business trade licenses',
      'Attachment of company assets to execute compensation decrees'
    ],
    other_consequences: 'Nationwide product recall ordered by Central Consumer Protection Authority (CCPA); up to 3-year ban on celebrity endorsers.',
    exceptions: [
      'Goods purchased exclusively for commercial resale or industrial manufacturing without self-employment nexus',
      'Endorsers who exercised due diligence and verified scientific basis before publishing endorsement'
    ],
    amendments: [
      'Consumer Protection Act, 2019 (Act 35 of 2019): Repealed Consumer Protection Act, 1986; introduced CCPA regulator, e-Daakhil online filing, product liability, and strict penal penalties for deceptive ads effective 20 July 2020',
      'Consumer Protection (E-Commerce) Rules, 2020: Enacted strict regulations on flash sales, manipulative dark patterns, and counterfeit listings'
    ],
    related_laws: [
      'Consumer Protection (E-Commerce) Rules, 2020',
      'Legal Metrology Act, 2009 (MRP & packaged commodities)',
      'Food Safety and Standards Act, 2006',
      'Bharatiya Nyaya Sanhita, 2023 - Section 318 (Cheating)'
    ],
    current_status: 'In Force (Active - Enforced nationwide with online e-Daakhil filing across District, State, and National Commissions)',
    category_id: 'consumer-law',
    official_text: 'A complaint, in relation to any goods sold or delivered or agreed to be sold or delivered or any service provided or agreed to be provided, may be filed with a District Commission by the consumer... or any voluntary consumer association. Any manufacturer or service provider who causes a false or misleading advertisement shall be punished.',
    what_it_means: 'The 2019 Act created the Central Consumer Protection Authority (CCPA) with powers to initiate class-action suits, order product recalls, and impose heavy fines. Consumers can file complaints online from anywhere via e-Daakhil without hiring a lawyer.',
    is_bailable: true,
    is_cognizable: false,
    court_triable: 'District Consumer Disputes Redressal Commission / E-Daakhil',
    related_sections: [
      { section_number: 'Section 2(7)', act_name: 'Consumer Protection Act, 2019', title: 'Definition of Consumer' },
      { section_number: 'Section 82', act_name: 'Consumer Protection Act, 2019', title: 'Product liability action' }
    ],
    related_acts: ['Legal Metrology Act, 2009', 'Food Safety and Standards Act, 2006'],
    effective_date: '20 July 2020 (Rules and e-Daakhil operationalized)',
    source: 'Department of Consumer Affairs, Ministry of Consumer Affairs, Food & Public Distribution, Govt of India (edaakhil.nic.in)',
    source_url: 'https://consumeraffairs.nic.in/acts-and-rules/consumer-protection',
    last_updated: '2024-05-18',
    keywords: ['consumer court', 'edaakhil', 'consumer complaint', 'misleading advertisement', 'defective product', 'copra', 'refund rights'],
    state_applicability: 'All India',
    target_audience: ['Consumers', 'General Citizens', 'Students'],
    featured: true,
    view_count: 16100
  },

  // 6. Labour & Employment Law: Payment of Wages Act, 1936 (Section 15 & 5) / Code on Wages
  {
    id: 'payment-wages-sec-15',
    official_name: 'Payment of Wages Act, 1936',
    act_name: 'Payment of Wages Act, 1936 (and Code on Wages, 2019)',
    short_act: 'Payment of Wages Act',
    short_description: 'Mandates timely disbursement of employee wages without unauthorized deductions, providing statutory claims before the Authority with compensation up to 10 times the unpaid amount.',
    simple_explanation: 'If your employer fails to pay your salary on time or makes unauthorized deductions, Section 15 of the Payment of Wages Act (and Section 17/45 of Code on Wages, 2019) empowers you to file a claim before the Labour Authority. The employer can be ordered to pay the delayed salary plus compensation up to 10 times the amount.',
    year_enacted: 1936,
    sections: 'Section 15 & Section 5',
    section_number: 'Section 15 & Section 5',
    section_title: 'Time of Payment of Wages & Claims Arising out of Deductions or Delay in Payment of Wages',
    sub_sections: [
      'Section 5: Wages must be paid before the expiry of the 7th day (for establishments < 1,000 employees) or 10th day (for other establishments) after the last day of the wage period',
      'Section 5(2): Where employment is terminated by employer, wages must be paid before the expiry of the second working day after termination',
      'Section 15(1): State Government appoints an Authority (Labour Court / Commissioner) to hear and decide claims arising out of deductions from or delay in payment of wages',
      'Section 15(3): Authority may direct payment of delayed wages together with compensation up to ten times (10x) the amount withheld, or up to ₹3,000 in case of delayed payment',
      'Section 20: Contravention of Section 5 or unauthorized deductions punishable with fine extending from ₹1,500 to ₹7,500'
    ],
    definitions: [
      {
        term: 'Wages',
        meaning: 'All remuneration expressed in terms of money payable to an employed person in respect of their employment or of work done in such employment.'
      },
      {
        term: 'Wage Period',
        meaning: 'The period fixed by the person responsible for payment of wages, which shall not exceed one month.'
      },
      {
        term: 'Authority',
        meaning: 'Any Commissioner for Workmen\'s Compensation or other officer with judicial/labour experience appointed by the State Government to adjudicate wage dispute claims.'
      }
    ],
    offences: [
      'Employer withholding salary or delaying payment past the 7th or 10th day of the subsequent month',
      'Failing to pay complete terminal dues within 2 working days of termination or resignation',
      'Making unlawful or unauthorized wage deductions not sanctioned under Section 7 of the Act',
      'Failing to produce wage registers or pay slips before the Labour Inspector'
    ],
    actions_covered: [
      'Employer withholding salary or delaying payment past the 7th or 10th of the month',
      'Failing to pay final settlement within 2 working days after resignation or termination',
      'Making unlawful deductions from employee wages without written statutory authorization',
      'Refusing to disburse earned wages to working professionals, contract staff, or laborers'
    ],
    penalties_fines: 'Employer fined between ₹1,500 to ₹7,500 per default under Section 20; Authority orders payment of delayed salary along with compensation up to ten times (10x) the withheld amount under Section 15(3). Repeat offences carry fines up to ₹22,500 or imprisonment up to 6 months.',
    punishment: 'Fine between ₹1,500 to ₹7,500 under Section 20, plus payment of delayed wages with statutory compensation up to 10 times the unpaid amount. Repeat offences punishable with fine from ₹3,750 to ₹22,500 or imprisonment up to 6 months.',
    fine: '₹1,500 to ₹7,500 for first offence; ₹3,750 to ₹22,500 for repeat non-payment of wages',
    imprisonment: 'Up to 6 months imprisonment for repeat or continuous failure to pay wages under Section 20(1)',
    consequences: [
      'Recovery order issued as arrears of land revenue through the District Collector / Revenue Authority',
      'Order directing employer to pay full delayed wages plus up to 10x statutory compensation to employee',
      'Attachment of company bank accounts and movable property in execution of Labour Court orders',
      'Parallel civil recovery suit for breach of employment contract under Section 73 of Indian Contract Act, 1872'
    ],
    other_consequences: 'Attachment of company assets as arrears of land revenue; liability to pay 10x compensation to the aggrieved employee.',
    exceptions: [
      'Lawful deductions specifically authorized under Section 7: income tax (TDS), Provident Fund (PF), ESI, court attachment decrees, or approved advances',
      'Employees whose monthly wages exceed the statutory threshold limit specified by government notification (who instead seek recovery under Industrial Disputes Act Section 33C(2) or Civil Court breach of contract)'
    ],
    amendments: [
      'Payment of Wages (Amendment) Act, 2017: Authorized payment of wages through bank account transfer or cheque to eliminate cash wage exploitation',
      'Code on Wages, 2019 (Act 29 of 2019): Consolidates Payment of Wages Act 1936, Minimum Wages Act 1948, Payment of Bonus Act 1965, and Equal Remuneration Act 1976; universalizes timely wage payment to all employees across all sectors'
    ],
    related_laws: [
      'Code on Wages, 2019 - Section 17 (Time limit for payment of wages: by 7th of subsequent month)',
      'Code on Wages, 2019 - Section 45 & 54 (Claims and penalties for non-payment of wages)',
      'Industrial Disputes Act, 1947 - Section 33C(2) (Recovery of money due from an employer via Labour Court)',
      'Indian Contract Act, 1872 - Section 73 (Compensation for breach of employment contract)'
    ],
    current_status: 'In Force (Active - Enforced by State Labour Commissioners and Central Chief Labour Commissioner)',
    category_id: 'labour-employment-law',
    official_text: 'Section 5(1): The wages of every person employed upon or in any railway, factory or industrial or other establishment shall be paid before the expiry of the seventh day, or where less than one thousand persons are employed, before the expiry of the tenth day, after the last day of the wage-period... Section 15: Where contrary to the provisions of this Act any deduction has been made from the wages of an employed person, or any payment of wages has been delayed, such person... may apply to such authority for a direction under sub-section (3).',
    what_it_means: 'If your employer does not pay your salary on time, Section 5 sets the strict deadline (before the 7th or 10th of the following month, and within 2 working days if terminated). Section 15 allows you to file an application before the Labour Commissioner/Authority to recover your unpaid salary plus statutory compensation up to 10 times the amount.',
    is_bailable: true,
    is_cognizable: false,
    court_triable: 'Authority under the Payment of Wages Act / Labour Court',
    related_sections: [
      { section_number: 'Section 5', act_name: 'Payment of Wages Act, 1936', title: 'Time of payment of wages (7th or 10th day deadline)' },
      { section_number: 'Section 20', act_name: 'Payment of Wages Act, 1936', title: 'Penalty for offences under the Act' },
      { section_number: 'Section 17', act_name: 'Code on Wages, 2019', title: 'Time limit for payment of wages' }
    ],
    related_acts: ['Code on Wages, 2019', 'Industrial Disputes Act, 1947', 'Indian Contract Act, 1872'],
    effective_date: '28 March 1937 (Substantively amended in 2005 and 2017)',
    source: 'Ministry of Labour and Employment, Government of India (labour.gov.in) / India Code',
    source_url: 'https://labour.gov.in/payment-of-wages-act-1936',
    last_updated: '2024-03-01',
    keywords: ['salary delay', 'employer not paying salary', 'unpaid salary', 'payment of wages', 'section 15', 'section 5', 'code on wages', 'labour court', 'wage deduction', 'employee rights'],
    state_applicability: 'All India',
    target_audience: ['Working Professional', 'Business Owners', 'General Citizens'],
    featured: true,
    view_count: 15400
  }
];
