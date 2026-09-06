import { LawItem, LegalUpdateHistory } from '../types';

export const LAWS_DATABASE: LawItem[] = [
  // 1. Cyber Law: Section 66D IT Act
  {
    id: 'it-act-sec-66d',
    act_name: 'Information Technology Act, 2000',
    short_act: 'IT Act, 2000',
    section_number: 'Section 66D',
    section_title: 'Punishment for Cheating by Personation by Using Computer Resource',
    category_id: 'cyber-law-it',
    simple_explanation: 'This law punishes anyone who deceives or cheats another person online by pretending to be someone else using a mobile phone, computer, or the internet (such as fake profiles, phishing emails, OTP theft, or fraudulent customer care numbers).',
    official_text: 'Whoever, by means for any communication device or computer resource cheats by personating, shall be punished with imprisonment of either description for a term which may extend to three years and shall also be liable to fine which may extend to one lakh rupees.',
    what_it_means: 'Online impersonation for fraud is a distinct statutory offence under Indian Cyber Law. If someone creates a fake bank executive account, uses a cloned social media profile, or sends spoofed messages to obtain money or sensitive credentials, they commit an offence under Section 66D.',
    actions_covered: [
      'Pretending to be bank staff to steal OTPs or net-banking passwords',
      'Creating fake matrimonial or job recruitment profiles to extract money',
      'Using spoofed caller IDs or domain names to cheat victims (Phishing)',
      'Impersonating public servants or law enforcement officers in digital extortion scams'
    ],
    punishment: 'Imprisonment of either description for up to 3 years',
    fine: 'Fine up to ₹1,00,000 (One Lakh Rupees)',
    imprisonment: 'Up to 3 years',
    other_consequences: 'Confiscation of digital devices used in the offence under Section 76 of IT Act; police seizure of linked bank accounts and domain names.',
    is_bailable: false,
    is_cognizable: true,
    court_triable: 'Any Magistrate / Chief Judicial Magistrate',
    exceptions: [
      'Legitimate parody or satire without dishonest intent to cause wrongful loss or gain',
      'Good faith authorized testing by registered security researchers with prior written consent'
    ],
    related_sections: [
      { section_number: 'Section 43', act_name: 'IT Act, 2000', title: 'Penalty for damage to computer system' },
      { section_number: 'Section 66C', act_name: 'IT Act, 2000', title: 'Punishment for identity theft' },
      { section_number: 'Section 318', act_name: 'Bharatiya Nyaya Sanhita, 2023', title: 'Cheating (Earlier Section 420 IPC)' }
    ],
    related_acts: ['Bharatiya Nyaya Sanhita, 2023', 'Bharatiya Nagarik Suraksha Sanhita, 2023'],
    effective_date: '27 October 2009 (via Information Technology Amendment Act, 2008)',
    source: 'Government of India, Ministry of Electronics & IT / India Code (indiacode.nic.in)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/1999',
    last_updated: '2024-07-01',
    is_recently_updated: true,
    update_notes: 'Procedural coordination harmonized with Bharatiya Nagarik Suraksha Sanhita (BNSS 2023) electronic evidence mandates.',
    keywords: ['cyber crime', 'phishing', 'otp fraud', 'online scam', 'impersonation', 'section 66', 'hacking', 'internet cheating'],
    state_applicability: 'All India',
    target_audience: ['General Citizens', 'Tech Users', 'Students', 'Consumers'],
    featured: true,
    view_count: 14200
  },

  // 2. Cyber Law: Section 66 IT Act
  {
    id: 'it-act-sec-66',
    act_name: 'Information Technology Act, 2000',
    short_act: 'IT Act, 2000',
    section_number: 'Section 66',
    section_title: 'Computer Related Offences (Hacking, Unauthorized Access & Data Tampering)',
    category_id: 'cyber-law-it',
    simple_explanation: 'If anyone dishonestly or fraudulently accesses, alters, deletes, or damages another person\'s computer, website, phone data, or network without permission, they are guilty of computer-related crime.',
    official_text: 'If any person, dishonestly or fraudulently, does any act referred to in section 43, he shall be punishable with imprisonment for a term which may extend to three years or with fine which may extend to five lakh rupees or with both.',
    what_it_means: 'Section 66 criminalizes civil violations listed in Section 43 when done with dishonest or fraudulent intent. This covers unauthorized digital entry, introducing malware or ransomware, extracting source code, and denying services to authorized users.',
    actions_covered: [
      'Unauthorized access into email, social media, or company server accounts',
      'Injecting ransomware, viruses, or spyware into computers',
      'Defacing websites or deleting institutional databases',
      'Denial of Service (DoS) attacks targeting public or private infrastructure'
    ],
    punishment: 'Imprisonment up to 3 years, or fine, or both',
    fine: 'Fine up to ₹5,00,000 (Five Lakh Rupees)',
    imprisonment: 'Up to 3 years',
    other_consequences: 'Civil compensation damages up to ₹5 Crores under Section 43 adjudication before State IT Secretary.',
    is_bailable: true,
    is_cognizable: true,
    court_triable: 'Metropolitan Magistrate or Judicial Magistrate First Class',
    exceptions: [
      'Authorized cybersecurity audit with valid contractual agreement',
      'Emergency intervention by national cybersecurity nodal agency (CERT-In) under Section 70B'
    ],
    related_sections: [
      { section_number: 'Section 43', act_name: 'IT Act, 2000', title: 'Civil liability for unauthorized access' },
      { section_number: 'Section 66F', act_name: 'IT Act, 2000', title: 'Punishment for cyber terrorism' }
    ],
    related_acts: ['Digital Personal Data Protection Act, 2023'],
    effective_date: '27 October 2009',
    source: 'Ministry of Electronics & Information Technology, Government of India',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/1999',
    last_updated: '2024-07-01',
    keywords: ['hacking', 'unauthorized access', 'virus', 'ransomware', 'cyber attack', 'section 66', 'data theft'],
    state_applicability: 'All India',
    target_audience: ['Tech Users', 'Business Owners', 'Students', 'General Citizens'],
    featured: true,
    view_count: 12500
  },

  // 3. Motor Vehicle: Section 185 Motor Vehicles Act
  {
    id: 'mva-sec-185',
    act_name: 'Motor Vehicles Act, 1988 (Amended 2019)',
    short_act: 'Motor Vehicles Act',
    section_number: 'Section 185',
    section_title: 'Driving by a Drunken Person or by a Person Under the Influence of Drugs',
    category_id: 'motor-vehicle-traffic-law',
    simple_explanation: 'Prohibits driving or attempting to drive any motor vehicle if your blood alcohol level exceeds 30 mg per 100 ml of blood detected by a breath analyser test, or while under the influence of narcotics.',
    official_text: 'Whoever, while driving, or attempting to drive, a motor vehicle has, in his blood, alcohol exceeding 30 mg. per 100 ml. of blood detected in a test by a breath analyser, or in any other test including a laboratory test, or is under the influence of a drug to such an extent as to be incapable of exercising proper control over the vehicle, shall be punishable.',
    what_it_means: 'Drunk driving is a serious criminal offence endangering public road users. Police have legal power to stop drivers, conduct breathalyser testing on the spot, and impound vehicles if alcohol threshold is breached.',
    actions_covered: [
      'Operating a two-wheeler, four-wheeler, or commercial transport while intoxicated',
      'Attempting to drive or sitting in the driver seat with the engine running while intoxicated',
      'Driving under the influence of illegal narcotics or psychotropic substances'
    ],
    punishment: 'First offence: Imprisonment up to 6 months and/or fine. Second or subsequent offence within 3 years: Imprisonment up to 2 years and/or fine.',
    fine: 'First offence: ₹10,000. Second offence: ₹15,000.',
    imprisonment: 'Up to 6 months (1st offence); up to 2 years (subsequent offence within 3 years)',
    other_consequences: 'Immediate suspension of driving license for at least 3 months; mandatory entry in national Vahan/Sarathi portal; vehicle impounding.',
    is_bailable: true,
    is_cognizable: true,
    court_triable: 'Judicial Magistrate / Special Traffic Mobile Court',
    exceptions: [
      'Prescribed medication taken strictly under registered medical supervision, provided it does not impair motor faculties (requires valid medical prescription at time of check)'
    ],
    related_sections: [
      { section_number: 'Section 203', act_name: 'Motor Vehicles Act, 1988', title: 'Breath tests' },
      { section_number: 'Section 204', act_name: 'Motor Vehicles Act, 1988', title: 'Laboratory medical test' },
      { section_number: 'Section 106', act_name: 'Bharatiya Nyaya Sanhita, 2023', title: 'Causing death by negligence' }
    ],
    related_acts: ['Telangana Motor Vehicles Rules, 1989', 'Bharatiya Nyaya Sanhita, 2023'],
    effective_date: '1 September 2019 (Enhanced penalties via Motor Vehicles Amendment Act, 2019)',
    source: 'Ministry of Road Transport and Highways (MoRTH), Government of India',
    source_url: 'https://morth.nic.in/motor-vehicles-amendment-act-2019',
    last_updated: '2024-06-15',
    keywords: ['drunk driving', 'alcohol test', 'traffic fine', 'breathalyzer', 'section 185', 'mva penalty', 'license suspension'],
    state_applicability: 'All India',
    target_audience: ['Drivers / Commuters', 'General Citizens'],
    featured: true,
    view_count: 18900
  },

  // 4. Motor Vehicle: Section 194D MVA (Helmet rules) & State application
  {
    id: 'mva-sec-194d',
    act_name: 'Motor Vehicles Act, 1988 (Amended 2019)',
    short_act: 'Motor Vehicles Act',
    section_number: 'Section 194D',
    section_title: 'Penalty for Violation of Safety Measures for Motor Cycles (Helmet Regulations)',
    category_id: 'motor-vehicle-traffic-law',
    simple_explanation: 'Mandates that every rider and pillion passenger on a two-wheeler above 4 years old must wear an ISI-marked protective headgear (helmet) securely strapped, failing which a fine and license disqualification apply.',
    official_text: 'Whoever drives a motor cycle or causes or allows a motor cycle to be driven in contravention of the provisions of section 129 or the rules or regulations made thereunder shall be punishable with a fine of one thousand rupees and he shall be disqualified for holding a licence for a period of three months.',
    what_it_means: 'Both rider and pillion must wear certified helmets conforming to Bureau of Indian Standards (BIS) specifications. Non-wearing incurs a monetary penalty plus statutory three-month driving license disqualification.',
    actions_covered: [
      'Riding two-wheeler without wearing a protective helmet',
      'Pillion passenger not wearing a helmet',
      'Wearing an unstrapped or unapproved helmet that does not meet BIS standards'
    ],
    punishment: 'Disqualification of driving license for a period of 3 months',
    fine: '₹1,000 (One Thousand Rupees)',
    imprisonment: 'None (Compoundable monetary infraction)',
    other_consequences: 'Three months driving license suspension marked on Sarathi portal; compulsory community road safety counselling in certain States.',
    is_bailable: true,
    is_cognizable: false,
    court_triable: 'Authorized Police Officer (SI rank & above) / Traffic E-Challan Cell',
    exceptions: [
      'A person who is a Sikh wearing a turban while riding or driving in public place (Section 129 Proviso)'
    ],
    related_sections: [
      { section_number: 'Section 129', act_name: 'Motor Vehicles Act, 1988', title: 'Wearing of protective headgear' },
      { section_number: 'Section 194B', act_name: 'Motor Vehicles Act, 1988', title: 'Use of safety belts' }
    ],
    related_acts: ['Central Motor Vehicles Rules, 1989', 'Telangana Motor Vehicles Rules'],
    effective_date: '1 September 2019',
    source: 'Ministry of Road Transport and Highways (MoRTH), Govt of India',
    source_url: 'https://morth.nic.in/motor-vehicles-amendment-act-2019',
    last_updated: '2024-05-10',
    keywords: ['helmet fine', 'traffic rule', 'pillion helmet', 'section 194d', 'challan', 'two wheeler fine'],
    state_applicability: 'All India',
    target_audience: ['Drivers / Commuters', 'General Citizens', 'Students'],
    view_count: 9800
  },

  // 5. Telangana Specific Law: Telangana Motor Vehicles Rules & Hyderabad Police Act
  {
    id: 'telangana-mvr-traffic-rule',
    act_name: 'Telangana Motor Vehicles Rules, 1989 & Hyderabad City Police Act, 1348F',
    short_act: 'Telangana Traffic Rules & Police Act',
    section_number: 'Rule 493 & Sec 21/76',
    section_title: 'Regulation of Traffic, Wrong-Side Driving & Triple Riding Penalties in Telangana',
    category_id: 'motor-vehicle-traffic-law',
    simple_explanation: 'Special State enforcement regulations applicable across Hyderabad, Cyberabad, Rachakonda and Telangana districts for dangerous driving, wrong-side driving on flyovers/highways, triple riding, and unauthorized vehicle modifications (modified silencers).',
    official_text: 'In exercise of powers under Telangana Motor Vehicles Rules read with Section 21 of Hyderabad City Police Act, dangerous driving against flow of traffic, illegal triple riding on two-wheelers, and use of loud aftermarket silencers shall attract compounding fees and vehicle seizure.',
    what_it_means: 'In Telangana, wrong-side driving on arterial roads or flyovers is treated as dangerous driving under Section 184 MVA with compounding fines of ₹1,000 to ₹5,000 and possible vehicle impounding. Modified silencers causing sound pollution attract immediate seizure and court summons.',
    actions_covered: [
      'Driving against the flow of traffic (Wrong-side driving) on Telangana roads and ORR access corridors',
      'Triple riding on motorcycles or scooters in urban Commissionerates',
      'Fitting illegal loud exhaust pipes / modified silencers exceeding 80 decibels',
      'Obstructing emergency lanes on Hyderabad Outer Ring Road (ORR)'
    ],
    punishment: 'Vehicle seizure by Traffic Police until compounding fine cleared; court challan for repeat offences with up to 3 months imprisonment under Section 184 MVA.',
    fine: '₹1,000 to ₹5,000 depending on vehicle class and location (e.g. flyovers/ORR)',
    imprisonment: 'Up to 3 months for repeat reckless driving under Section 184 MVA',
    other_consequences: 'Penalty points accrued on Telangana RTA driving license profile; 12 points leads to 1-year suspension; mandatory attendance at Traffic Training Institute (TTI Goshamahal / Begumpet).',
    is_bailable: true,
    is_cognizable: true,
    court_triable: 'Special Metropolitan Magistrate for Traffic / E-Court',
    exceptions: [
      'Emergency vehicles (Ambulances, Fire tenders, Police responding to distress) with sirens on'
    ],
    related_sections: [
      { section_number: 'Section 184', act_name: 'Motor Vehicles Act, 1988', title: 'Driving dangerously' },
      { section_number: 'Section 190(2)', act_name: 'Motor Vehicles Act, 1988', title: 'Violation of road safety and noise standards' }
    ],
    related_acts: ['Hyderabad City Police Act, 1348F', 'Motor Vehicles Act, 1988'],
    effective_date: 'Continuous active enforcement with updated 2024 e-challan framework',
    source: 'Telangana State Police & Transport Department, Govt of Telangana (transport.telangana.gov.in)',
    source_url: 'https://transport.telangana.gov.in/',
    last_updated: '2024-08-01',
    is_recently_updated: true,
    update_notes: 'Integrated with automated AI surveillance camera network across Hyderabad Commissionerate.',
    keywords: ['telangana', 'hyderabad traffic', 'wrong side driving', 'triple riding', 'e challan telangana', 'police act', 'traffic fine'],
    state_applicability: 'Telangana',
    target_audience: ['Drivers / Commuters', 'General Citizens'],
    featured: true,
    view_count: 11200
  },

  // 6. Criminal Law: Section 103 Bharatiya Nyaya Sanhita (BNS 2023) - Murder
  {
    id: 'bns-sec-103',
    act_name: 'Bharatiya Nyaya Sanhita, 2023 (BNS)',
    short_act: 'Bharatiya Nyaya Sanhita, 2023',
    section_number: 'Section 103',
    section_title: 'Punishment for Murder (Replaced Section 302 IPC)',
    category_id: 'criminal-law',
    simple_explanation: 'Defines and prescribes severe punishment for intentionally killing another person (murder). Also specifically penalizes mob lynching or murder committed by a group of five or more persons on grounds of race, caste, or religion.',
    official_text: '(1) Whoever commits murder shall be punished with death or imprisonment for life, and shall also be liable to fine. (2) When a group of five or more persons acting in concert commits murder on the ground of race, caste or community, sex, place of birth, language, personal belief or any other similar ground, each member of such group shall be punished with death or with imprisonment for life, and shall also be liable to fine.',
    what_it_means: 'Section 103 of BNS 2023 replaces the historic Section 302 of the Indian Penal Code (IPC). It sets the punishment for murder as capital punishment (death penalty) or life imprisonment. Sub-section (2) introduces a landmark provision specifically holding every member of a lynching mob strictly punishable with death or life imprisonment.',
    actions_covered: [
      'Premeditated intentional killing of another human being',
      'Doing an act with the knowledge that it is so imminently dangerous that it must in all probability cause death',
      'Mob lynching committed by five or more persons based on caste, religion, community, or language'
    ],
    punishment: 'Death penalty or Imprisonment for Life',
    fine: 'Mandatory judicial fine assessed by the Court of Session',
    imprisonment: 'Life imprisonment (until natural death subject to remission rules) or Death sentence',
    other_consequences: 'Civil disqualification, forfeiture of crime proceeds under BNSS 2023, permanent criminal record.',
    is_bailable: false,
    is_cognizable: true,
    court_triable: 'Court of Session',
    exceptions: [
      'Grave and sudden provocation without premeditation (culpable homicide not amounting to murder under Section 105 BNS)',
      'Right of private defence of body or property exercised within legal limits (Section 34-44 BNS)',
      'Public servant acting in good faith for the advancement of public justice',
      'Sudden fight in the heat of passion upon a sudden quarrel'
    ],
    related_sections: [
      { section_number: 'Section 101', act_name: 'Bharatiya Nyaya Sanhita, 2023', title: 'Culpable homicide defined' },
      { section_number: 'Section 105', act_name: 'Bharatiya Nyaya Sanhita, 2023', title: 'Punishment for culpable homicide not amounting to murder' },
      { section_number: 'Section 302 (Repealed)', act_name: 'Indian Penal Code, 1860', title: 'Earlier murder provision' }
    ],
    related_acts: ['Bharatiya Nagarik Suraksha Sanhita, 2023', 'Bharatiya Sakshya Adhiniyam, 2023'],
    effective_date: '1 July 2024',
    source: 'Official Gazette of India / Ministry of Home Affairs, Govt of India (mha.gov.in)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/21727',
    last_updated: '2024-07-01',
    is_recently_updated: true,
    update_notes: 'Passed into law under Act No. 45 of 2023; in full effect nationwide since 1 July 2024.',
    keywords: ['murder', 'section 302 ipc', 'section 103 bns', 'mob lynching', 'death penalty', 'life imprisonment', 'homicide'],
    state_applicability: 'All India',
    target_audience: ['General Citizens', 'Law Student / Advocate'],
    featured: true,
    view_count: 22400
  },

  // 7. Criminal Law: Section 318 BNS (Cheating / Fraud)
  {
    id: 'bns-sec-318',
    act_name: 'Bharatiya Nyaya Sanhita, 2023 (BNS)',
    short_act: 'Bharatiya Nyaya Sanhita, 2023',
    section_number: 'Section 318',
    section_title: 'Cheating (Replaced Section 415 & 420 IPC)',
    category_id: 'criminal-law',
    simple_explanation: 'Punishes anyone who dishonestly tricks someone into handing over money, property, or valuable security, or induces someone to do something they would not have done if they had not been deceived.',
    official_text: 'Whoever, by deceiving any person, fraudulently or dishonestly induces the person so deceived to deliver any property to any person, or to consent that any person shall retain any property... shall be punished with imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine.',
    what_it_means: 'Section 318 combines and simplifies the cheating provisions previously scattered across Sections 415, 417, and 420 of the Indian Penal Code. Fraudulent intent at the inception of the transaction is key.',
    actions_covered: [
      'Financial scams, Ponzi schemes, and fraudulent investment promises',
      'Selling fake goods or counterfeit gold while claiming authenticity',
      'Selling someone else\'s land using forged title deeds',
      'Inducing delivery of money on false pretexts'
    ],
    punishment: 'Simple cheating: up to 3 years imprisonment. Cheating with delivery of property: up to 7 years imprisonment.',
    fine: 'Fine as determined by the trial court',
    imprisonment: 'Up to 7 years',
    other_consequences: 'Restitution of stolen money/property to victim under BNSS 2023; attachment of bank accounts.',
    is_bailable: false,
    is_cognizable: true,
    court_triable: 'Magistrate of the First Class',
    exceptions: [
      'Pure civil breach of contract where there was no deceptive intent at the start of agreement'
    ],
    related_sections: [
      { section_number: 'Section 319', act_name: 'Bharatiya Nyaya Sanhita, 2023', title: 'Cheating by personation' },
      { section_number: 'Section 336', act_name: 'Bharatiya Nyaya Sanhita, 2023', title: 'Forgery' },
      { section_number: 'Section 420 (Repealed)', act_name: 'Indian Penal Code, 1860', title: 'Legacy cheating section' }
    ],
    related_acts: ['Bharatiya Nagarik Suraksha Sanhita, 2023'],
    effective_date: '1 July 2024',
    source: 'Ministry of Home Affairs / India Code (indiacode.nic.in)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/21727',
    last_updated: '2024-07-01',
    is_recently_updated: true,
    keywords: ['cheating', 'fraud', 'section 420 ipc', 'section 318 bns', 'financial scam', 'deceit', 'embezzlement'],
    state_applicability: 'All India',
    target_audience: ['General Citizens', 'Consumers', 'Business Owners'],
    featured: true,
    view_count: 17800
  },

  // 8. Constitutional Law: Article 21
  {
    id: 'constitution-art-21',
    act_name: 'Constitution of India, 1950',
    short_act: 'Constitution of India',
    section_number: 'Article 21',
    section_title: 'Protection of Life and Personal Liberty',
    category_id: 'constitutional-law',
    simple_explanation: 'The most sacred fundamental right in India: No person shall be deprived of their life or personal liberty except according to fair, just, and reasonable procedure established by law.',
    official_text: 'No person shall be deprived of his life or personal liberty except according to procedure established by law.',
    what_it_means: 'Expanded by Supreme Court landmark rulings (Maneka Gandhi, Puttaswamy), Article 21 guarantees more than mere animal existence. It encompasses right to privacy, right to clean environment, right to speedy trial, right to livelihood, dignity, emergency medical care, and protection against illegal arrest.',
    actions_covered: [
      'Protection against unlawful detention or torture by police/authorities',
      'Protection of personal digital data and surveillance privacy (Puttaswamy case)',
      'Right to breathe clean air and drink potable water without toxic industrial discharge',
      'Right of an arrested citizen to legal counsel and free legal aid'
    ],
    punishment: 'Not a penal section; acts as constitutional shield against executive and legislative overreach',
    fine: 'Not applicable (State may be ordered to pay heavy monetary compensation to victims)',
    imprisonment: 'Not applicable',
    other_consequences: 'High Courts (Article 226) and Supreme Court (Article 32) can issue Writs of Habeas Corpus, Mandamus, Quo Warranto, and award exemplary damages against rogue officials.',
    is_bailable: null,
    is_cognizable: null,
    court_triable: 'Supreme Court of India / High Courts of States',
    exceptions: [
      'Deprivation must be under a valid law that is just, fair, and reasonable (due process doctrine)'
    ],
    related_sections: [
      { section_number: 'Article 19', act_name: 'Constitution of India', title: 'Freedom of Speech and Expression' },
      { section_number: 'Article 32', act_name: 'Constitution of India', title: 'Remedies for enforcement of Fundamental Rights' },
      { section_number: 'Article 22', act_name: 'Constitution of India', title: 'Protection against arrest and detention' }
    ],
    related_acts: ['Protection of Human Rights Act, 1993', 'Bharatiya Nagarik Suraksha Sanhita, 2023'],
    effective_date: '26 January 1950',
    source: 'Ministry of Law and Justice, Legislative Department, Government of India',
    source_url: 'https://legislative.gov.in/constitution-of-india/',
    last_updated: '2024-01-01',
    keywords: ['fundamental right', 'article 21', 'right to life', 'privacy', 'liberty', 'habeas corpus', 'human rights'],
    state_applicability: 'All India',
    target_audience: ['General Citizens', 'Students', 'Law Student / Advocate'],
    featured: true,
    view_count: 24500
  },

  // 9. Consumer Law: Section 35 & 89 Consumer Protection Act, 2019
  {
    id: 'copra-sec-35',
    act_name: 'Consumer Protection Act, 2019',
    short_act: 'Consumer Protection Act',
    section_number: 'Section 35 & 89',
    section_title: 'Manner in which Complaint shall be made & Punishment for False or Misleading Advertisements',
    category_id: 'consumer-law',
    simple_explanation: 'Allows any buyer or consumer of goods and services to file a direct case before the District Consumer Commission against deficient services, defective products, or misleading celebrity advertisements, and punishes fraudulent promoters.',
    official_text: 'A complaint in relation to any goods sold or delivered or agreed to be sold or delivered or any service provided or agreed to be provided may be filed with a District Commission... Any manufacturer or service provider who causes a false or misleading advertisement to be made shall be punishable with imprisonment for a term which may extend to two years and with fine which may extend to ten lakh rupees.',
    what_it_means: 'The 2019 Act modernized consumer law in India to cover e-commerce, tele-shopping, and direct selling. Consumers can file complaints online via the E-Daakhil portal from the comfort of their home, without hiring expensive advocates.',
    actions_covered: [
      'E-commerce platforms refusing refund for damaged or counterfeit goods',
      'Airlines or travel aggregators cancelling flights without full refunds',
      'Builder failing to deliver flat possession within agreed timeline',
      'Celebrities and brands endorsing false claims (e.g. cures that do not exist)'
    ],
    punishment: 'For misleading ads: Imprisonment up to 2 years (first offence), up to 5 years for subsequent. Non-compliance with Commission order: up to 3 years imprisonment.',
    fine: 'Misleading ads fine: Up to ₹10 Lakhs (1st offence), up to ₹50 Lakhs (subsequent). Consumer Commission can award full refund plus lakhs in compensation.',
    imprisonment: 'Up to 2 years for misleading ads; up to 3 years for defying Consumer Court orders',
    other_consequences: 'Product recall order; prohibition of manufacturer/endorser from endorsing any product for up to 3 years; cancellation of operating trade license.',
    is_bailable: true,
    is_cognizable: false,
    court_triable: 'District / State / National Consumer Disputes Redressal Commission',
    exceptions: [
      'Goods bought for purely commercial reselling purposes without self-employment nexus'
    ],
    related_sections: [
      { section_number: 'Section 2(7)', act_name: 'Consumer Protection Act, 2019', title: 'Definition of Consumer' },
      { section_number: 'Section 82', act_name: 'Consumer Protection Act, 2019', title: 'Product Liability action' }
    ],
    related_acts: ['Consumer Protection (E-Commerce) Rules, 2020'],
    effective_date: '20 July 2020',
    source: 'Department of Consumer Affairs, Ministry of Consumer Affairs, Food & Public Distribution (consumeraffairs.nic.in)',
    source_url: 'https://consumeraffairs.nic.in/acts-and-rules/consumer-protection',
    last_updated: '2024-04-12',
    keywords: ['consumer court', 'e daakhil', 'refund', 'defective product', 'misleading advertisement', 'e commerce complaint', 'section 35'],
    state_applicability: 'All India',
    target_audience: ['Consumers', 'General Citizens', 'Business Owners'],
    featured: true,
    view_count: 13900
  },

  // 10. Banking & Financial Law: Section 138 Negotiable Instruments Act
  {
    id: 'ni-act-sec-138',
    act_name: 'Negotiable Instruments Act, 1881',
    short_act: 'NI Act, 1881',
    section_number: 'Section 138',
    section_title: 'Dishonour of Cheque for Insufficiency of Funds in the Account (Cheque Bounce)',
    category_id: 'banking-financial-law',
    simple_explanation: 'If a person issues a bank cheque to pay off an existing legal debt and that cheque bounces due to insufficient money in their account, it is a criminal offence that can result in prison and paying double the cheque amount.',
    official_text: 'Where any cheque drawn by a person on an account maintained by him with a banker for payment of any amount of money to another person from out of that account for the discharge, in whole or in part, of any debt or other liability, is returned by the bank unpaid... such person shall be deemed to have committed an offence and shall be punished with imprisonment for a term which may be extended to two years, or with fine which may extend to twice the amount of the cheque, or with both.',
    what_it_means: 'Section 138 is one of the most common commercial criminal provisions in India. The payee must send a formal legal demand notice within 30 days of receiving the bank memo, giving the drawer 15 days to pay. If unpaid, a criminal complaint is filed within 30 days.',
    actions_covered: [
      'Issuing cheques that bounce due to insufficient funds',
      'Intentionally closing bank account before presentation of cheque',
      'Instructing bank to "Stop Payment" to evade lawful commercial debt'
    ],
    punishment: 'Imprisonment for up to 2 years, or fine up to twice the cheque amount, or both',
    fine: 'Up to twice (2x) the amount of the bounced cheque',
    imprisonment: 'Up to 2 years',
    other_consequences: 'Interim compensation order directing the accused to deposit 20% of the cheque amount during trial under Section 143A NI Act.',
    is_bailable: true,
    is_cognizable: false,
    court_triable: 'Judicial Magistrate of First Class / Metropolitan Magistrate',
    exceptions: [
      'Cheque given purely as a gift or for charitable donation where no legal debt exists',
      'Cheque issued for illegal contracts (e.g. gambling, prohibited transactions)'
    ],
    related_sections: [
      { section_number: 'Section 141', act_name: 'Negotiable Instruments Act, 1881', title: 'Offences by Companies & Directors liability' },
      { section_number: 'Section 143A', act_name: 'Negotiable Instruments Act, 1881', title: 'Power to direct interim compensation' }
    ],
    related_acts: ['Bharatiya Nagarik Suraksha Sanhita, 2023'],
    effective_date: '1 April 1989 (Subsequent amendments 2002 & 2018)',
    source: 'Ministry of Finance, Department of Financial Services / India Code',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/2189',
    last_updated: '2024-03-20',
    keywords: ['cheque bounce', 'section 138', 'dishonour of cheque', 'insufficient funds', 'legal notice', 'banking law'],
    state_applicability: 'All India',
    target_audience: ['Business Owners', 'General Citizens', 'Working Professional'],
    featured: true,
    view_count: 16400
  },

  // 11. Family & Personal Law: Protection of Women from Domestic Violence Act, 2005 (PWDVA)
  {
    id: 'pwdva-sec-12',
    act_name: 'Protection of Women from Domestic Violence Act, 2005',
    short_act: 'Domestic Violence Act',
    section_number: 'Section 12',
    section_title: 'Application to Magistrate for Protection, Residence, Monetary Relief & Custody Orders',
    category_id: 'family-personal-law',
    simple_explanation: 'Provides an immediate legal shield to any woman living in a shared household who faces physical abuse, verbal insult, emotional torture, sexual harassment, or economic denial by relatives.',
    official_text: 'An aggrieved person or a Protection Officer or any other person on behalf of the aggrieved person may present an application to the Magistrate seeking one or more reliefs under this Act, including protection orders, residence orders, monetary relief, and custody orders.',
    what_it_means: 'This civil-cum-quasi-criminal enactment ensures women cannot be thrown out of their matrimonial home (Right to Reside). The Magistrate must hold the first hearing within 3 days of filing and can pass ex-parte emergency injunction orders.',
    actions_covered: [
      'Physical battery, slapping, or domestic violence',
      'Verbal abuse, insults, name-calling, or dowry harassment',
      'Economic deprivation (not giving money for food, medicine, or children education)',
      'Forcibly evicting a woman from her shared matrimonial residence'
    ],
    punishment: 'Breach of a protection order passed by Magistrate is a criminal offence punishable with imprisonment up to 1 year and/or fine up to ₹20,000 under Section 31.',
    fine: 'Fine up to ₹20,000 for breaching protection order; monetary maintenance and compensation determined by court',
    imprisonment: 'Up to 1 year for violation of protection order',
    other_consequences: 'Immediate police intervention, appointment of Protection Officer, right to shelter homes and free legal aid.',
    is_bailable: false,
    is_cognizable: true,
    court_triable: 'Judicial Magistrate of First Class / Metropolitan Magistrate',
    exceptions: [
      'Proceedings are civil in origin to provide relief and protection; penal sanctions activate when a court order is willfully violated'
    ],
    related_sections: [
      { section_number: 'Section 85', act_name: 'Bharatiya Nyaya Sanhita, 2023', title: 'Cruelty by husband or relatives (Earlier 498A IPC)' },
      { section_number: 'Section 17', act_name: 'Domestic Violence Act, 2005', title: 'Right to reside in a shared household' }
    ],
    related_acts: ['Bharatiya Nyaya Sanhita, 2023', 'Family Courts Act, 1984'],
    effective_date: '26 October 2006',
    source: 'Ministry of Women and Child Development, Government of India (wcd.nic.in)',
    source_url: 'https://wcd.nic.in/act/protection-women-domestic-violence-act-2005',
    last_updated: '2024-02-15',
    keywords: ['domestic violence', 'pwdva', 'protection order', 'shared household', 'section 12', 'women rights', 'maintenance'],
    state_applicability: 'All India',
    target_audience: ['General Citizens', 'Law Student / Advocate'],
    featured: true,
    view_count: 15300
  },

  // 12. Corporate Law: Section 447 Companies Act, 2013
  {
    id: 'companies-act-sec-447',
    act_name: 'Companies Act, 2013',
    short_act: 'Companies Act',
    section_number: 'Section 447',
    section_title: 'Punishment for Fraud in Management or Affairs of a Company',
    category_id: 'corporate-law',
    simple_explanation: 'Prescribes strict imprisonment and non-compoundable penalties for any director, auditor, promoter, or corporate officer who engages in financial fraud, siphoning of company money, or false accounting books.',
    official_text: 'Without prejudice to any liability including repayment of any debt under this Act or any other law for the time being in force, any person who is found to be guilty of fraud involving an amount of at least ten lakh rupees or one per cent. of the turnover of the company, whichever is lower, shall be punishable with imprisonment for a term which shall not be less than six months but which may extend to ten years and shall also be liable to fine which shall not be less than the amount involved in the fraud, but which may extend to three times the amount involved in the fraud.',
    what_it_means: 'Section 447 is the backbone of corporate criminal liability in India investigated by the Serious Fraud Investigation Office (SFIO). If public interest is harmed, the minimum mandatory jail sentence is 3 years.',
    actions_covered: [
      'Siphoning funds from company bank accounts into personal shell entities',
      'Falsifying statutory balance sheets or auditor certificates',
      'Misleading equity shareholders through fabricated profitability figures',
      'Defrauding creditors or loan consortiums'
    ],
    punishment: 'Imprisonment from 6 months to 10 years (minimum 3 years if public interest involved)',
    fine: 'Fine between 100% to 300% (up to three times) of the amount involved in the fraud',
    imprisonment: '6 months to 10 years',
    other_consequences: 'Disqualification from serving as director for 5 years; freezing of personal assets by SFIO / NCLT; civil recovery.',
    is_bailable: false,
    is_cognizable: true,
    court_triable: 'Special Court established under Companies Act, 2013',
    exceptions: [
      'Minor frauds below ₹10 Lakhs and below 1% of turnover without deceptive intent may receive lesser sentence up to 5 years under proviso'
    ],
    related_sections: [
      { section_number: 'Section 448', act_name: 'Companies Act, 2013', title: 'Punishment for false statements' },
      { section_number: 'Section 212', act_name: 'Companies Act, 2013', title: 'Investigation into affairs of company by SFIO' }
    ],
    related_acts: ['Insolvency and Bankruptcy Code, 2016', 'Prevention of Money Laundering Act, 2002'],
    effective_date: '12 September 2013',
    source: 'Ministry of Corporate Affairs (MCA), Government of India (mca.gov.in)',
    source_url: 'https://www.mca.gov.in/content/mca/global/en/acts-rules/companies-act/companies-act-2013.html',
    last_updated: '2024-01-20',
    keywords: ['corporate fraud', 'companies act', 'section 447', 'sfio', 'directors liability', 'siphoning', 'nclt'],
    state_applicability: 'All India',
    target_audience: ['Business Owners', 'Working Professional', 'Law Student / Advocate'],
    view_count: 8700
  },

  // 13. Labour & Employment Law: POSH Act, 2013
  {
    id: 'posh-act-sec-3',
    act_name: 'Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013',
    short_act: 'POSH Act, 2013',
    section_number: 'Section 3 & 4',
    section_title: 'Prevention of Sexual Harassment & Constitution of Internal Committee (IC)',
    category_id: 'labour-employment-law',
    simple_explanation: 'Mandates every workplace with 10 or more employees to set up an Internal Committee (IC) to address sexual harassment complaints, ensuring safe working conditions for all women employees.',
    official_text: 'No woman shall be subjected to sexual harassment at any workplace... Every employer of a workplace shall, by an order in writing, constitute a Committee to be known as the Internal Committee.',
    what_it_means: 'Applies to organized and unorganized sectors, private companies, IT hubs, factories, hospitals, and educational institutions. An employer who fails to constitute an Internal Committee faces government fines and cancellation of business license.',
    actions_covered: [
      'Physical contact and advances, or sexually colored remarks',
      'Demand or request for sexual favors under promise of promotion or threat of termination (Quid Pro Quo)',
      'Creating a hostile, intimidating, or offensive work environment',
      'Showing pornography or sending unsolicited explicit messages to colleagues'
    ],
    punishment: 'For employer failing to constitute IC: Fine of ₹50,000; repeated violation leads to double fine and cancellation of business registration or statutory license.',
    fine: '₹50,000 for first employer violation; up to ₹1,00,000 for repeated breach',
    imprisonment: 'Disciplinary service termination for respondent under service rules; criminal charges under BNS Section 75/78.',
    other_consequences: 'Withholding of promotion, deduction of compensation amount from salary for complainant, civil court liability.',
    is_bailable: true,
    is_cognizable: false,
    court_triable: 'Internal Committee / Local Complaints Committee / Judicial Magistrate',
    exceptions: [
      'Malicious or false complaints proven with clear evidence allow internal committee to recommend action against complainant, but failure to prove does not imply malicious intent'
    ],
    related_sections: [
      { section_number: 'Section 75', act_name: 'Bharatiya Nyaya Sanhita, 2023', title: 'Sexual harassment penal sanction' },
      { section_number: 'Section 9', act_name: 'POSH Act, 2013', title: 'Complaint of sexual harassment' }
    ],
    related_acts: ['Bharatiya Nyaya Sanhita, 2023', 'Code on Wages, 2019'],
    effective_date: '9 December 2013',
    source: 'Ministry of Women and Child Development, Government of India (wcd.nic.in)',
    source_url: 'https://wcd.nic.in/act/sexual-harassment-women-workplace-prevention-prohibition-and-redressal-act-2013',
    last_updated: '2024-03-10',
    keywords: ['posh act', 'sexual harassment', 'workplace safety', 'internal committee', 'employee rights', 'labour law'],
    state_applicability: 'All India',
    target_audience: ['Working Professional', 'Business Owners', 'Students'],
    featured: true,
    view_count: 14700
  },

  // 14. Government & Public Administration: RTI Act, 2005
  {
    id: 'rti-act-sec-6',
    act_name: 'Right to Information Act, 2005',
    short_act: 'RTI Act, 2005',
    section_number: 'Section 6 & 7',
    section_title: 'Request for Obtaining Information & Disposal of Request (30-Day Mandatory Rule)',
    category_id: 'government-public-administration',
    simple_explanation: 'Empowers any Indian citizen to ask government offices, ministries, municipal corporations, or police departments for official records, tender details, public spending data, and answers within 30 days for a nominal ₹10 fee.',
    official_text: 'A person, who desires to obtain any information under this Act, shall make a request in writing or through electronic means... The Central Public Information Officer or State Public Information Officer shall, as expeditiously as possible, and in any case within thirty days of the receipt of the request, either provide the information on payment of such fee as may be prescribed or reject the request for any of the reasons specified in sections 8 and 9.',
    what_it_means: 'Information relating to life or liberty of a person must be provided within 48 hours. If an officer delays without reasonable cause, the Information Commission levies a personal penalty of ₹250 per day up to ₹25,000 on the officer.',
    actions_covered: [
      'Demanding status of pending passport, driving license, or government approvals',
      'Inspecting municipal road construction files and public expenditure bills',
      'Obtaining marks, answer sheets, and cutoff lists in public recruitments',
      'Examining environmental clearances and public fund allocations'
    ],
    punishment: 'Personal monetary penalty on Public Information Officer of ₹250 each day of delay up to ₹25,000; disciplinary proceedings recommendation under service conduct rules.',
    fine: 'Up to ₹25,000 personal fine deducted from responsible officer\'s salary',
    imprisonment: 'None (Administrative and statutory regulatory sanction)',
    other_consequences: 'Mandatory disclosure order and compensation to information seeker for detriment suffered.',
    is_bailable: null,
    is_cognizable: null,
    court_triable: 'Central Information Commission (CIC) / State Information Commissions (SIC)',
    exceptions: [
      'National security, sovereignty, intelligence agencies (IB, RAW) under Second Schedule',
      'Cabinet papers prior to decision, commercial secrets, and personal privacy having no public interest (Section 8)'
    ],
    related_sections: [
      { section_number: 'Section 8', act_name: 'RTI Act, 2005', title: 'Exemption from disclosure of information' },
      { section_number: 'Section 20', act_name: 'RTI Act, 2005', title: 'Penalties for delay or mala fide refusal' }
    ],
    related_acts: ['Digital Personal Data Protection Act, 2023', 'Official Secrets Act, 1923'],
    effective_date: '12 October 2005',
    source: 'Department of Personnel and Training (DoPT), Govt of India (rti.gov.in)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/2065',
    last_updated: '2024-01-15',
    keywords: ['rti act', 'right to information', 'transparency', 'government records', 'public officer', 'section 6', 'section 7'],
    state_applicability: 'All India',
    target_audience: ['General Citizens', 'Students', 'Working Professional'],
    featured: true,
    view_count: 16100
  },

  // 15. Environmental Law: Environment (Protection) Act, 1986
  {
    id: 'epa-sec-15',
    act_name: 'Environment (Protection) Act, 1986',
    short_act: 'Environment Protection Act',
    section_number: 'Section 15',
    section_title: 'Penalty for Contravention of the Provisions of the Act and Rules (Pollution & Hazardous Waste)',
    category_id: 'environmental-law',
    simple_explanation: 'Strictly punishes factories, entities, or individuals who discharge dangerous pollutants, dump hazardous waste, or violate environmental quality standards set by the Pollution Control Board.',
    official_text: 'Whoever fails to comply with or contravenes any of the provisions of this Act, or the rules made or orders or directions issued thereunder, shall, in respect of each such failure or contravention, be punishable with imprisonment for a term which may extend to five years with fine which may extend to one lakh rupees, or with both, and in case the failure or contravention continues, with additional fine which may extend to five thousand rupees for every day.',
    what_it_means: 'Empowers regulatory bodies like CPCB, State Pollution Control Boards, and the National Green Tribunal (NGT) to shut down polluting industrial units, seal operations, and cut electricity/water supplies.',
    actions_covered: [
      'Discharging untreated chemical effluent into rivers, lakes, or groundwater tables',
      'Emitting toxic fumes or industrial smoke exceeding permissible ambient air standards',
      'Dumping hazardous electronic, bio-medical, or plastic waste illegally in public zones',
      'Operating polluting factories without environmental clearance'
    ],
    punishment: 'Imprisonment up to 5 years (can extend up to 7 years if violation continues beyond 1 year)',
    fine: 'Fine up to ₹1,00,000 plus ₹5,000 per day for continuing failure (NGT regularly levies crores as environmental damages)',
    imprisonment: 'Up to 5 years (extendable to 7 years)',
    other_consequences: 'Immediate closure of industrial factory; disconnection of power and water; restitution order by NGT under Polluter Pays Principle.',
    is_bailable: true,
    is_cognizable: true,
    court_triable: 'National Green Tribunal (NGT) / Court of Judicial Magistrate First Class',
    exceptions: [
      'Acts done in good faith during emergency disaster mitigation under direct government supervision'
    ],
    related_sections: [
      { section_number: 'Section 5', act_name: 'Environment Protection Act, 1986', title: 'Power to give closure directions' },
      { section_number: 'Section 24', act_name: 'National Green Tribunal Act, 2010', title: 'Order for compensation and environmental relief' }
    ],
    related_acts: ['Water (Prevention and Control of Pollution) Act, 1974', 'Air (Prevention and Control of Pollution) Act, 1981'],
    effective_date: '19 November 1986 (Updated periodically by MoEFCC)',
    source: 'Ministry of Environment, Forest and Climate Change (MoEFCC), Govt of India (moef.gov.in)',
    source_url: 'https://moef.gov.in/en/rules-and-regulations/environment-protection/',
    last_updated: '2024-05-22',
    keywords: ['environment law', 'pollution fine', 'hazardous waste', 'ngt', 'cpcb', 'effluent discharge', 'section 15'],
    state_applicability: 'All India',
    target_audience: ['Business Owners', 'General Citizens', 'Students'],
    view_count: 7300
  },

  // 16. Evidence & Procedure: BNSS 2023 Section 173 (Zero FIR & Electronic Registration)
  {
    id: 'bnss-sec-173',
    act_name: 'Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)',
    short_act: 'Bharatiya Nagarik Suraksha Sanhita, 2023',
    section_number: 'Section 173',
    section_title: 'Information in Cognizable Cases (Mandatory Zero FIR & Electronic FIR - Replaced Sec 154 CrPC)',
    category_id: 'evidence-procedure',
    simple_explanation: 'Allows any crime victim to register a Police FIR at ANY police station regardless of jurisdiction (known as Zero FIR), and legally introduces e-FIR (filing complaints online or via electronic communication).',
    official_text: '(1) Every information relating to the commission of a cognizable offence, irrespective of the area where the offence is committed may be given orally or by electronic communication to an officer in charge of a police station... Provided that if the information is given by electronic communication, it shall be taken on record by him on being signed within three days by the person giving it.',
    what_it_means: 'Section 173 of BNSS 2023 gives statutory backing to "Zero FIR" which was previously only a judicial guideline. Police officers CANNOT refuse to register an FIR claiming that the incident happened outside their police station limits. They must register, provide emergency aid, and transfer the case.',
    actions_covered: [
      'Registering an FIR at the nearest police station while traveling away from home',
      'Submitting cyber crime, theft, or assault complaints via e-mail or state citizen portal (e-FIR)',
      'Mandatory recording of statements of female victims by a woman police officer at the victim\'s residence'
    ],
    punishment: 'A police officer who willfully refuses to register an FIR in cognizable crimes faces up to 2 years imprisonment under Section 199 BNS (earlier Section 166A IPC).',
    fine: 'Fine on defaulting police officer',
    imprisonment: 'Up to 2 years for police officer refusing registration',
    other_consequences: 'Free copy of FIR must be given immediately to the complainant or informant.',
    is_bailable: true,
    is_cognizable: false,
    court_triable: 'Judicial Magistrate having territorial jurisdiction',
    exceptions: [
      'Preliminary inquiry for up to 14 days permitted in offences punishable between 3 and 7 years with prior approval of Deputy SP rank officer to ascertain prima facie case'
    ],
    related_sections: [
      { section_number: 'Section 154 (Repealed)', act_name: 'Code of Criminal Procedure, 1973', title: 'Legacy FIR section' },
      { section_number: 'Section 199', act_name: 'Bharatiya Nyaya Sanhita, 2023', title: 'Public servant disobeying law of registration' }
    ],
    related_acts: ['Bharatiya Nyaya Sanhita, 2023', 'Bharatiya Sakshya Adhiniyam, 2023'],
    effective_date: '1 July 2024',
    source: 'Ministry of Home Affairs, Government of India (mha.gov.in) / Official Gazette',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/21728',
    last_updated: '2024-07-01',
    is_recently_updated: true,
    update_notes: 'New criminal procedural code replacing CrPC 1973 effective 1 July 2024 across all Indian states and UTs.',
    keywords: ['zero fir', 'efir', 'section 154 crpc', 'section 173 bnss', 'police complaint', 'cognizable offence', 'fir rights'],
    state_applicability: 'All India',
    target_audience: ['General Citizens', 'Law Student / Advocate', 'Students'],
    featured: true,
    view_count: 19100
  },

  // 17. Contract & Commercial Law: Indian Contract Act 1872
  {
    id: 'contract-act-sec-10',
    act_name: 'Indian Contract Act, 1872',
    short_act: 'Indian Contract Act',
    section_number: 'Section 10 & 23',
    section_title: 'What Agreements are Contracts & Lawful Object and Consideration',
    category_id: 'contract-commercial-law',
    simple_explanation: 'Defines when an agreement becomes a legally enforceable contract: it requires free consent of competent parties, lawful consideration, and a lawful purpose (not against public policy).',
    official_text: 'All agreements are contracts if they are made by the free consent of parties competent to contract, for a lawful consideration and with a lawful object, and are not hereby expressly declared to be void.',
    what_it_means: 'If consent is obtained through coercion, undue influence, fraud, misrepresentation, or mutual mistake, the contract is voidable. Agreements with minors or for illegal acts (e.g. paying someone to commit a crime) are completely void ab initio.',
    actions_covered: [
      'Commercial business partnerships, vendor purchase orders, and employment contracts',
      'Agreements signed under threat or physical pressure (Voidable under Section 19)',
      'Unlawful contracts involving gambling, bribery, or trade restraint'
    ],
    punishment: 'Civil law enactment: no direct prison sentence; breach results in damages, compensation, or specific performance under Specific Relief Act.',
    fine: 'Court awards compensatory damages for financial loss caused by breach (Section 73)',
    imprisonment: 'None (Civil remedy)',
    other_consequences: 'Restoration of advantages received under void agreements (Section 65).',
    is_bailable: null,
    is_cognizable: null,
    court_triable: 'Commercial Court / City Civil Court / Arbitral Tribunal',
    exceptions: [
      'Agreements in restraint of trade, marriage, or legal proceedings are declared void by statute'
    ],
    related_sections: [
      { section_number: 'Section 73', act_name: 'Indian Contract Act, 1872', title: 'Compensation for loss or damage caused by breach of contract' },
      { section_number: 'Section 15', act_name: 'Indian Contract Act, 1872', title: 'Coercion defined' }
    ],
    related_acts: ['Specific Relief Act, 1963', 'Commercial Courts Act, 2015'],
    effective_date: '1 September 1872',
    source: 'Ministry of Law and Justice, Government of India / India Code',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/2187',
    last_updated: '2023-11-10',
    keywords: ['contract act', 'agreement', 'breach of contract', 'free consent', 'damages', 'section 10', 'commercial law'],
    state_applicability: 'All India',
    target_audience: ['Business Owners', 'Working Professional', 'Students'],
    view_count: 8900
  },

  // 18. Property & Land Law: RERA 2016
  {
    id: 'rera-sec-18',
    act_name: 'Real Estate (Regulation and Development) Act, 2016 (RERA)',
    short_act: 'RERA Act, 2016',
    section_number: 'Section 18',
    section_title: 'Return of Amount and Compensation to Homebuyers for Delay in Possession',
    category_id: 'property-land-law',
    simple_explanation: 'Protects homebuyers: If a builder fails to complete or handover flat/apartment possession on time, the buyer has the legal right to exit and get 100% refund with interest, or claim monthly interest for every month of delay.',
    official_text: 'If the promoter fails to complete or is unable to give possession of an apartment, plot or building... he shall be liable on demand to the allottees, in case the allottee wishes to withdraw from the project, without prejudice to any other remedy available, to return the amount received by him in respect of that apartment, plot, building, as the case may be, with interest at such rate as may be prescribed.',
    what_it_means: 'RERA eliminated builder exploitation where projects were delayed for decades. Homebuyers can file an online complaint before State RERA (e.g., TSRERA in Telangana, MahaRERA in Maharashtra) without civil court delays.',
    actions_covered: [
      'Real estate developer delaying flat handover beyond the date specified in the agreement',
      'Builder making unauthorized architectural changes without 2/3rd homebuyer consent',
      'Diverting homebuyer funds to other projects (70% must be locked in escrow account)'
    ],
    punishment: 'Non-compliance with RERA Appellate orders carries imprisonment up to 3 years or fine up to 10% of total project cost under Section 59/63.',
    fine: 'Up to 10% of the estimated cost of the real estate project',
    imprisonment: 'Up to 3 years for defaulting developer',
    other_consequences: 'Revocation of builder RERA project registration; freezing of developer escrow bank accounts.',
    is_bailable: true,
    is_cognizable: false,
    court_triable: 'Real Estate Regulatory Authority (RERA) / RERA Appellate Tribunal',
    exceptions: [
      'Force majeure (natural disasters, floods, wars) if approved by the Authority up to a maximum of 1 year'
    ],
    related_sections: [
      { section_number: 'Section 4(2)(l)(D)', act_name: 'RERA Act, 2016', title: '70% Escrow deposit mandate' },
      { section_number: 'Section 31', act_name: 'RERA Act, 2016', title: 'Filing of complaints with Authority' }
    ],
    related_acts: ['Transfer of Property Act, 1882', 'Consumer Protection Act, 2019'],
    effective_date: '1 May 2017',
    source: 'Ministry of Housing and Urban Affairs (MoHUA), Government of India (mohua.gov.in)',
    source_url: 'https://mohua.gov.in/cms/real-estate-act.php',
    last_updated: '2024-02-28',
    keywords: ['rera', 'homebuyer rights', 'builder delay', 'flat possession refund', 'section 18 rera', 'property law', 'tsrera'],
    state_applicability: 'All India (Implemented by State RERAs like TSRERA)',
    target_audience: ['General Citizens', 'Consumers', 'Business Owners'],
    featured: true,
    view_count: 10800
  },

  // 19. Intellectual Property: Copyright Act 1957
  {
    id: 'copyright-sec-51',
    act_name: 'Copyright Act, 1957',
    short_act: 'Copyright Act',
    section_number: 'Section 51 & 63',
    section_title: 'When Copyright Infringed & Offences of Infringement of Copyright',
    category_id: 'intellectual-property-law',
    simple_explanation: 'Protects original creative works (music, software code, movies, books, artistic paintings). Making pirated copies, distributing unauthorized digital streams, or using copyrighted content commercially without a license is a criminal offence.',
    official_text: 'Any person who knowingly infringes or abets the infringement of the copyright in a work, or any other right conferred by this Act, shall be punishable with imprisonment for a term which shall not be less than six months but which may extend to three years and with fine which shall not be less than fifty thousand rupees but which may extend to two lakh rupees.',
    what_it_means: 'Copyright infringement in India is both a civil tort and a cognizable criminal offence. Police have power to seize pirated materials and servers without an arrest warrant upon complaint by copyright owner.',
    actions_covered: [
      'Operating unauthorized movie piracy websites or torrent links (Camcording/Torrents)',
      'Copying and selling commercial software code or proprietary video games without license',
      'Publishing duplicate or plagiarized textbooks and course materials for commercial profit',
      'Broadcasting copyrighted sports matches or music concerts without broadcast rights'
    ],
    punishment: 'Imprisonment not less than 6 months and up to 3 years',
    fine: 'Fine between ₹50,000 to ₹2,00,000 (can be higher for repeat offenders)',
    imprisonment: '6 months to 3 years',
    other_consequences: 'Police seizure of infringing copies, recording equipment, and website domain blocking under John Doe court orders.',
    is_bailable: false,
    is_cognizable: true,
    court_triable: 'Court of Session / Chief Judicial Magistrate',
    exceptions: [
      'Fair dealing for private and personal use, research, criticism, review, or reporting current events (Section 52)',
      'Educational use by teachers or students in course of instruction'
    ],
    related_sections: [
      { section_number: 'Section 52', act_name: 'Copyright Act, 1957', title: 'Certain acts not to be infringement of copyright (Fair use)' },
      { section_number: 'Section 64', act_name: 'Copyright Act, 1957', title: 'Power of police to seize infringing copies' }
    ],
    related_acts: ['Information Technology Act, 2000', 'Cinematograph Act, 1952 (Amended 2023)'],
    effective_date: '21 January 1958 (Major amendments 2012 & 2023)',
    source: 'Department for Promotion of Industry and Internal Trade (DPIIT), Ministry of Commerce & Industry / India Code',
    source_url: 'https://copyright.gov.in/',
    last_updated: '2024-01-10',
    keywords: ['copyright', 'piracy', 'software code theft', 'intellectual property', 'section 63', 'fair use', 'patents'],
    state_applicability: 'All India',
    target_audience: ['Tech Users', 'Students', 'Business Owners'],
    view_count: 6500
  },

  // 20. Education Law: Right of Children to Free and Compulsory Education (RTE) Act 2009
  {
    id: 'rte-sec-12',
    act_name: 'Right of Children to Free and Compulsory Education Act, 2009',
    short_act: 'RTE Act, 2009',
    section_number: 'Section 12(1)(c)',
    section_title: 'Mandatory 25% Free Admission Quota for Economically Weaker Sections (EWS)',
    category_id: 'education-law',
    simple_explanation: 'Mandates that every private unaided school must admit at least 25% students from economically weaker sections and disadvantaged groups in Class 1 (or pre-primary) and provide completely free elementary education.',
    official_text: 'For the purposes of this Act, a school... specified in sub-clauses (iii) and (iv) of clause (n) of section 2 shall admit in class I, to the extent of at least twenty-five per cent. of the strength of that class, children belonging to weaker section and disadvantaged group in the neighbourhood and provide free and compulsory elementary education till its completion.',
    what_it_means: 'Enacted under Article 21A of the Indian Constitution, the government reimburses private schools for these admissions. Schools cannot collect capitation fees or conduct screening tests for admission.',
    actions_covered: [
      'Private schools refusing admissions under the statutory 25% EWS/Disadvantaged quota',
      'Charging donation, capitation fee, or interview screening fee from children/parents (Prohibited under Sec 13)',
      'Subjecting children to corporal punishment or mental harassment (Prohibited under Sec 17)'
    ],
    punishment: 'Capitation fee violation: Fine up to 10 times the capitation fee charged. Screening test violation: ₹25,000 for 1st contravention, ₹50,000 for subsequent. Corporal punishment: Disciplinary service action.',
    fine: 'Fine up to 10x capitation fee collected; ₹25,000 to ₹50,000 for illegal admission screening',
    imprisonment: 'None under RTE Act; criminal liability under BNS / Juvenile Justice Act for physical assault',
    other_consequences: 'Withdrawal of school government recognition and affiliation.',
    is_bailable: true,
    is_cognizable: false,
    court_triable: 'State Commission for Protection of Child Rights (SCPCR) / Civil Authority',
    exceptions: [
      'Minority educational institutions protected under Article 30 of the Constitution'
    ],
    related_sections: [
      { section_number: 'Article 21A', act_name: 'Constitution of India', title: 'Right to Education' },
      { section_number: 'Section 13', act_name: 'RTE Act, 2009', title: 'No capitation fee and screening procedure' }
    ],
    related_acts: ['Juvenile Justice (Care and Protection of Children) Act, 2015'],
    effective_date: '1 April 2010',
    source: 'Ministry of Education, Department of School Education & Literacy, Govt of India (education.gov.in)',
    source_url: 'https://dsel.education.gov.in/rte',
    last_updated: '2023-12-05',
    keywords: ['rte act', 'right to education', '25 percent quota', 'school admission', 'capitation fee', 'children rights'],
    state_applicability: 'All India',
    target_audience: ['Students', 'General Citizens'],
    view_count: 8100
  },

  // 21. Health & Medical Law: Drugs and Cosmetics Act 1940 / Clinical Establishments
  {
    id: 'drugs-act-sec-27',
    act_name: 'Drugs and Cosmetics Act, 1940',
    short_act: 'Drugs and Cosmetics Act',
    section_number: 'Section 27',
    section_title: 'Penalty for Manufacture, Sale, or Distribution of Spurious or Adulterated Drugs',
    category_id: 'health-medical-law',
    simple_explanation: 'Imposes harsh life imprisonment and hefty fines on anyone manufacturing or selling fake, contaminated, or spurious medicines that can cause grievous hurt or death to patients.',
    official_text: 'Whoever, himself or by any other person on his behalf, manufactures for sale or for distribution, or sells, or stocks or exhibits or offers for sale, or distributes any drug deemed to be adulterated... or spurious... which is likely to cause death or grievous hurt shall be punishable with imprisonment for a term which shall not be less than ten years but which may extend to imprisonment for life and shall also be liable to fine which shall not be less than ten lakh rupees or three times value of drugs.',
    what_it_means: 'Counterfeit medicines are a grave threat to public health. The Act mandates that collected fines are paid as compensation to victims or their families.',
    actions_covered: [
      'Manufacturing counterfeit antibiotics, painkillers, or pediatric cough syrups',
      'Selling expired medicines with forged manufacturing and expiry dates',
      'Operating unlicensed pharmacy counters or selling Schedule H/X drugs without doctor prescription'
    ],
    punishment: 'Imprisonment not less than 10 years, extending up to Life Imprisonment',
    fine: 'Not less than ₹10,00,000 (Ten Lakh Rupees) or 3 times the value of the drugs confiscated, whichever is more',
    imprisonment: '10 years to Life Imprisonment',
    other_consequences: 'Immediate cancellation of manufacturing drug license; confiscation of machinery, vehicles, and raw materials; publication of offender names in Official Gazette.',
    is_bailable: false,
    is_cognizable: true,
    court_triable: 'Special Designated Court (Court of Session)',
    exceptions: [
      'Retailers who purchased drugs from a licensed manufacturer with a valid warranty and stored them strictly under prescribed temperature conditions (Section 19 defense)'
    ],
    related_sections: [
      { section_number: 'Section 17B', act_name: 'Drugs and Cosmetics Act, 1940', title: 'Spurious drugs defined' },
      { section_number: 'Section 18', act_name: 'Drugs and Cosmetics Act, 1940', title: 'Prohibition of manufacture and sale' }
    ],
    related_acts: ['Bharatiya Nyaya Sanhita, 2023', 'National Medical Commission Act, 2019'],
    effective_date: 'Updated via Drugs and Cosmetics (Amendment) Act, 2008',
    source: 'Central Drugs Standard Control Organization (CDSCO), Ministry of Health & Family Welfare (cdsco.gov.in)',
    source_url: 'https://cdsco.gov.in/',
    last_updated: '2024-04-05',
    keywords: ['fake medicines', 'spurious drugs', 'pharmacy rules', 'health law', 'cdsco', 'section 27', 'medical law'],
    state_applicability: 'All India',
    target_audience: ['General Citizens', 'Consumers', 'Business Owners'],
    view_count: 5900
  },

  // 22. Human Rights Law: Protection of Human Rights Act 1993
  {
    id: 'phra-sec-12',
    act_name: 'Protection of Human Rights Act, 1993',
    short_act: 'Human Rights Act',
    section_number: 'Section 12 & 30',
    section_title: 'Functions of National Human Rights Commission (NHRC) & Human Rights Courts',
    category_id: 'human-rights-law',
    simple_explanation: 'Empowers the NHRC and State Human Rights Commissions to investigate complaints of human rights violations, custodial violence, police excess, or negligence by public servants, and establish special Human Rights Courts in every district.',
    official_text: 'The Commission shall perform all or any of the following functions, namely: inquire, suo motu or on a petition presented to it by a victim or any person on his behalf, into complaint of violation of human rights or abetment thereof; or negligence in the prevention of such violation, by a public servant.',
    what_it_means: 'NHRC has powers of a Civil Court trying a suit under Code of Civil Procedure. It can summon witnesses, examine documents, order monetary interim relief to victims, and direct criminal prosecution of guilty officials.',
    actions_covered: [
      'Police custodial torture, illegal handcuffs, or deaths in judicial/police custody',
      'Excessive force or extrajudicial encounter killings',
      'Denial of basic human dignity to prisoners or bonded laborers',
      'Systemic atrocity against marginalized scheduled castes or tribes'
    ],
    punishment: 'Commission recommends departmental prosecution of rogue officials and directs State Governments to pay compensation.',
    fine: 'Monetary compensation awarded to victim families (often ₹5 Lakh to ₹25 Lakhs per victim)',
    imprisonment: 'Recommends registration of criminal FIR against defaulting officers under BNS',
    other_consequences: 'Mandatory 24-hour reporting requirement for any death occurring in police or judicial custody.',
    is_bailable: null,
    is_cognizable: null,
    court_triable: 'National Human Rights Commission / State HRC / Special Human Rights Court in District',
    exceptions: [
      'Matters pending before any other statutory Commission (e.g. NCW, NCSC) or matters older than 1 year from the date of incident (Section 36)'
    ],
    related_sections: [
      { section_number: 'Article 21', act_name: 'Constitution of India', title: 'Right to Life and Personal Liberty' },
      { section_number: 'Section 36', act_name: 'Protection of Human Rights Act, 1993', title: 'Matters not subject to jurisdiction' }
    ],
    related_acts: ['Constitution of India', 'Bharatiya Nagarik Suraksha Sanhita, 2023'],
    effective_date: '8 January 1994 (Amended 2019)',
    source: 'National Human Rights Commission (NHRC), Govt of India (nhrc.nic.in)',
    source_url: 'https://nhrc.nic.in/',
    last_updated: '2024-01-18',
    keywords: ['human rights', 'nhrc', 'custodial violence', 'police excess', 'human rights commission', 'section 12'],
    state_applicability: 'All India',
    target_audience: ['General Citizens', 'Law Student / Advocate', 'Students'],
    view_count: 5100
  }
];

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

