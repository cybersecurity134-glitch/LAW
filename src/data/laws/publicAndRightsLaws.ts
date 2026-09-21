import { LawItem } from '../../types';

export const PUBLIC_RIGHTS_LAWS: LawItem[] = [
  // 1. Constitutional Law: Article 21 (Right to Life & Personal Liberty)
  {
    id: 'constitution-art-21',
    official_name: 'The Constitution of India, 1950',
    act_name: 'The Constitution of India, 1950',
    short_act: 'Constitution of India',
    short_description: 'The fundamental constitutional right guaranteeing that no person shall be deprived of life or personal liberty except according to fair procedure established by law.',
    simple_explanation: 'The most important fundamental right in India: guarantees that the government or police cannot take away your life, bodily freedom, or personal privacy without a fair, just, and reasonable law.',
    year_enacted: 1950,
    sections: 'Article 21',
    section_number: 'Article 21',
    section_title: 'Protection of Life and Personal Liberty (Fundamental Right)',
    sub_sections: [
      'Operative Text: No person shall be deprived of his life or personal liberty except according to procedure established by law',
      'Substantive Scope: Guarantees human dignity, right to privacy, clean environment, free legal aid, and protection against state torture'
    ],
    definitions: [
      {
        term: 'Life',
        meaning: 'Something more than mere animal existence; includes the right to live with human dignity, livelihood, health, clean drinking water, and pollution-free air.'
      },
      {
        term: 'Personal Liberty',
        meaning: 'A wide spectrum of individual freedoms including privacy, bodily autonomy, travel abroad, speedy trial, and freedom from arbitrary detention.'
      },
      {
        term: 'Procedure Established by Law',
        meaning: 'A valid legislative enactment that is just, fair, reasonable, and non-oppressive, satisfying Articles 14, 19, and 21 (Golden Triangle test).'
      }
    ],
    offences: [
      'Unlawful police custody or custodial torture without Magistrate remand',
      'Mass state surveillance or unauthorized phone interception violating fundamental privacy (Puttaswamy ruling)',
      'Arbitrary bulldozing or demolition of private houses without statutory due process',
      'Industrial units poisoning drinking water or polluting air in violation of citizens\' right to life'
    ],
    actions_covered: [
      'Illegal detention by police without presenting before a Magistrate within 24 hours',
      'Unauthorized wiretapping or mass digital surveillance violating privacy (Puttaswamy judgment)',
      'Arbitrary demolition of houses without written notice or fair hearing',
      'Poisoning water supply or polluting air affecting citizens\' right to health'
    ],
    penalties_fines: 'Constitutional shield against state overreach; Supreme Court and High Courts award exemplary public law monetary compensation against defaulting state authorities.',
    punishment: 'State actions violating Article 21 are declared unconstitutional and void ab initio. Courts award monetary compensation against the State and order disciplinary/criminal prosecution of errant officers.',
    fine: 'Exemplary public law compensation awarded against state authorities by Supreme Court/High Court',
    imprisonment: 'Criminal imprisonment for errant public servants under BNS for illegal confinement or custodial torture.',
    consequences: [
      'Direct issuance of Prerogative Constitutional Writs (Habeas Corpus, Mandamus, Certiorari) under Articles 32 and 226',
      'Striking down of unconstitutional statutes that fail the test of procedural fairness',
      'Exemplary monetary damages awarded against the State paid to victims or families',
      'Binding national guidelines framed by Supreme Court (e.g., D.K. Basu arrest guidelines)'
    ],
    other_consequences: 'Immediate release via Writ of Habeas Corpus under Article 32 (Supreme Court) or Article 226 (High Court); stay on state action.',
    exceptions: [
      'Deprivation of life or liberty is permitted ONLY pursuant to a valid legislative enactment that is just, fair, reasonable, and non-oppressive (e.g., death penalty for rarest-of-rare crimes)',
      'Lawful preventive detention subject to strict constitutional review under Article 22'
    ],
    amendments: [
      'Constitution (44th Amendment) Act, 1978: Prohibited suspension of Article 20 and Article 21 even during a National Emergency declared by the President',
      'Constitution (86th Amendment) Act, 2002: Inserted Article 21A making free and compulsory education for children aged 6-14 a fundamental right'
    ],
    related_laws: [
      'Constitution of India - Article 14 (Equality before law)',
      'Constitution of India - Article 19 (Protection of fundamental freedoms)',
      'Constitution of India - Article 32 (Constitutional remedies before Supreme Court)',
      'Constitution of India - Article 226 (Writ jurisdiction of High Courts)',
      'Protection of Human Rights Act, 1993'
    ],
    current_status: 'In Force (Active - Supreme constitutional law of India)',
    category_id: 'constitutional-law',
    official_text: 'No person shall be deprived of his life or personal liberty except according to procedure established by law.',
    what_it_means: 'Article 21 is the heart of the Constitution. Through landmark judgments (Maneka Gandhi, Francis Coralie, Puttaswamy), the Supreme Court has expanded it to cover: Right to Privacy, Right to Clean Drinking Water & Air, Right to Speedy Trial, Right to Free Legal Aid, and Right to Livelihood.',
    is_bailable: true,
    is_cognizable: true,
    court_triable: 'High Court (Article 226) / Supreme Court of India (Article 32)',
    related_sections: [
      { section_number: 'Article 14', act_name: 'Constitution of India', title: 'Equality before law' },
      { section_number: 'Article 19', act_name: 'Constitution of India', title: 'Protection of certain rights regarding freedom of speech, etc.' },
      { section_number: 'Article 32', act_name: 'Constitution of India', title: 'Remedies for enforcement of fundamental rights (Writ jurisdiction)' }
    ],
    related_acts: ['Protection of Human Rights Act, 1993'],
    effective_date: '26 January 1950',
    source: 'Legislative Department, Ministry of Law and Justice, Govt of India / India Code',
    source_url: 'https://legislative.gov.in/constitution-of-india/',
    last_updated: '2024-01-01',
    keywords: ['article 21', 'right to life', 'fundamental right', 'personal liberty', 'privacy judgment', 'puttaswamy', 'habeas corpus', 'constitution of india'],
    state_applicability: 'All India',
    target_audience: ['General Citizens', 'Law Student / Advocate', 'Students'],
    featured: true,
    view_count: 24500
  },

  // 2. Public Governance & Transparency: RTI Act, 2005 (Section 6 & 7)
  {
    id: 'rti-act-sec-6',
    official_name: 'Right to Information Act, 2005',
    act_name: 'Right to Information Act, 2005',
    short_act: 'RTI Act, 2005',
    short_description: 'Empowers Indian citizens to secure information from public authorities, prescribing a mandatory 30-day timeline and personal fines on defaulting officers.',
    simple_explanation: 'Empowers every Indian citizen to request and inspect government files, records, road contracts, fund allocations, and exam answer sheets from any government office within 30 days.',
    year_enacted: 2005,
    sections: 'Sections 6 & 7',
    section_number: 'Section 6 & 7',
    section_title: 'Request for Obtaining Information & Disposal of Request (30-Day Mandatory Window)',
    sub_sections: [
      'Section 6(1): Application in writing or electronic mode with nominal fee specifying particulars of information sought',
      'Section 6(2): Applicant shall not be required to give any reason for requesting information or personal details except contact address',
      'Section 7(1): Public Information Officer shall provide information within thirty days of receipt of request',
      'Section 7(1) Proviso: Where information concerns life or liberty of a person, it shall be provided within forty-eight hours'
    ],
    definitions: [
      {
        term: 'Information',
        meaning: 'Any material in any form, including records, documents, memos, emails, opinions, advices, press releases, circulars, orders, logbooks, contracts, reports, papers, samples, models, and electronic data.'
      },
      {
        term: 'Public Authority',
        meaning: 'Any authority, body, or institution of self-government established by the Constitution, parliamentary statute, state law, or funded directly or indirectly by government funds.'
      },
      {
        term: 'Public Information Officer (PIO)',
        meaning: 'An officer designated by a public authority to process information requests and provide disclosures to citizens under the Act.'
      }
    ],
    offences: [
      'Government officer refusing to receive an RTI application without reasonable cause',
      'Failing to furnish information within the mandatory 30-day timeline (or 48 hours for life/liberty matters)',
      'Knowingly giving false, incomplete, or misleading information, or destroying records',
      'Obstructing in any manner the inspection of public works or official documents'
    ],
    actions_covered: [
      'Government officer refusing to receive an RTI application without reasonable cause',
      'Failing to furnish information within the mandatory 30-day timeline (or 48 hours for life/liberty matters)',
      'Knowingly giving false, incomplete, or misleading information, or destroying records'
    ],
    penalties_fines: 'Personal penalty on PIO of ₹250 per day of delay up to a maximum of ₹25,000 under Section 20, deducted directly from the officer\'s salary; disciplinary proceedings recommendation.',
    punishment: 'Information Commission imposes personal penalty of ₹250 each day of delay (up to maximum ₹25,000) on the Public Information Officer (PIO), deducted directly from salary.',
    fine: '₹250 per day of delay up to maximum ₹25,000 directly from officer\'s personal salary',
    imprisonment: 'Departmental inquiry and disciplinary action recommended under relevant Civil Services Rules.',
    consequences: [
      'Information Commission order directing immediate disclosure and inspection of records free of cost',
      'Award of monetary compensation to applicant for loss or detriment suffered under Section 19(8)(b)',
      'Adverse entry recorded in the Annual Confidential Report (ACR) of the defaulting civil servant',
      'Mandatory proactive electronic disclosure enforced under Section 4(1)(b)'
    ],
    other_consequences: 'Compensation awarded to the applicant for any detriment suffered under Section 19(8)(b); departmental disciplinary proceedings recommended.',
    exceptions: [
      'Exemptions under Section 8: Information prejudicing national sovereignty, military security, scientific interests, cabinet papers prior to decision, or personal privacy lacking public interest',
      'Intelligence and security organizations specified in the Second Schedule (IB, RAW, CBI) except on allegations of corruption and human rights violations'
    ],
    amendments: [
      'Right to Information (Amendment) Act, 2019: Amended tenure and service terms of Central and State Information Commissioners',
      'Digital Personal Data Protection Act, 2023: Harmonized Section 8(1)(j) to safeguard personal data of individuals from unauthorized disclosure'
    ],
    related_laws: [
      'Right to Information Act, 2005 - Section 8 (Exemptions from disclosure)',
      'Right to Information Act, 2005 - Section 20 (Penalties on errant PIOs)',
      'Constitution of India - Article 19(1)(a) (Freedom of speech and expression)',
      'Digital Personal Data Protection Act, 2023'
    ],
    current_status: 'In Force (Active - Enforced nationwide with online RTI portals across Union ministries and State governments)',
    category_id: 'government-public-administration',
    official_text: 'A person, who desires to obtain any information under this Act, shall make a request in writing or through electronic means... The Central Public Information Officer or State Public Information Officer... shall either provide the information on payment of such fee as may be prescribed or reject the request for any of the reasons specified in sections 8 and 9, within thirty days.',
    what_it_means: 'Any citizen can file an RTI with just a ₹10 fee. If the information requested concerns life or personal liberty, it must be provided within 48 hours. No citizen is required to state the reason why they are seeking the information.',
    is_bailable: true,
    is_cognizable: false,
    court_triable: 'Central Information Commission (CIC) / State Information Commission (SIC)',
    related_sections: [
      { section_number: 'Section 8', act_name: 'RTI Act, 2005', title: 'Exemption from disclosure of information' },
      { section_number: 'Section 20', act_name: 'RTI Act, 2005', title: 'Penalties on Public Information Officers' }
    ],
    related_acts: ['Official Secrets Act, 1923', 'Digital Personal Data Protection Act, 2023'],
    effective_date: '12 October 2005',
    source: 'Department of Personnel and Training (DoPT), Govt of India (rtionline.gov.in)',
    source_url: 'https://rtionline.gov.in/',
    last_updated: '2024-02-01',
    keywords: ['rti act', 'right to information', 'section 6', '30 days reply', 'public information officer', 'citizen rights', 'transparency'],
    state_applicability: 'All India',
    target_audience: ['General Citizens', 'Students', 'Working Professional'],
    featured: true,
    view_count: 17200
  },

  // 3. Environmental Law: Environment (Protection) Act, 1986 (Section 15)
  {
    id: 'epa-sec-15',
    official_name: 'Environment (Protection) Act, 1986',
    act_name: 'Environment (Protection) Act, 1986',
    short_act: 'Environment Protection Act',
    short_description: 'Imposes criminal penalties, imprisonment up to 7 years, and daily recurring fines on industrial units or persons discharging dangerous pollutants.',
    simple_explanation: 'Makes it a serious criminal offence for factories, real estate projects, or individuals to dump hazardous chemicals, discharge untreated toxic waste into water bodies, or exceed air pollution caps.',
    year_enacted: 1986,
    sections: 'Section 15',
    section_number: 'Section 15',
    section_title: 'Penalty for Contravention of the Provisions of the Act and Rules, Orders and Directions',
    sub_sections: [
      'Operative Clause: Whoever fails to comply with or contravenes any provisions of the Act, rules, orders, or directions',
      'Base Penal Scale: Imprisonment for a term which may extend to five years with fine up to one lakh rupees, or with both',
      'Continuing Failure: Additional fine up to five thousand rupees for every day during which failure continues after first conviction',
      'Extended Penalty Proviso: If failure continues beyond one year after conviction, imprisonment may extend to seven years'
    ],
    definitions: [
      {
        term: 'Environmental Pollutant',
        meaning: 'Any solid, liquid, or gaseous substance present in such concentration as may be, or tend to be, injurious to environment.'
      },
      {
        term: 'Hazardous Substance',
        meaning: 'Any substance or preparation which, by reason of its chemical or physico-chemical properties, is liable to cause harm to human beings, living creatures, plants, property, or the environment.'
      },
      {
        term: 'National Green Tribunal (NGT)',
        meaning: 'The specialized judicial body established under the NGT Act, 2010 for effective and expeditious disposal of environmental protection cases.'
      }
    ],
    offences: [
      'Discharging untreated chemical effluent or industrial sewage into lakes, rivers, or storm drains',
      'Emitting hazardous toxic gases or particulate matter exceeding National Ambient Air Quality Standards',
      'Operating industrial or mining units without statutory Environmental Clearance (EC)',
      'Dumping bio-medical waste, electronic scrap, or untreated plastics in eco-sensitive zones'
    ],
    actions_covered: [
      'Discharging untreated chemical effluent or industrial sewage into lakes, rivers, or storm drains',
      'Emitting hazardous toxic gases exceeding National Ambient Air Quality Standards',
      'Operating industrial or mining units without statutory Environmental Clearance (EC)',
      'Dumping bio-medical waste or untreated plastic in eco-sensitive zones'
    ],
    penalties_fines: 'Imprisonment up to 5 years (extendable up to 7 years for prolonged defaults) and fine up to ₹1,00,000 plus ₹5,000 per day; NGT regularly awards multi-crore environmental restitution damages.',
    punishment: 'Imprisonment for a term up to 5 years with fine up to ₹1 Lakh, or both. If failure continues beyond 1 year after conviction, imprisonment extends up to 7 years.',
    fine: 'Up to ₹1,00,000, plus additional ₹5,000 for every day the violation continues; NGT routinely imposes multi-crore environmental damages',
    imprisonment: 'Up to 5 years (can extend to 7 years)',
    consequences: [
      'Immediate closure, prohibition, or regulation of any industry, operation, or process under Section 5',
      'Disconnection of electricity, water supply, and municipal services to the offending factory',
      'Application of the judicial "Polluter Pays Principle" requiring full monetary restoration of ecology',
      'Criminal prosecution of company managing directors and board members under Section 16'
    ],
    other_consequences: 'Immediate closure of factory/industrial plant under Section 5; disconnection of electricity and water supply; "Polluter Pays" environmental damages.',
    exceptions: [
      'Actions performed in good faith during disaster management under direct supervision of Central Government authorities',
      'Compliance with valid temporary discharge permits granted during trial commissioning of zero-liquid discharge (ZLD) plants'
    ],
    amendments: [
      'National Green Tribunal Act, 2010: Vested specialized original and appellate environmental jurisdiction with NGT benches',
      'Jan Vishwas (Amendment of Provisions) Act, 2023: Introduced civil penalty adjudicatory mechanism for minor procedural defaults while retaining severe penal sanctions for active contamination'
    ],
    related_laws: [
      'National Green Tribunal Act, 2010 - Section 15 & 24',
      'Water (Prevention and Control of Pollution) Act, 1974',
      'Air (Prevention and Control of Pollution) Act, 1981',
      'Constitution of India - Article 48A & 51A(g)'
    ],
    current_status: 'In Force (Active - Enforced by Central Pollution Control Board (CPCB), State PCBs, and National Green Tribunal)',
    category_id: 'environmental-law',
    official_text: 'Whoever fails to comply with or contravenes any of the provisions of this Act, or the rules made or orders or directions issued thereunder, shall, in respect of each such failure or contravention, be punishable with imprisonment for a term which may extend to five years with fine which may extend to one lakh rupees, or with both.',
    what_it_means: 'The Environment (Protection) Act serves as an umbrella legislation. The Central Government and State Pollution Control Boards (SPCBs) have powers to enter, inspect, take samples, and directly order the closure of any polluting industry without civil court delay.',
    is_bailable: true,
    is_cognizable: true,
    court_triable: 'National Green Tribunal (NGT) / Court of Session',
    related_sections: [
      { section_number: 'Section 5', act_name: 'Environment (Protection) Act, 1986', title: 'Power to give directions (Closure/disconnection)' },
      { section_number: 'Section 16', act_name: 'Environment (Protection) Act, 1986', title: 'Offences by companies (Director liability)' }
    ],
    related_acts: ['National Green Tribunal Act, 2010', 'Water Act, 1974', 'Air Act, 1981'],
    effective_date: '19 November 1986',
    source: 'Ministry of Environment, Forest and Climate Change (MoEFCC), Govt of India / India Code',
    source_url: 'https://moef.gov.in/',
    last_updated: '2023-12-05',
    keywords: ['environment act', 'pollution fine', 'ngt', 'chemical discharge', 'section 15', 'industrial waste', 'air pollution', 'cpcb'],
    state_applicability: 'All India',
    target_audience: ['Business Owners', 'General Citizens', 'Working Professional'],
    view_count: 8100
  },

  // 4. Education & Child Welfare: Right to Education Act, 2009 (Section 12(1)(c))
  {
    id: 'rte-sec-12',
    official_name: 'Right of Children to Free and Compulsory Education Act, 2009',
    act_name: 'Right of Children to Free and Compulsory Education Act, 2009',
    short_act: 'RTE Act, 2009',
    short_description: 'Mandates that every private unaided school must reserve at least 25% entry-level seats for economically weaker sections (EWS) and disadvantaged groups with completely free education.',
    simple_explanation: 'Requires all private schools to reserve at least 25% of their kindergarten/Class 1 seats for children from poor families (Economically Weaker Sections - EWS) and disadvantaged groups, providing completely free education.',
    year_enacted: 2009,
    sections: 'Section 12(1)(c)',
    section_number: 'Section 12(1)(c)',
    section_title: '25% Mandatory Free Quota in Private Unaided Schools for EWS & Disadvantaged Groups',
    sub_sections: [
      'Section 12(1)(c): A private unaided school shall admit in class I (or pre-primary), to the extent of at least 25% of the strength of that class, children belonging to weaker section and disadvantaged group in neighbourhood and provide free education',
      'Section 12(2): Government reimbursement of per-child expenditure to private unaided schools for providing free seats',
      'Section 13: Prohibition of capitation fees and screening procedures for children and parents',
      'Section 17: Absolute prohibition of physical punishment and mental harassment to children'
    ],
    definitions: [
      {
        term: 'Child Belonging to Weaker Section',
        meaning: 'A child whose parent or guardian has an annual income lower than the minimum limit specified by the appropriate government notification.'
      },
      {
        term: 'Child Belonging to Disadvantaged Group',
        meaning: 'A child belonging to the Scheduled Caste, Scheduled Tribe, socially and educationally backward class, or child with disabilities.'
      },
      {
        term: 'Capitation Fee',
        meaning: 'Any kind of donation or contribution or payment, by whatever name called, other than the fee notified by the school.'
      }
    ],
    offences: [
      'Private school refusing admission to eligible EWS neighborhood children under 25% quota',
      'Demanding capitation fee, donations, or hidden deposits from parents during admissions',
      'Subjecting a 3-5 year old child or parents to screening interviews or entrance tests',
      'Subjecting children to corporal punishment, physical beating, or mental harassment'
    ],
    actions_covered: [
      'Private school refusing admission to eligible EWS neighborhood children under 25% quota',
      'Demanding capitation fee, donations, or building funds from parents during admissions',
      'Subjecting a 3-5 year old child or parents to screening interviews or entrance tests',
      'Subjecting children to corporal punishment or mental harassment'
    ],
    penalties_fines: 'Capitation fee violation: Fine up to ten times (10x) the capitation fee charged. Screening test violation: ₹25,000 for first contravention, ₹50,000 for each subsequent contravention. Corporal punishment: Disciplinary service action.',
    punishment: 'School demanding capitation fee fined up to 10 times the amount charged. Conducting screening interviews fined up to ₹25,000 (first time) and ₹50,000 (subsequent). Corporal punishment invites service dismissal and JJ Act prosecution.',
    fine: 'Up to 10x capitation fee charged; ₹25,000 to ₹50,000 for screening tests',
    imprisonment: 'Criminal prosecution under Juvenile Justice Act, 2015 for corporal punishment or cruelty to children.',
    consequences: [
      'Derecognition and cancellation of school affiliation by State Education Department',
      'Compulsory refund of illegally collected capitation fees with interest',
      'Inquiry and summons issued by National/State Commission for Protection of Child Rights (NCPCR/SCPCR)',
      'Criminal prosecution under Juvenile Justice Act, 2015 for any child abuse'
    ],
    other_consequences: 'Cancellation of school recognition by State Education Department; refund of collected fees.',
    exceptions: [
      'Unaided minority educational institutions protected under Article 30(1) of the Constitution (exempted by Supreme Court in Pramati Educational Trust case)',
      'Higher secondary education beyond Class VIII (Act applies to elementary education for children aged 6 to 14 years)'
    ],
    amendments: [
      'Society for Unaided Private Schools v. Union of India (2012) Supreme Court: Upheld the constitutional validity of Section 12(1)(c) mandating 25% quota',
      'Right of Children to Free and Compulsory Education (Amendment) Act, 2019: Amended Section 16 regarding detention in Class 5 and Class 8'
    ],
    related_laws: [
      'Constitution of India - Article 21A (Fundamental Right to Education)',
      'Juvenile Justice (Care and Protection of Children) Act, 2015',
      'Commissions for Protection of Child Rights Act, 2005'
    ],
    current_status: 'In Force (Active - Enforced by State Education Departments and Child Rights Commissions nationwide)',
    category_id: 'education-law',
    official_text: 'A school specified in sub-clause (iv) of clause (n) of section 2 shall admit in class I, to the extent of at least twenty-five per cent of the strength of that class, children belonging to weaker section and disadvantaged group in the neighbourhood and provide free and compulsory elementary education till its completion.',
    what_it_means: 'Under Section 12(1)(c), private unaided schools must admit at least 25% children from EWS/disadvantaged categories without charging any tuition, admission, or book fees. The State Government reimburses schools per child at government school rates.',
    is_bailable: true,
    is_cognizable: false,
    court_triable: 'State Child Rights Commission (SCPCR) / District Education Officer (DEO)',
    related_sections: [
      { section_number: 'Section 13', act_name: 'RTE Act, 2009', title: 'No capitation fee and screening procedure for admission' },
      { section_number: 'Section 17', act_name: 'RTE Act, 2009', title: 'Prohibition of physical punishment and mental harassment' }
    ],
    related_acts: ['Juvenile Justice Act, 2015', 'Constitution of India - Article 21A'],
    effective_date: '1 April 2010',
    source: 'Department of School Education & Literacy, Ministry of Education, Govt of India (dsel.education.gov.in)',
    source_url: 'https://dsel.education.gov.in/rte',
    last_updated: '2023-09-01',
    keywords: ['rte act', 'section 12 1 c', 'ews school admission', 'free education', 'capitation fee', 'corporal punishment', 'child rights'],
    state_applicability: 'All India',
    target_audience: ['General Citizens', 'Students', 'Consumers'],
    featured: true,
    view_count: 10400
  },

  // 5. Health & Pharmaceutical Law: Drugs and Cosmetics Act, 1940 (Section 27)
  {
    id: 'drugs-act-sec-27',
    official_name: 'Drugs and Cosmetics Act, 1940',
    act_name: 'Drugs and Cosmetics Act, 1940',
    short_act: 'Drugs and Cosmetics Act',
    short_description: 'Imposes life imprisonment and statutory fines for manufacturing, selling, or distributing counterfeit, adulterated, or spurious drugs likely to cause death.',
    simple_explanation: 'Imposes life imprisonment and massive fines on anyone manufacturing, stocking, or selling counterfeit medicines, adulterated drugs, or spurious pediatric syrups that endanger human lives.',
    year_enacted: 1940,
    sections: 'Section 27',
    section_number: 'Section 27',
    section_title: 'Penalty for Manufacture, Sale, etc., of Spurious or Adulterated Drugs in Contravention of Chapter',
    sub_sections: [
      'Section 27(a): Spurious or adulterated drug likely to cause death or grievous hurt - Imprisonment not less than ten years extending to imprisonment for life, and fine not less than ten lakh rupees or three times the value of drugs',
      'Section 27(b): Any drug without valid license - Imprisonment not less than three years extending to five years and fine not less than one lakh rupees',
      'Section 27(c): Other adulterated drugs - Imprisonment not less than one year extending to three years and fine not less than twenty thousand rupees',
      'Section 27(d): Other contraventions - Imprisonment not less than one year extending to two years and fine'
    ],
    definitions: [
      {
        term: 'Spurious Drug',
        meaning: 'A drug manufactured under a name belonging to another drug, or an imitation of another drug, or if the label bears the name of a fictitious manufacturer (counterfeit).'
      },
      {
        term: 'Adulterated Drug',
        meaning: 'A drug consisting in whole or in part of any filthy, putrid, or decomposed substance, or prepared in insanitary conditions rendering it injurious to health.'
      },
      {
        term: 'Central Drugs Standard Control Organization (CDSCO)',
        meaning: 'The national regulatory body for Indian pharmaceuticals and medical devices headed by the Drugs Controller General of India (DCGI).'
      }
    ],
    offences: [
      'Manufacturing fake antibiotics, spurious pediatric syrups, or counterfeit emergency medical injections',
      'Selling expired medicines with relabeled expiry dates',
      'Operating unlicensed pharmaceutical compounding units producing bulk fake APIs',
      'Dispensing habit-forming Schedule H or Schedule X drugs without a valid doctor\'s prescription'
    ],
    actions_covered: [
      'Manufacturing fake antibiotics, cough syrups, or counterfeit vaccines',
      'Selling expired medicines with relabeled dates',
      'Operating unlicensed pharmaceutical manufacturing units',
      'Dispensing habit-forming Schedule H/X drugs without a valid doctor\'s prescription'
    ],
    penalties_fines: 'For spurious/adulterated drugs causing death or grievous hurt: Imprisonment from 10 years up to Life Imprisonment, and mandatory fine not less than ₹10,00,000 (Ten Lakh Rupees) or three times the value of the drugs confiscated.',
    punishment: 'For spurious/adulterated drugs causing death or grievous hurt: Imprisonment not less than 10 years extending to Life Imprisonment, and mandatory fine not less than ₹10 Lakhs.',
    fine: 'Not less than ₹10,00,000 or 3 times the value of drugs confiscated, whichever is more',
    imprisonment: '10 years to Life Imprisonment (non-bailable)',
    consequences: [
      'Immediate cancellation of manufacturing license, product approval, and pharmacy retail license',
      'Confiscation and sealing of pharmaceutical factories, packaging plants, and transport vehicles under Section 31',
      'Payment of collected fines directly as financial compensation to victims or their bereaved families',
      'Publication of names and convictions of offenders in the Official Gazette and leading national newspapers'
    ],
    other_consequences: 'Immediate cancellation of manufacturing/pharmacy license; factory sealing; fine collected is paid as compensation to victims.',
    exceptions: [
      'Licensed retail chemists who purchased drugs from a licensed manufacturer under a written warranty in Form 24 and stored them strictly according to prescribed cold chain conditions without tampering (Section 19 defense)',
      'Ayurvedic, Siddha, and Unani traditional formulations governed under separate Chapter IV-A provisions'
    ],
    amendments: [
      'Drugs and Cosmetics (Amendment) Act, 2008 (Act 26 of 2008): Substituted Section 27 to introduce mandatory Life Imprisonment and ₹10 Lakhs minimum fine for spurious drug manufacturers',
      'Medical Devices Rules, 2017 & New Drugs and Clinical Trials Rules, 2019: Brought modern medical devices, implants, and clinical testing under stringent regulatory oversight'
    ],
    related_laws: [
      'Drugs and Cosmetics Act, 1940 - Section 17B (Spurious drugs defined)',
      'Drugs and Cosmetics Act, 1940 - Section 19 (Pleas and statutory defenses)',
      'Bharatiya Nyaya Sanhita, 2023 - Section 276 (Adulteration of drugs) & Section 105',
      'Pharmacy Act, 1948'
    ],
    current_status: 'In Force (Active - Strictly enforced by DCGI, CDSCO, and State Drug Control Administrations)',
    category_id: 'health-medical-law',
    official_text: 'Whoever, himself or by any other person on his behalf, manufactures for sale or for distribution, or sells, or stocks or exhibits or offers for sale or distributes any drug deemed to be adulterated... or spurious... which is likely to cause death or grievous hurt... shall be punishable with imprisonment for a term which shall not be less than ten years but which may extend to imprisonment for life and shall also be liable to fine which shall not be less than ten lakh rupees.',
    what_it_means: 'Amended in 2008, Section 27 is one of the strictest pharmaceutical anti-counterfeit statutes globally. Drug Inspectors can conduct surprise raids, seize entire production batches, and initiate non-bailable criminal proceedings in Special Sessions Courts.',
    is_bailable: false,
    is_cognizable: true,
    court_triable: 'Special Court / Court of Session',
    related_sections: [
      { section_number: 'Section 17B', act_name: 'Drugs and Cosmetics Act, 1940', title: 'Spurious drugs defined' },
      { section_number: 'Section 18', act_name: 'Drugs and Cosmetics Act, 1940', title: 'Prohibition of manufacture and sale of certain drugs' }
    ],
    related_acts: ['Bharatiya Nyaya Sanhita, 2023', 'Pharmacy Act, 1948'],
    effective_date: '10 August 2009 (2008 Amendment enhancing penalties)',
    source: 'Central Drugs Standard Control Organization (CDSCO), Ministry of Health & Family Welfare, Govt of India (cdsco.gov.in)',
    source_url: 'https://cdsco.gov.in/',
    last_updated: '2023-10-15',
    keywords: ['drugs act', 'spurious medicines', 'fake drugs', 'section 27', 'pharmacy license', 'cdsco', 'counterfeit medicine'],
    state_applicability: 'All India',
    target_audience: ['Consumers', 'General Citizens', 'Business Owners'],
    featured: true,
    view_count: 7300
  },

  // 6. Human Rights & Civil Liberties: Protection of Human Rights Act, 1993 (Section 12 & 30)
  {
    id: 'phra-sec-12',
    official_name: 'Protection of Human Rights Act, 1993',
    act_name: 'Protection of Human Rights Act, 1993',
    short_act: 'Human Rights Act',
    short_description: 'Empowers the National Human Rights Commission (NHRC) and State Commissions to investigate custodial violence, torture, police excess, and state negligence.',
    simple_explanation: 'Empowers the National Human Rights Commission (NHRC) and State Human Rights Commissions to investigate custodial violence, torture, police brutality, encounter killings, and human rights violations.',
    year_enacted: 1993,
    sections: 'Sections 12 & 30',
    section_number: 'Section 12 & 30',
    section_title: 'Functions of the Commission & Human Rights Courts in Every District',
    sub_sections: [
      'Section 12(a): Inquire, suo motu or on petition presented by a victim, into complaints of violation of human rights or abetment thereof, or negligence by a public servant',
      'Section 12(c): Visit any jail or other institution under control of State Government to study living conditions of inmates and make recommendations',
      'Section 18: Steps after inquiry, including recommending interim monetary relief to victim and initiation of criminal prosecution against guilty public servants',
      'Section 30: State Government may, with concurrence of Chief Justice of High Court, specify for each district a Court of Session to be a Human Rights Court'
    ],
    definitions: [
      {
        term: 'Human Rights',
        meaning: 'The rights relating to life, liberty, equality, and dignity of the individual guaranteed by the Constitution or embodied in International Covenants and enforceable by courts in India.'
      },
      {
        term: 'National Human Rights Commission (NHRC)',
        meaning: 'The autonomous statutory commission established under Section 3 headed by a former Chief Justice of India or Judge of the Supreme Court.'
      },
      {
        term: 'Custodial Death',
        meaning: 'Death of a person occurring while in police custody, judicial lock-up, prison, or hospital while under detention.'
      }
    ],
    offences: [
      'Police custodial torture, illegal physical beatings, or death of undertrials in police custody',
      'Staging fake extrajudicial encounter killings by law enforcement personnel',
      'Failing to report a custodial death or rape to the NHRC within the mandatory 24 hours',
      'Subjecting prisoners to bonded labor, inhuman manual scavenging, or degrading conditions'
    ],
    actions_covered: [
      'Police custodial torture, illegal physical beatings, or death of undertrials in custody',
      'Staged extrajudicial encounter killings by law enforcement officers',
      'Failure by authorities to report custodial deaths to NHRC within 24 hours',
      'Subjecting prisoners or citizens to bonded labor or inhuman manual scavenging'
    ],
    penalties_fines: 'Commission issues binding recommendations directing Central/State Governments to pay interim monetary compensation to victim families (typically ₹5 Lakhs to ₹25 Lakhs per victim), and register criminal FIRs.',
    punishment: 'Commission issues binding recommendations directing Central/State Governments to pay interim monetary compensation to victim families (typically ₹5 Lakhs to ₹25 Lakhs per victim), register criminal FIRs, and initiate departmental prosecution against police officers.',
    fine: 'State Governments mandated to pay interim relief compensation running into several lakhs per victim',
    imprisonment: 'Criminal trial of guilty police/prison officers before Special Human Rights Courts under Section 30.',
    consequences: [
      'Mandatory 24-hour reporting of any custodial death, followed by mandatory magisterial inquest and videographed post-mortem',
      'Initiation of departmental inquiry and criminal prosecution against errant police and prison officers',
      'Establishment of fast-track Special Human Rights Courts in every district under Section 30',
      'Suo motu inspection and surprise audits of mental health institutions, juvenile homes, and prisons'
    ],
    other_consequences: 'Mandatory magisterial inquest and videographed post-mortem examination in every custodial death case.',
    exceptions: [
      'Bar of jurisdiction under Section 36(1): Commission shall not inquire into any matter pending before any other statutory Commission (e.g., NCW, NCSC, NCST)',
      'Limitation period under Section 36(2): Commission shall not inquire into any complaint after the expiry of one year from the date on which the incident is alleged to have taken place'
    ],
    amendments: [
      'Protection of Human Rights (Amendment) Act, 2019: Broadened eligibility criteria for NHRC Chairperson to include any former Supreme Court Judge; increased members and harmonized tenures',
      'NHRC Guidelines on Custodial Violence: Mandated Magisterial Inquest within 24 hours and DNA profiling in custodial deaths'
    ],
    related_laws: [
      'Constitution of India - Article 21 (Right to life and personal liberty)',
      'Bharatiya Nagarik Suraksha Sanhita, 2023 - Section 196 (Inquiry into custodial death)',
      'Protection of Human Rights Act, 1993 - Section 30 (Human Rights Courts)',
      'Commissions of Inquiry Act, 1952'
    ],
    current_status: 'In Force (Active - Enforced by NHRC and State Human Rights Commissions with nationwide statutory jurisdiction)',
    category_id: 'human-rights-law',
    official_text: 'The Commission shall perform all or any of the following functions, namely: (a) inquire, suo motu or on a petition presented to it by a victim or any person on his behalf, into complaint of: (i) violation of human rights or abetment thereof; or (ii) negligence in the prevention of such violation, by a public servant... (c) visit... any jail or other institution.',
    what_it_means: 'The NHRC has the civil powers of a court to summon witnesses, discover documents, and requisition public records. Crucially, in any custodial death or custodial rape, police must notify the Commission within 24 hours, failing which foul play is presumed.',
    is_bailable: true,
    is_cognizable: true,
    court_triable: 'Special Human Rights Court / High Court',
    related_sections: [
      { section_number: 'Section 18', act_name: 'Protection of Human Rights Act, 1993', title: 'Steps during and after inquiry (Compensation & prosecution)' },
      { section_number: 'Section 30', act_name: 'Protection of Human Rights Act, 1993', title: 'Human Rights Courts in each District' }
    ],
    related_acts: ['Constitution of India', 'Bharatiya Nagarik Suraksha Sanhita, 2023'],
    effective_date: '8 January 1994 (Deemed effective from 28 September 1993)',
    source: 'National Human Rights Commission (NHRC), Government of India (nhrc.nic.in)',
    source_url: 'https://nhrc.nic.in/',
    last_updated: '2023-11-20',
    keywords: ['human rights', 'nhrc', 'custodial death', 'police brutality', 'section 12', 'human rights courts', 'torture'],
    state_applicability: 'All India',
    target_audience: ['General Citizens', 'Law Student / Advocate'],
    featured: true,
    view_count: 6700
  }
];
