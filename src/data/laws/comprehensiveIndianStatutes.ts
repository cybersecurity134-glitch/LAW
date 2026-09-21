import { LawItem } from '../../types';

export const COMPREHENSIVE_INDIAN_STATUTES: LawItem[] = [
  // 1. TAX LAW: Section 276C Income-tax Act, 1961 (Wilful Evasion of Tax)
  {
    id: 'it-act-sec-276c',
    official_name: 'Income-tax Act, 1961',
    act_name: 'Income-tax Act, 1961 (Act No. 43 of 1961)',
    short_act: 'Income-tax Act, 1961',
    short_description: 'Prescribes rigorous imprisonment up to 7 years and statutory fine for wilful attempts to evade any tax, penalty, or interest, or understating taxable income.',
    simple_explanation: 'If a person or business wilfully conceals income, fabricates fraudulent expenditure, or evades paying tax exceeding ₹25 Lakhs, Section 276C mandates rigorous imprisonment from 6 months up to 7 years with fine.',
    year_enacted: 1961,
    sections: 'Section 276C',
    section_number: 'Section 276C',
    section_title: 'Wilful Attempt to Evade Tax, Penalty or Interest',
    sub_sections: [
      'Sub-section (1)(i): Where tax, penalty or interest evaded exceeds twenty-five hundred thousand rupees (₹25 Lakhs), rigorous imprisonment not less than six months extending to seven years and with fine',
      'Sub-section (1)(ii): In any other case, rigorous imprisonment not less than three months extending to two years and with fine',
      'Sub-section (2): Wilful attempt to evade payment of any tax, penalty or interest - rigorous imprisonment not less than three months extending to two years and fine',
      'Explanation: Wilful attempt includes possessing false books of account, making false entries, or causing circumstances to evade tax'
    ],
    definitions: [
      {
        term: 'Wilful Evasion',
        meaning: 'Deliberate and intentional action to avoid assessment, calculation, or payment of tax due under the statute through fraudulent concealment or falsification.'
      },
      {
        term: 'Assessee',
        meaning: 'A person by whom any tax or any other sum of money is payable under this Act, including deemed assessees in default.'
      },
      {
        term: 'Central Board of Direct Taxes (CBDT)',
        meaning: 'The apex statutory authority established under the Central Boards of Revenue Act, 1963 administering direct taxes in India.'
      }
    ],
    offences: [
      'Maintaining bogus double accounts or suppressing cash sales receipts to evade income tax',
      'Claiming fraudulent fictitious deductions or fake charity donations under 80G',
      'Routing unaccounted black money through accommodation entries or shell entities',
      'Failing to deposit tax deducted at source (TDS) with the Central Government'
    ],
    actions_covered: [
      'Maintaining fraudulent double accounts or suppressing revenue',
      'Claiming fictitious deductions or bogus business expenses',
      'Routing unaccounted money through accommodation entries',
      'Wilful non-payment of assessed statutory income tax'
    ],
    penalties_fines: 'For evasion exceeding ₹25 Lakhs: Rigorous imprisonment from 6 months to 7 years and fine; for other amounts: Rigorous imprisonment from 3 months to 2 years and fine; plus 50% to 200% penalty under Section 270A.',
    punishment: 'Rigorous imprisonment from 6 months up to 7 years and with fine for evasion over ₹25 Lakhs. Prosecution is conducted before Special Economic Offences Courts.',
    fine: 'Court fine plus civil tax penalty of 50% to 200% of tax evaded under Section 270A',
    imprisonment: '6 months to 7 years rigorous imprisonment',
    consequences: [
      'Criminal prosecution in Special Court for Economic Offences initiated by Principal Commissioner of Income Tax',
      'Provisional attachment of bank accounts, immovable assets, and mutual funds under Section 281B',
      'Look Out Circular (LOC) issued at international immigration checkpoints preventing travel abroad',
      'Blacklisting and notification to financial intelligence units and commercial lenders'
    ],
    other_consequences: 'Provisional attachment of bank accounts and properties under Section 281B; Look Out Circular (LOC) at airports.',
    exceptions: [
      'Bona fide computational disagreements or conflicting interpretations of complex tax laws where all facts were disclosed in return',
      'Compounding of offences permitted under Section 279(2) upon payment of compounding charges subject to CBDT guidelines'
    ],
    amendments: [
      'Finance Act, 2012: Enhanced threshold under Section 276C(1)(i) to ₹25 Lakhs to focus prosecution on high-value tax evaders',
      'Finance Act, 2020: Rationalized penalty framework under Section 270A for under-reporting and misreporting of income'
    ],
    related_laws: [
      'Income-tax Act, 1961 - Section 270A (Penalty for under-reporting and misreporting of income)',
      'Income-tax Act, 1961 - Section 276B (Failure to pay tax deducted at source - TDS)',
      'Black Money (Undisclosed Foreign Income and Assets) Act, 2015',
      'Prevention of Money Laundering Act, 2002 (PMLA)'
    ],
    current_status: 'In Force (Active - Enforced by Income Tax Department & Special Economic Offences Courts)',
    category_id: 'tax-law',
    official_text: 'If a person wilfully attempts in any manner whatsoever to evade any tax, penalty or interest chargeable or imposable under this Act, he shall, without prejudice to any penalty that may be imposable on him under any other provision of this Act, be punishable... where the amount sought to be evaded exceeds twenty-five hundred thousand rupees, with rigorous imprisonment for a term which shall not be less than six months but which may extend to seven years and with fine.',
    what_it_means: 'Section 276C converts serious tax evasion from a mere monetary penalty into a criminal offence carrying jail time. Taxpayers cannot escape criminal liability simply by offering to pay tax once discovered during search or survey operations.',
    is_bailable: true,
    is_cognizable: false,
    court_triable: 'Special Court for Economic Offences / Chief Judicial Magistrate',
    related_sections: [
      { section_number: 'Section 270A', act_name: 'Income-tax Act, 1961', title: 'Penalty for under-reporting and misreporting of income' },
      { section_number: 'Section 276B', act_name: 'Income-tax Act, 1961', title: 'Failure to pay tax deducted at source' }
    ],
    related_acts: ['Black Money Act, 2015', 'Prevention of Money Laundering Act, 2002'],
    effective_date: '1 April 1962',
    source: 'Central Board of Direct Taxes (CBDT), Ministry of Finance, Govt of India / India Code',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/1585',
    last_updated: '2024-04-01',
    keywords: ['income tax evasion', 'section 276c', 'cbdt', 'tax fraud', 'black money', 'tax penalty', 'unaccounted income', 'tax prosecution'],
    state_applicability: 'All India',
    target_audience: ['Business Owners', 'Working Professional', 'General Citizens'],
    featured: true,
    view_count: 14200
  },

  // 2. TAX LAW: Section 132 Central Goods and Services Tax Act, 2017 (GST Fraud & Fake Invoicing)
  {
    id: 'cgst-act-sec-132',
    official_name: 'Central Goods and Services Tax Act, 2017',
    act_name: 'Central Goods and Services Tax Act, 2017 (Act No. 12 of 2017)',
    short_act: 'CGST Act, 2017',
    short_description: 'Criminalizes GST fraud, issuing fake tax invoices without actual supply of goods, fraudulent Input Tax Credit (ITC) claims, and makes evasion over ₹5 Crore cognizable and non-bailable.',
    simple_explanation: 'Section 132 penalizes generating bogus GST bills or claiming fraudulent Input Tax Credit. If the tax evasion or fake billing exceeds ₹5 Crore, it is a non-bailable offence carrying up to 5 years imprisonment.',
    year_enacted: 2017,
    sections: 'Section 132',
    section_number: 'Section 132',
    section_title: 'Punishment for Certain Offences (GST Evasion & Bogus Invoicing)',
    sub_sections: [
      'Sub-section (1)(a)-(d): Supplying goods without invoice, issuing invoice without supply, availing Input Tax Credit (ITC) using bogus invoices, or evading tax',
      'Sub-section (1)(i): Where tax evaded or fake ITC exceeds ₹5 Crore - Imprisonment up to 5 years and fine (Cognizable & Non-Bailable under Sub-section (5))',
      'Sub-section (1)(ii): Where tax evaded exceeds ₹2 Crore up to ₹5 Crore - Imprisonment up to 3 years and fine',
      'Sub-section (1)(iii): Where tax evaded exceeds ₹1 Crore up to ₹2 Crore - Imprisonment up to 1 year and fine',
      'Sub-section (2): Repeat offence - Imprisonment up to 5 years and with fine'
    ],
    definitions: [
      {
        term: 'Input Tax Credit (ITC)',
        meaning: 'Credit of central tax, state tax, or integrated tax charged on any supply of goods or services used in the course of business.'
      },
      {
        term: 'Fake Invoice (Circular Trading)',
        meaning: 'Issuing a tax invoice or bill of supply without any underlying physical transfer or supply of goods or services to generate fraudulent tax credits.'
      },
      {
        term: 'Directorate General of GST Intelligence (DGGI)',
        meaning: 'The apex intelligence organization under CBIC tasked with detecting and prosecuting organized GST tax evasion.'
      }
    ],
    offences: [
      'Issuing GST invoices without supplying any underlying goods or services (circular billing)',
      'Availing or utilizing Input Tax Credit using fake invoices or fraudulent documents',
      'Collecting GST from customers but failing to deposit it with the government within 3 months',
      'Falsifying financial records or destroying statutory GST registers to evade tax'
    ],
    actions_covered: [
      'Generating bogus GST invoices without genuine supply',
      'Passing on or claiming fraudulent Input Tax Credit (ITC)',
      'Failing to deposit collected GST within 3 months of collection',
      'Obstructing GST officers during statutory audit or search'
    ],
    penalties_fines: 'Evasion over ₹5 Crore: Imprisonment up to 5 years and fine (Non-Bailable); Evasion ₹2-5 Crore: Imprisonment up to 3 years and fine; plus 100% statutory penalty under Section 122.',
    punishment: 'Imprisonment up to 5 years and fine. Non-bailable and cognizable if amount exceeds ₹5 Crore.',
    fine: 'Court-imposed fine plus 100% civil penalty on tax evaded under Section 122',
    imprisonment: 'Up to 5 years imprisonment',
    consequences: [
      'Arrest by DGGI / GST Commissioner without prior court warrant under Section 69 for evasion over ₹5 Crore',
      'Provisional attachment of bank accounts, factory inventory, and real estate under Section 83',
      'Blocking of electronic credit ledger under Rule 86A preventing business operations',
      'Cancellation of GSTIN registration preventing any further legal sales'
    ],
    other_consequences: 'Provisional attachment of bank accounts under Section 83; blocking of Input Tax Credit ledger under Rule 86A; GSTIN cancellation.',
    exceptions: [
      'Clerical or technical mismatches in GSTR-1 and GSTR-3B filed without fraudulent intention to deceive',
      'Compounding of offences allowed under Section 138 upon paying prescribed compounding fee, except for repeat commercial offenders'
    ],
    amendments: [
      'Finance Act, 2020: Made fraudulent availing of ITC without invoice a cognizable and non-bailable offence',
      'Finance Act, 2023: Raised monetary threshold for prosecution under Section 132 from ₹1 Crore to ₹2 Crore (except for fake invoicing which remains prosecuted at any amount)'
    ],
    related_laws: [
      'Central Goods and Services Tax Act, 2017 - Section 69 (Power to arrest)',
      'Central Goods and Services Tax Act, 2017 - Section 83 (Provisional attachment to protect revenue)',
      'Central Goods and Services Tax Act, 2017 - Section 122 (Penalties for certain offences)',
      'Bharatiya Nyaya Sanhita, 2023 - Section 318 & 336 (Cheating and Forgery)'
    ],
    current_status: 'In Force (Active - Enforced by DGGI, Central & State GST Departments)',
    category_id: 'tax-law',
    official_text: 'Whoever commits, or causes to commit and retain the benefits arising out of, any of the following offences, namely: (a) supplies any goods or services or both without issue of any invoice... (b) issues any invoice or bill without supply of goods or services... (c) avails input tax credit using such invoice... shall be punishable where the amount of tax evaded or the amount of input tax credit wrongly availed or utilised exceeds five hundred lakh rupees, with imprisonment for a term which may extend to five years and with fine.',
    what_it_means: 'Generating fake GST invoices to claim illegal input tax credits or refund fraud is treated with zero tolerance. If the fraud value crosses ₹500 Lakhs (₹5 Crore), the offence is explicitly non-bailable and tax officers have statutory authority to effect arrests.',
    is_bailable: false,
    is_cognizable: true,
    court_triable: 'Court of Session / Special Magistrate for Economic Offences',
    related_sections: [
      { section_number: 'Section 69', act_name: 'CGST Act, 2017', title: 'Power to arrest' },
      { section_number: 'Section 83', act_name: 'CGST Act, 2017', title: 'Provisional attachment of property to protect revenue' }
    ],
    related_acts: ['Integrated Goods and Services Tax Act, 2017', 'Bharatiya Nyaya Sanhita, 2023'],
    effective_date: '1 July 2017',
    source: 'Central Board of Indirect Taxes and Customs (CBIC), Ministry of Finance, Govt of India / India Code',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/2202',
    last_updated: '2024-03-15',
    keywords: ['gst fraud', 'section 132', 'fake invoice', 'input tax credit', 'itc fraud', 'dggi arrest', 'circular trading', 'cbic'],
    state_applicability: 'All India',
    target_audience: ['Business Owners', 'Working Professional'],
    featured: true,
    view_count: 12800
  },

  // 3. CIVIL LAW: Section 9 Code of Civil Procedure, 1908 (Jurisdiction of Civil Courts)
  {
    id: 'cpc-sec-9',
    official_name: 'Code of Civil Procedure, 1908',
    act_name: 'Code of Civil Procedure, 1908 (Act No. 5 of 1908)',
    short_act: 'Code of Civil Procedure',
    short_description: 'Affirms that Civil Courts possess inherent statutory jurisdiction to try all civil suits involving rights to property, office, contracts, and torts unless expressly or impliedly barred.',
    simple_explanation: 'Section 9 is the master gate of Indian civil justice. It guarantees that if your legal, civil, contractual, or property right is violated, you have an inherent right to file a civil suit in court unless a specific statute (like NGT or DRT) expressly bars civil court jurisdiction.',
    year_enacted: 1908,
    sections: 'Section 9',
    section_number: 'Section 9',
    section_title: 'Courts to Try All Civil Suits Unless Barred',
    sub_sections: [
      'Operative Mandate: The Courts shall (subject to the provisions herein contained) have jurisdiction to try all suits of a civil nature excepting suits of which their cognizance is either expressly or impliedly barred',
      'Explanation I: A suit in which the right to property or to an office is contested is a suit of a civil nature, notwithstanding that such right may depend entirely on the decision of questions as to religious rites or ceremonies',
      'Explanation II: For the purposes of this section, it is immaterial whether or not any fees are attached to the office referred to in Explanation I, or whether or not such office is attached to a particular place'
    ],
    definitions: [
      {
        term: 'Suit of a Civil Nature',
        meaning: 'A legal proceeding instituted for the determination, enforcement, or protection of private civil rights and obligations of individuals or legal entities.'
      },
      {
        term: 'Express Bar',
        meaning: 'Where a specific parliamentary enactment explicitly strips Civil Courts of jurisdiction (e.g., Section 34 of SARFAESI Act, Section 15 of NGT Act).'
      },
      {
        term: 'Inherent Civil Jurisdiction',
        meaning: 'The fundamental presumption that a citizen has an open remedy in a Civil Court for every civil wrong (Ubi jus ibi remedium).'
      }
    ],
    offences: [
      'Infringement of private property rights, unlawful encroachment, or boundary trespass',
      'Breach of commercial agreements, non-payment of contract debt, or failure to render accounts',
      'Defamation causing civil injury to reputation seeking monetary damages',
      'Denial of right to hereditary, religious, or administrative office'
    ],
    actions_covered: [
      'Filing civil suit for declaration of title and ownership',
      'Seeking permanent injunction against unlawful dispossession',
      'Claiming monetary damages for breach of civil obligations',
      'Enforcing private contractual covenants and easements'
    ],
    penalties_fines: 'Civil Court decrees: Mandatory injunctions, permanent restraining orders, attachment and sale of property in execution, and civil imprisonment of judgment-debtor under Section 51 CPC.',
    punishment: 'Civil Court grants decree of specific relief, permanent injunction, or monetary damages. Disobedience of civil injunction invites detention in civil prison up to 3 months under Order 39 Rule 2A.',
    fine: 'Costs of litigation awarded under Section 35 CPC; compensatory costs for vexatious claims under Section 35A',
    imprisonment: 'Detention in civil prison up to 3 months for disobedience of court injunction under Order XXXIX Rule 2A CPC',
    consequences: [
      'Issuance of interim temporary injunction restraining defendant from alienating or altering property under Order 39',
      'Attachment of movable and immovable properties of judgment-debtor prior to or in execution of decree',
      'Appointment of Court Receiver under Order 40 to take physical possession of disputed assets',
      'Issuance of arrest warrant for detention in civil prison for wilful default in executing money decree'
    ],
    other_consequences: 'Temporary injunction under Order 39; appointment of Court Commissioner; attachment before judgment under Order 38.',
    exceptions: [
      'Matters exclusively committed to specialized statutory tribunals (e.g. Debts Recovery Tribunal under RDDBFI Act, NCLT under Companies Act)',
      'Suits involving purely religious, caste, or social questions lacking any tangible civil or property right'
    ],
    amendments: [
      'Code of Civil Procedure (Amendment) Act, 1976: Inserted Explanation II clarifying that absence of fees does not strip office disputes of civil nature',
      'Commercial Courts Act, 2015: Designated specialized Commercial Benches within Civil Courts for fast-track commercial dispute adjudication'
    ],
    related_laws: [
      'Code of Civil Procedure, 1908 - Order 39 Rules 1 & 2 (Temporary Injunctions)',
      'Specific Relief Act, 1963 - Section 34 (Discretion of court as to declaration of status or right)',
      'Commercial Courts Act, 2015',
      'Arbitration and Conciliation Act, 1996 - Section 8'
    ],
    current_status: 'In Force (Active - Foundation of Indian civil litigation across District & High Courts)',
    category_id: 'civil-law',
    official_text: 'The Courts shall (subject to the provisions herein contained) have jurisdiction to try all suits of a civil nature excepting suits of which their cognizance is either expressly or impliedly barred.',
    what_it_means: 'Whenever your civil right, property ownership, boundary, or contract is disputed, you have a guaranteed right to seek justice from a civil court. The presumption is always in favor of the court\'s jurisdiction unless a specific law explicitly takes it away.',
    is_bailable: true,
    is_cognizable: false,
    court_triable: 'Civil Judge (Junior Division) / Senior Civil Judge / District Judge / High Court',
    related_sections: [
      { section_number: 'Order 39 Rule 1 & 2', act_name: 'Code of Civil Procedure, 1908', title: 'Cases in which temporary injunction may be granted' },
      { section_number: 'Section 151', act_name: 'Code of Civil Procedure, 1908', title: 'Saving of inherent powers of Court' }
    ],
    related_acts: ['Specific Relief Act, 1963', 'Commercial Courts Act, 2015'],
    effective_date: '1 January 1909',
    source: 'Legislative Department, Ministry of Law and Justice, Govt of India / India Code',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/2191',
    last_updated: '2024-01-10',
    keywords: ['cpc', 'section 9', 'civil court', 'jurisdiction', 'civil suit', 'property dispute', 'injunction', 'stay order', 'code of civil procedure'],
    state_applicability: 'All India',
    target_audience: ['General Citizens', 'Law Student / Advocate', 'Business Owners'],
    featured: true,
    view_count: 15300
  },

  // 4. ADMINISTRATIVE LAW: Section 14 & 19 Administrative Tribunals Act, 1985 (Service Matters & CAT)
  {
    id: 'ata-sec-14-19',
    official_name: 'Administrative Tribunals Act, 1985',
    act_name: 'Administrative Tribunals Act, 1985 (Act No. 13 of 1985)',
    short_act: 'Administrative Tribunals Act',
    short_description: 'Confers exclusive original jurisdiction on Central Administrative Tribunal (CAT) to adjudicate disputes concerning recruitment and service conditions of civil servants and defense civilian staff.',
    simple_explanation: 'Under Article 323A of the Constitution and Section 14/19 of this Act, government employees and candidates facing illegal termination, denied promotions, arbitrary transfers, or withheld pensions file applications directly before the Central Administrative Tribunal (CAT).',
    year_enacted: 1985,
    sections: 'Section 14 & Section 19',
    section_number: 'Section 14 & 19',
    section_title: 'Jurisdiction, Powers and Authority of Central Administrative Tribunal & Applications to Tribunals',
    sub_sections: [
      'Section 14(1): Central Administrative Tribunal exercises all jurisdiction, powers and authority exercisable by all courts (except Supreme Court) regarding recruitment and service conditions of civil servants of the Union',
      'Section 19(1): A person aggrieved by any order pertaining to any matter within jurisdiction may make an application to the Tribunal for the redressal of his grievance',
      'Section 20: Exhaustion of statutory administrative remedies condition before approaching Tribunal',
      'Section 21: One-year limitation period from date of final rejection of service representation'
    ],
    definitions: [
      {
        term: 'Service Matters',
        meaning: 'All matters relating to remuneration, pension, leave, provident fund, tenure, confirmation, seniority, promotion, reversion, premature retirement, and disciplinary dismissal.'
      },
      {
        term: 'Central Administrative Tribunal (CAT)',
        meaning: 'The specialized constitutional administrative court established under Article 323A of the Constitution with Principal Bench in New Delhi and Benches across India.'
      },
      {
        term: 'Civil Servant',
        meaning: 'A person who is a member of an All-India Service, civil service of the Union, or holds a civil post in connection with the affairs of the Union.'
      }
    ],
    offences: [
      'Arbitrary termination or dismissal of a public servant in violation of Article 311 of Constitution',
      'Unlawful withholding of superannuation retirement pension, gratuity, or provident fund',
      'Superseding senior eligible officers in departmental promotion committee (DPC) proceedings',
      'Malafide transfer orders passed in violation of established statutory transfer guidelines'
    ],
    actions_covered: [
      'Filing Original Application (OA) against arbitrary dismissal from government service',
      'Challenging supersession in central civil service promotions',
      'Challenging punitive or mala fide transfer orders',
      'Seeking release of withheld retirement pensions and terminal benefits'
    ],
    penalties_fines: 'Tribunal orders: Quashing illegal termination, ordering retrospective reinstatement with full back-wages, directing promotion with consequential seniority, and initiating contempt proceedings under Section 17.',
    punishment: 'Tribunal has powers of a High Court under Contempt of Courts Act, 1971 to punish contemnors with imprisonment up to 6 months or fine up to ₹2,000 under Section 17 for disobeying orders.',
    fine: 'Contempt fine up to ₹2,000 under Section 17; heavy costs imposed on defaulting ministries',
    imprisonment: 'Up to 6 months civil imprisonment for contempt of tribunal under Section 17',
    consequences: [
      'Quashing of illegal disciplinary charge-sheet, enquiry report, and penalty orders',
      'Mandatory retrospective reinstatement into government service with all arrears of pay',
      'Stay on execution of illegal transfer orders during pendency of Original Application',
      'Issuance of Contempt of Court notice against Secretary of Department for non-compliance'
    ],
    other_consequences: 'Stay on arbitrary transfer or dismissal orders; contempt proceedings under Section 17 against errant executive officers.',
    exceptions: [
      'Uniformed members of Naval, Military, or Air Forces or other armed forces of the Union (governed by Armed Forces Tribunal - AFT under AFT Act, 2007)',
      'Officers and servants of Supreme Court of India or High Courts (Article 146 & 229)'
    ],
    amendments: [
      'L. Chandra Kumar v. Union of India (1997) 7 SCC 261: Supreme Court held decisions of CAT are subject to judicial review under Article 226 before a Division Bench of the High Court',
      'Administrative Tribunals (Amendment) Act, 2006: Streamlined appointments and qualifications of Judicial and Administrative Members'
    ],
    related_laws: [
      'Constitution of India - Article 323A (Administrative tribunals)',
      'Constitution of India - Article 311 (Dismissal, removal or reduction in rank of civil servants)',
      'Contempt of Courts Act, 1971 - Section 17 (Powers of Tribunals)',
      'Central Civil Services (Classification, Control and Appeal) Rules, 1965 (CCS CCA Rules)'
    ],
    current_status: 'In Force (Active - Enforced by Central Administrative Tribunal Benches nationwide)',
    category_id: 'administrative-law',
    official_text: 'Save as otherwise expressly provided in this Act, the Central Administrative Tribunal shall exercise, on and from the appointed day, all the jurisdiction, powers and authority exercisable immediately before that day by all courts (except the Supreme Court) in relation to recruitment, and matters concerning recruitment, to any All-India Service or to any civil service of the Union.',
    what_it_means: 'If you are a central government employee or defense civilian, the Civil Court cannot hear your service grievances. Section 14 vests exclusive jurisdiction with the Central Administrative Tribunal (CAT), providing a specialized judicial forum for speedy adjudication.',
    is_bailable: true,
    is_cognizable: false,
    court_triable: 'Central Administrative Tribunal (CAT) / State Administrative Tribunal (SAT)',
    related_sections: [
      { section_number: 'Section 17', act_name: 'Administrative Tribunals Act, 1985', title: 'Power to punish for contempt' },
      { section_number: 'Section 20', act_name: 'Administrative Tribunals Act, 1985', title: 'Applications not to be admitted unless other remedies exhausted' }
    ],
    related_acts: ['Constitution of India - Article 323A', 'Contempt of Courts Act, 1971'],
    effective_date: '1 November 1985',
    source: 'Department of Personnel and Training (DoPT), Ministry of Personnel, Public Grievances and Pensions, Govt of India / India Code',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/1344',
    last_updated: '2023-11-15',
    keywords: ['cat', 'administrative tribunal', 'service matter', 'government employee', 'section 14', 'section 19', 'arbitrary transfer', 'illegal termination', 'pension delay'],
    state_applicability: 'All India',
    target_audience: ['Working Professional', 'General Citizens', 'Law Student / Advocate'],
    featured: true,
    view_count: 9800
  },

  // 5. STATE-SPECIFIC LEGISLATION: Section 6 Delhi Special Police Establishment Act, 1946 (State Consent for CBI)
  {
    id: 'dspe-sec-6',
    official_name: 'Delhi Special Police Establishment Act, 1946',
    act_name: 'Delhi Special Police Establishment Act, 1946 (Act No. 25 of 1946)',
    short_act: 'DSPE Act (CBI Statutory Charter)',
    short_description: 'Mandates that the Central Bureau of Investigation (CBI) cannot exercise police powers or investigate offences within any State without the explicit prior consent of that State Government.',
    simple_explanation: 'Police and public order are State subjects under the Constitution. Section 6 of the DSPE Act mandates that the Central Bureau of Investigation (CBI) cannot investigate crimes within a State unless the State Government has given general or specific consent, or unless ordered by the High Court or Supreme Court.',
    year_enacted: 1946,
    sections: 'Section 6',
    section_number: 'Section 6',
    section_title: 'Consent of State Government to Exercise of Powers and Jurisdiction by CBI',
    sub_sections: [
      'Operative Provision: Nothing contained in section 5 shall be deemed to enable any member of the Delhi Special Police Establishment to exercise powers and jurisdiction in any area in a State, not being a Union territory or railway area, without the consent of the Government of that State',
      'Constitutional Principle: Respects federal distribution of legislative and executive powers under Seventh Schedule (List II, Entry 2 - Police)',
      'Judicial Proviso: High Courts (under Article 226) and Supreme Court (under Article 32) can direct CBI investigation without State consent'
    ],
    definitions: [
      {
        term: 'Delhi Special Police Establishment (DSPE)',
        meaning: 'The statutory special police force established under Section 2, known popularly as the Central Bureau of Investigation (CBI).'
      },
      {
        term: 'General Consent',
        meaning: 'A standing notification issued by a State Government allowing the CBI to register cases against central employees or specified offences within its territorial limits.'
      },
      {
        term: 'Specific Consent',
        meaning: 'Case-by-case permission granted by a State Government for investigating a particular crime or individual.'
      }
    ],
    offences: [
      'CBI conducting unauthorized search, raid, or arrest within a State without state consent or constitutional court order',
      'Interference by central investigative agency with exclusive state police domain in non-federal offences',
      'Registering FIRs against state civil servants without mandatory statutory permissions'
    ],
    actions_covered: [
      'Withdrawal of general consent by State Government (e.g. West Bengal, Tamil Nadu, Kerala, Telangana)',
      'Challenging CBI FIR registered without valid State consent under Section 6',
      'High Court ordering CBI investigation into heinous crimes overcoming absence of State consent'
    ],
    penalties_fines: 'Quashing of unauthorized CBI FIRs, invalidation of search seizures conducted without jurisdiction, and strict constitutional review by High Courts and Supreme Court.',
    punishment: 'Jurisdictional bar: CBI proceedings initiated without State consent or Constitutional Court order are void ab initio and liable to be quashed by the High Court under Section 528 BNSS (Sec 482 CrPC).',
    fine: 'Judicial costs assessed against investigating agencies for overreaching federal statutory limits',
    imprisonment: 'No personal penal jail term for Section 6; functions as a strict statutory bar on investigative power',
    consequences: [
      'Immediate challenge in High Court under Article 226 for quashing of CBI FIR registered without jurisdiction',
      'Inadmissibility of evidence collected in contravention of statutory territorial jurisdiction',
      'Requirement for CBI to obtain specific case-by-case sanction from State Home Department',
      'Exclusive jurisdiction reverts back to State Criminal Investigation Department (CID) or State Anti-Corruption Bureau (ACB)'
    ],
    other_consequences: 'Quashing of FIR by High Court; invalidation of charge-sheet filed without requisite State consent.',
    exceptions: [
      'Constitutional writ orders: Supreme Court or High Courts directing a CBI probe under Article 32 or 226 (State of West Bengal v. Committee for Protection of Democratic Rights, 2010)',
      'Union Territories and Railway areas where Central Government holds direct statutory police jurisdiction under Section 5',
      'Trap cases conducted against Central Government public servants in central offices located within state borders where general consent persists'
    ],
    amendments: [
      'State of West Bengal v. Committee for Protection of Democratic Rights (2010) 3 SCC 571: Supreme Court Constitution Bench held Constitutional Courts can direct CBI investigation without State consent',
      'Central Vigilance Commission Act, 2003: Vested superintendence over CBI regarding corruption investigations in Central Vigilance Commission (CVC)'
    ],
    related_laws: [
      'Constitution of India - Seventh Schedule, List II, Entry 2 (State Police powers)',
      'Delhi Special Police Establishment Act, 1946 - Section 5 (Extension of powers to other areas)',
      'Prevention of Corruption Act, 1988 - Section 17A (Previous approval of inquiry)',
      'Bharatiya Nagarik Suraksha Sanhita, 2023 - Section 528 (Inherent powers of High Court)'
    ],
    current_status: 'In Force (Active - Governs CBI jurisdiction across all Indian States and Union Territories)',
    category_id: 'state-specific-legislation',
    official_text: 'Nothing contained in section 5 shall be deemed to enable any member of the Delhi Special Police Establishment to exercise powers and jurisdiction in any area in a State, not being a Union territory or railway area, without the consent of the Government of that State.',
    what_it_means: 'Under India\'s federal system, policing is a State subject. The CBI cannot simply enter a State and investigate an offence without the State Government\'s consent, unless the Supreme Court or High Court specifically orders the investigation to ensure impartiality.',
    is_bailable: true,
    is_cognizable: false,
    court_triable: 'High Court / Supreme Court of India / Special CBI Court',
    related_sections: [
      { section_number: 'Section 5', act_name: 'DSPE Act, 1946', title: 'Extension of powers and jurisdiction of special police establishment to other areas' },
      { section_number: 'Section 3', act_name: 'DSPE Act, 1946', title: 'Offences to be investigated by Delhi Special Police Establishment' }
    ],
    related_acts: ['Constitution of India', 'Prevention of Corruption Act, 1988'],
    effective_date: '19 November 1946',
    source: 'Ministry of Personnel, Public Grievances and Pensions, Govt of India / India Code',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/1409',
    last_updated: '2024-02-20',
    keywords: ['cbi jurisdiction', 'dspe act', 'section 6', 'general consent', 'state police powers', 'federalism', 'cbi raid', 'state consent'],
    state_applicability: 'State-Specific & Union Jurisdictions',
    target_audience: ['General Citizens', 'Law Student / Advocate', 'Working Professional'],
    featured: true,
    view_count: 11400
  },

  // 6. OTHER LAWS & SECTORAL STATUTES: Section 51 Disaster Management Act, 2005 (Defiance of Emergency Orders)
  {
    id: 'dma-sec-51',
    official_name: 'Disaster Management Act, 2005',
    act_name: 'Disaster Management Act, 2005 (Act No. 53 of 2005)',
    short_act: 'Disaster Management Act',
    short_description: 'Prescribes imprisonment up to 2 years and fines for obstructing disaster management personnel or refusing to comply with directions issued during national or state emergencies.',
    simple_explanation: 'Enacted to manage national disasters, floods, cyclones, and health crises. Section 51 punishes anyone who obstructs disaster response officers, hoards essential emergency relief supplies, or defies curfew and containment orders.',
    year_enacted: 2005,
    sections: 'Section 51',
    section_number: 'Section 51',
    section_title: 'Punishment for Obstruction, etc., to Disaster Management Personnel or Orders',
    sub_sections: [
      'Clause (a): Whoever obstructs any officer or employee of the Central Government or the State Government, or person authorized by the National Authority or State Authority or District Authority',
      'Clause (b): Refuses to comply with any direction given by or on behalf of the Central Government or State Government or District Authority under this Act',
      'Penal Scale: Punishable on conviction with imprisonment for a term which may extend to one year or with fine, or with both',
      'Extended Penalty Proviso: If such obstruction or refusal to comply with directions results in loss of lives or imminent danger thereof, imprisonment may extend to two years'
    ],
    definitions: [
      {
        term: 'Disaster',
        meaning: 'A catastrophe, mishap, calamity or grave occurrence in any area, arising from natural or man-made causes, or by accident or negligence, resulting in substantial loss of life or human suffering.'
      },
      {
        term: 'National Disaster Management Authority (NDMA)',
        meaning: 'The apex statutory body established under Section 3 headed by the Prime Minister of India.'
      },
      {
        term: 'District Disaster Management Authority (DDMA)',
        meaning: 'The district-level statutory body headed by the District Collector/District Magistrate executing emergency relief operations.'
      }
    ],
    offences: [
      'Refusing to comply with lawful emergency containment, evacuation, or curfew orders during a notified disaster',
      'Physically assaulting or obstructing healthcare workers, emergency rescue personnel, or NDRF teams',
      'Making false alarms or circulating fabricated warnings regarding disasters leading to panic under Section 54',
      'Misappropriating disaster relief money, rations, or medical supplies under Section 53'
    ],
    actions_covered: [
      'Defying disaster emergency lockdown or quarantine orders',
      'Obstructing National Disaster Response Force (NDRF) or relief workers',
      'Circulating false rumors or fake alarms about impending catastrophes',
      'Hoarding essential disaster medical supplies or oxygen cylinders'
    ],
    penalties_fines: 'Imprisonment up to 1 year or fine, or both; if disobedience leads to loss of life or imminent danger, imprisonment extends up to 2 years and substantial fine.',
    punishment: 'Imprisonment for a term which may extend to one year or with fine, or with both. If violation causes loss of life, imprisonment extends to two years.',
    fine: 'Judicial fine assessed by Magistrate; fine for making false claim extends up to ₹10,000 under Section 52',
    imprisonment: '1 to 2 years imprisonment',
    consequences: [
      'Immediate spot registration of criminal FIR and arrest by police officers',
      'Impounding and seizure of vehicles, boats, and equipment used in violating emergency orders',
      'Corporate liability under Section 56 for company directors failing to comply with disaster directions',
      'Summary criminal trial before Metropolitan Magistrate or Judicial Magistrate First Class'
    ],
    other_consequences: 'Vehicle impoundment; confiscation of hoarded relief materials; immediate cancellation of commercial permits.',
    exceptions: [
      'Bona fide impossibility of compliance due to extreme physical incapacity or severe medical emergency',
      'Emergency personnel acting strictly in good faith for the preservation of life (Section 73 protection)'
    ],
    amendments: [
      'Nationwide invocation during COVID-19 pandemic under Section 6(2)(i) orders issued by National Executive Committee',
      'Disaster Management (Amendment) Bill, 2024: Introduced statutory provisions for urban disaster management authorities and database consolidation'
    ],
    related_laws: [
      'Disaster Management Act, 2005 - Section 52 (Punishment for false claim)',
      'Disaster Management Act, 2005 - Section 54 (Punishment for false warning or panic)',
      'Epidemic Diseases Act, 1897 - Section 3 (Penalty for disobeying regulations)',
      'Bharatiya Nyaya Sanhita, 2023 - Section 223 (Disobedience to order duly promulgated by public servant)'
    ],
    current_status: 'In Force (Active - Enforced by NDMA, SDMAs, District Magistrates & Police Forces nationwide)',
    category_id: 'other-laws',
    official_text: 'Whoever, without reasonable cause: (a) obstructs any officer or employee of the Central Government or the State Government... or (b) refuses to comply with any direction given by or on behalf of the Central Government or the State Government... shall on conviction be punishable with imprisonment for a term which may extend to one year or with fine, or with both, and if such obstruction or refusal to comply with directions results in loss of lives or imminent danger thereof, shall be punishable with imprisonment for a term which may extend to two years.',
    what_it_means: 'During emergencies like floods, earthquakes, industrial leaks, or pandemics, orders issued by the National or District Disaster Management Authority have statutory force of law. Defying these directions or spreading false panic carries up to 2 years imprisonment.',
    is_bailable: true,
    is_cognizable: true,
    court_triable: 'Judicial Magistrate of the First Class / Metropolitan Magistrate',
    related_sections: [
      { section_number: 'Section 52', act_name: 'Disaster Management Act, 2005', title: 'Punishment for false claim for obtaining relief' },
      { section_number: 'Section 54', act_name: 'Disaster Management Act, 2005', title: 'Punishment for false warning leading to panic' }
    ],
    related_acts: ['Epidemic Diseases Act, 1897', 'Bharatiya Nyaya Sanhita, 2023'],
    effective_date: '23 December 2005 (Notification S.O. 1088(E))',
    source: 'National Disaster Management Authority (NDMA), Ministry of Home Affairs, Govt of India / India Code',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/2042',
    last_updated: '2024-01-20',
    keywords: ['disaster management', 'section 51', 'ndma', 'emergency orders', 'curfew violation', 'false panic rumor', 'lockdown violation', 'disaster relief'],
    state_applicability: 'All India',
    target_audience: ['General Citizens', 'Working Professional', 'Business Owners'],
    featured: true,
    view_count: 8900
  },

  // 7. BANKING & FINANCIAL LAW: Prevention of Money-Laundering Act, 2002 (Section 3 & 4)
  {
    id: 'pmla-sec-3-4',
    official_name: 'Prevention of Money-Laundering Act, 2002',
    act_name: 'Prevention of Money-Laundering Act, 2002 (Act No. 15 of 2003)',
    short_act: 'PMLA, 2002',
    short_description: 'Imposes rigorous imprisonment from 3 to 7 years (up to 10 years for NDPS scheduled offences) and unlimited fine, alongside mandatory confiscation of tainted property proceeds of crime.',
    simple_explanation: 'PMLA criminalizes concealing, possessing, acquiring, or projecting black money or crime proceeds as untainted legal wealth. The Enforcement Directorate (ED) has statutory powers to attach properties, freeze bank accounts, and arrest suspects.',
    year_enacted: 2002,
    sections: 'Section 3 & Section 4',
    section_number: 'Section 3 & 4',
    section_title: 'Offence of Money-Laundering & Punishment for Money-Laundering',
    sub_sections: [
      'Section 3: Whosoever directly or indirectly attempts to indulge or knowingly assists or is party or is involved in any process or activity connected with the proceeds of crime including its concealment, possession, acquisition or use and projecting or claiming it as untainted property',
      'Section 4: Rigorous imprisonment for a term not less than three years but which may extend to seven years and fine',
      'Section 4 Proviso: Where proceeds of crime involve Narcotic Drugs (NDPS Act offences), imprisonment may extend up to ten years',
      'Section 45: Twin conditions for bail - Public Prosecutor must be given opportunity to oppose bail and court must be satisfied of reasonable grounds of innocence'
    ],
    definitions: [
      {
        term: 'Proceeds of Crime',
        meaning: 'Any property derived or obtained, directly or indirectly, by any person as a result of criminal activity relating to a scheduled offence.'
      },
      {
        term: 'Enforcement Directorate (ED)',
        meaning: 'The premier specialized economic intelligence and enforcement agency under Department of Revenue, Ministry of Finance.'
      },
      {
        term: 'Scheduled Offence (Predicate Offence)',
        meaning: 'The underlying criminal offence listed in the Schedule to PMLA (e.g., murder, cheating, corruption, drug trafficking, corporate fraud).'
      }
    ],
    offences: [
      'Layering proceeds of corruption or corporate fraud through shell companies or hawala channels',
      'Converting unaccounted illicit cash into real estate, gold, luxury assets, or offshore trusts',
      'Projecting tainted criminal proceeds as legitimate business loans or corporate revenue',
      'Possessing or concealing property knowing it was obtained through scheduled criminal offences'
    ],
    actions_covered: [
      'Acquiring, possessing, or using tainted proceeds of crime',
      'Projecting illicit wealth as legitimate business profits',
      'Transferring criminal proceeds through hawala or foreign offshore bank accounts',
      'Concealing assets derived from corruption or extortion'
    ],
    penalties_fines: 'Rigorous imprisonment from 3 to 7 years (up to 10 years for NDPS offences) and fine without upper ceiling; mandatory attachment and permanent confiscation of all proceeds of crime to Central Government.',
    punishment: 'Rigorous imprisonment for 3 to 7 years (extendable to 10 years) and unlimited fine. Non-bailable with stringent twin conditions under Section 45.',
    fine: 'Unlimited fine assessed by Special Court based on magnitude of laundered proceeds',
    imprisonment: '3 to 7 years rigorous imprisonment (up to 10 years for narcotics-related laundering)',
    consequences: [
      'Provisional attachment of bank accounts, immovable real estate, and equity shares under Section 5',
      'Arrest by Enforcement Directorate (ED) under Section 19 on basis of material in possession',
      'Look Out Circulars (LOC) preventing accused from leaving the territory of India',
      'Permanent vesting of attached properties in Central Government upon conviction under Section 8(5)'
    ],
    other_consequences: 'Provisional attachment of properties under Section 5; stringent Section 45 twin bail conditions; confiscation of assets.',
    exceptions: [
      'Bona fide purchasers for value without notice who acquired property without knowledge of its illicit criminal origin (Section 8 protection)',
      'Statutory relief under Section 45 for persons under 16 years of age, women, or sick or infirm persons'
    ],
    amendments: [
      'Finance Act, 2019: Inserted Explanation to Section 3 clarifying that money-laundering is a continuing activity as long as a person enjoys proceeds of crime',
      'Vijay Madanlal Choudhary v. Union of India (2022) Supreme Court: Upheld constitutional validity of PMLA provisions including Section 3, 5, 19, and 45 twin bail conditions'
    ],
    related_laws: [
      'Prevention of Money Laundering Act, 2002 - Section 5 (Provisional attachment of property)',
      'Prevention of Money Laundering Act, 2002 - Section 19 (Power to arrest)',
      'Prevention of Money Laundering Act, 2002 - Section 45 (Offences to be cognizable and non-bailable)',
      'Prevention of Corruption Act, 1988'
    ],
    current_status: 'In Force (Active - Enforced by Enforcement Directorate and Special PMLA Courts nationwide)',
    category_id: 'banking-financial-law',
    official_text: 'Whosoever directly or indirectly attempts to indulge or knowingly assists or knowingly is a party or is actually involved in any process or activity connected with the proceeds of crime including its concealment, possession, acquisition or use and projecting or claiming it as untainted property shall be guilty of offence of money-laundering... and shall be punishable with rigorous imprisonment for a term which shall not be less than three years but which may extend to seven years and shall also be liable to fine.',
    what_it_means: 'PMLA makes laundering money a standalone criminal offence. Even if you did not commit the original crime, if you help hide, convert, or project the dirty money as clean, you face rigorous imprisonment and your properties will be attached by the Enforcement Directorate.',
    is_bailable: false,
    is_cognizable: true,
    court_triable: 'Special Court (Court of Session designated under Section 43 PMLA)',
    related_sections: [
      { section_number: 'Section 5', act_name: 'PMLA, 2002', title: 'Attachment of property involved in money-laundering' },
      { section_number: 'Section 45', act_name: 'PMLA, 2002', title: 'Offences to be cognizable and non-bailable (Twin conditions)' }
    ],
    related_acts: ['Prevention of Corruption Act, 1988', 'Narcotic Drugs and Psychotropic Substances Act, 1985'],
    effective_date: '1 July 2005',
    source: 'Enforcement Directorate, Department of Revenue, Ministry of Finance, Govt of India / India Code',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/2036',
    last_updated: '2024-03-01',
    keywords: ['pmla', 'money laundering', 'ed arrest', 'enforcement directorate', 'section 3', 'section 4', 'proceeds of crime', 'property attachment', 'twin bail conditions'],
    state_applicability: 'All India',
    target_audience: ['Business Owners', 'Working Professional', 'Law Student / Advocate'],
    featured: true,
    view_count: 17800
  },

  // 8. EVIDENCE & PROCEDURE: Section 61 Bharatiya Sakshya Adhiniyam, 2023 (Admissibility of Electronic Records)
  {
    id: 'bsa-sec-61',
    official_name: 'Bharatiya Sakshya Adhiniyam, 2023',
    act_name: 'Bharatiya Sakshya Adhiniyam, 2023 (BSA - Act No. 47 of 2023)',
    short_act: 'Bharatiya Sakshya Adhiniyam',
    short_description: 'Modernizes admissibility of electronic and digital records, electronic signatures, and digital certificates replacing Section 65B of the repealed Indian Evidence Act, 1872.',
    simple_explanation: 'Governs how WhatsApp chats, digital emails, CCTV video clips, server logs, and voice recordings can be submitted as valid, legally admissible evidence in Indian courts with mandatory statutory electronic certification.',
    year_enacted: 2023,
    sections: 'Section 61 & Section 63',
    section_number: 'Section 61 & 63',
    section_title: 'Admissibility of Electronic or Digital Record (Replaced Section 65B Evidence Act)',
    sub_sections: [
      'Section 61: Nothing in this Adhiniyam shall apply to deny admissibility of electronic or digital record in evidence on the ground that it is an electronic or digital record and such record shall have the same legal effect, validity and enforceability as other document',
      'Section 63(1): Any information contained in an electronic record which is printed on paper, stored, recorded or copied in optical or magnetic media shall be deemed to be also a document and admissible in any proceedings',
      'Section 63(4): Mandatory certificate signed by person occupying responsible official position in relation to operation of relevant device identifying electronic record and hash values',
      'Schedule Part A & Part B: Standard statutory format for electronic evidence certificate'
    ],
    definitions: [
      {
        term: 'Electronic Record',
        meaning: 'Data, record or data generated, image or sound stored, received or sent in an electronic form or micro film or computer generated micro fiche.'
      },
      {
        term: 'Hash Value',
        meaning: 'A unique algorithmic numeric string generated using cryptographic mathematical formulas (e.g. SHA-256) verifying that digital evidence has not been tampered with or modified.'
      },
      {
        term: 'Intermediary Server Log',
        meaning: 'System audit logs maintained by telecom operators, internet service providers, or cloud service providers recording timestamped data exchanges.'
      }
    ],
    offences: [
      'Fabricating doctored WhatsApp screenshots, deepfake audio, or manipulated CCTV video to deceive court',
      'Submitting uncertified electronic printouts without mandatory Section 63 certificate',
      'Tampering with forensic hash values of confiscated digital evidence in police custody',
      'Destroying primary electronic storage devices to evade court subpoena'
    ],
    actions_covered: [
      'Submitting emails, text messages, or audio recordings in civil or criminal trials',
      'Producing CCTV surveillance footage in road accident or crime trials',
      'Filing statutory certificate under Section 63 for digital proof admissibility',
      'Challenging forged or doctored electronic records via forensic cyber examiner'
    ],
    penalties_fines: 'Inadmissibility of electronic proof lacking Section 63 certification; fabricating false electronic evidence punishable under Section 229 & 236 of Bharatiya Nyaya Sanhita, 2023 with imprisonment up to 7 years.',
    punishment: 'Evidence lacking statutory certificate is strictly inadmissible. Intentionally fabricating false electronic records punishable with up to 7 years imprisonment under BNS 2023.',
    fine: 'Contempt costs and judicial penalties for filing manipulated digital records',
    imprisonment: 'Up to 7 years imprisonment for fabricating false evidence under BNS 2023',
    consequences: [
      'Outright rejection of digital chats or video evidence if accompanied by defective Section 63 certificate',
      'Direction by Court to submit primary physical smartphone or hard drive for forensic hashing',
      'Summoning of forensic cyber examiner under Section 39 BSA to verify metadata integrity',
      'Prosecution for perjury under Section 215 BNSS against person filing fabricated screenshots'
    ],
    other_consequences: 'Rejection of digital evidence lacking certificate; forensic hashing under court directions.',
    exceptions: [
      'Where the primary electronic device itself is directly produced in court for inspection (original device exception)',
      'Where obtaining a certificate is physically impossible and the court dispenses with it upon proof of bona fide impossibility'
    ],
    amendments: [
      'Bharatiya Sakshya Adhiniyam, 2023 enacted as Act 47 of 2023: Fully replaced Indian Evidence Act, 1872 w.e.f. 1 July 2024',
      'Integrated Schedule with bilingual Part A and Part B certificate templates eliminating ambiguity in trial courts'
    ],
    related_laws: [
      'Information Technology Act, 2000 - Section 2(t) & Section 4',
      'Bharatiya Nyaya Sanhita, 2023 - Section 229 (Giving false evidence)',
      'Bharatiya Nagarik Suraksha Sanhita, 2023 - Section 176 (Forensic investigation)',
      'Digital Personal Data Protection Act, 2023'
    ],
    current_status: 'In Force (Active - Enforced in all judicial and criminal proceedings across India w.e.f. 1 July 2024)',
    category_id: 'evidence-procedure',
    official_text: 'Nothing in this Adhiniyam shall apply to deny the admissibility of an electronic or digital record in evidence on the ground that it is an electronic or digital record and such record shall, subject to section 63, have the same legal effect, validity and enforceability as other document.',
    what_it_means: 'Under the new BSA 2023, digital records like WhatsApp messages, call logs, emails, and dashcam videos have equal legal status with paper documents. To present them in court, you must submit a statutory certificate under Section 63 confirming that the device was operating properly and the data is unaltered.',
    is_bailable: true,
    is_cognizable: false,
    court_triable: 'All Courts, Tribunals and Arbitrators across India',
    related_sections: [
      { section_number: 'Section 63', act_name: 'Bharatiya Sakshya Adhiniyam, 2023', title: 'Admissibility of electronic records and mandatory certificate' },
      { section_number: 'Section 39', act_name: 'Bharatiya Sakshya Adhiniyam, 2023', title: 'Opinion of examiner of electronic evidence' }
    ],
    related_acts: ['Information Technology Act, 2000', 'Bharatiya Nyaya Sanhita, 2023'],
    effective_date: '1 July 2024',
    source: 'Ministry of Home Affairs Gazette Notification S.O. 850(E) / India Code',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/21729',
    last_updated: '2024-07-01',
    keywords: ['bsa 2023', 'section 61', 'section 63', 'electronic evidence', 'whatsapp evidence', 'section 65b', 'digital certificate', 'cctv evidence', 'evidence in court'],
    state_applicability: 'All India',
    target_audience: ['General Citizens', 'Law Student / Advocate', 'Working Professional'],
    featured: true,
    view_count: 16500
  }
];
