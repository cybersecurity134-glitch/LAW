import { LawItem } from '../../types';

export const CYBER_TECH_LAWS: LawItem[] = [
  // 1. Cyber Law: Section 66D IT Act (Online Cheating by Personation)
  {
    id: 'it-act-sec-66d',
    official_name: 'Information Technology Act, 2000',
    act_name: 'Information Technology Act, 2000',
    short_act: 'IT Act, 2000',
    short_description: 'Prohibits and punishes cyber impersonation, deceptive online identity creation, phishing scams, and OTP theft via digital communication devices.',
    simple_explanation: 'This law punishes anyone who deceives or cheats another person online by pretending to be someone else using a mobile phone, computer, or the internet (such as fake profiles, phishing emails, OTP theft, or fraudulent customer care numbers).',
    year_enacted: 2000,
    sections: 'Section 66D',
    section_number: 'Section 66D',
    section_title: 'Punishment for Cheating by Personation by Using Computer Resource',
    sub_sections: [
      'Operative Clause: Whoever, by means of any communication device or computer resource cheats by personating',
      'Penal Provision: Shall be punished with imprisonment of either description for a term which may extend to three years and shall also be liable to fine which may extend to one lakh rupees'
    ],
    definitions: [
      {
        term: 'Cheating by Personation',
        meaning: 'A person is said to cheat by personating if he cheats by pretending to be some other person, or knowingly substituting one person for another, or representing that he or any other person is someone other than who they really are.'
      },
      {
        term: 'Communication Device',
        meaning: 'Cell phones, personal digital assistants (PDAs), tablets, or any other device used to transmit text, video, audio, or image.'
      },
      {
        term: 'Computer Resource',
        meaning: 'Computer, computer system, computer network, data, computer database, or software.'
      }
    ],
    offences: [
      'Pretending to be bank staff, telecom agents, or electricity board officials to steal OTPs and net-banking credentials (Phishing)',
      'Creating fake social media or job recruitment profiles to extract money under false pretenses',
      'Using spoofed caller IDs, voice cloners, or fake URLs mimicking authentic portals to induce wire transfers',
      'Digital arrest scams impersonating police, CBI, ED, or customs officers'
    ],
    actions_covered: [
      'Pretending to be bank staff to steal OTPs or net-banking passwords',
      'Creating fake matrimonial or job recruitment profiles to extract money',
      'Using spoofed caller IDs or domain names to cheat victims (Phishing)',
      'Impersonating public servants or law enforcement officers in digital extortion scams'
    ],
    penalties_fines: 'Imprisonment of either description for up to 3 years and/or fine up to ₹1,00,000 (One Lakh Rupees).',
    punishment: 'Imprisonment of either description for up to 3 years',
    fine: 'Fine up to ₹1,00,000 (One Lakh Rupees)',
    imprisonment: 'Up to 3 years',
    consequences: [
      'Immediate confiscation and forensic seizure of digital devices used under Section 76 of IT Act',
      'Police freezing of linked bank accounts, UPI IDs, and payment gateway merchant accounts',
      'Mandatory domain name and phone number blocking via DoT and Sanchar Saathi portal',
      'Permanent criminal record impacting government job clearances, passport renewals, and visa clearances'
    ],
    other_consequences: 'Confiscation of digital devices used in the offence under Section 76 of IT Act; police seizure of linked bank accounts and domain names.',
    exceptions: [
      'Legitimate parody, satire, theatrical portrayal, or comedic caricature without dishonest intent to cause wrongful loss or gain',
      'Authorized penetration testing and cybersecurity research conducted under registered written contract with consent'
    ],
    amendments: [
      'Information Technology (Amendment) Act, 2008 (Act 10 of 2009): Inserted Section 66D effective 27 October 2009 to explicitly penalize cyber phishing and digital impersonation',
      'Harmonized procedural coordination with Bharatiya Nagarik Suraksha Sanhita (BNSS 2023) electronic evidence mandates effective 1 July 2024'
    ],
    related_laws: [
      'Bharatiya Nyaya Sanhita, 2023 - Section 318 (Cheating)',
      'Bharatiya Nyaya Sanhita, 2023 - Section 319 (Cheating by personation)',
      'Information Technology Act, 2000 - Section 43 (Penalty for damage to computer system)',
      'Information Technology Act, 2000 - Section 66C (Identity theft)',
      'Bharatiya Sakshya Adhiniyam, 2023 - Section 61 (Admissibility of electronic records)'
    ],
    current_status: 'In Force (Active - Enforced by State Cyber Police Stations and 1930 National Cybercrime Reporting Portal)',
    category_id: 'cyber-law-it',
    official_text: 'Whoever, by means for any communication device or computer resource cheats by personating, shall be punished with imprisonment of either description for a term which may extend to three years and shall also be liable to fine which may extend to one lakh rupees.',
    what_it_means: 'Online impersonation for fraud is a distinct statutory offence under Indian Cyber Law. If someone creates a fake bank executive account, uses a cloned social media profile, or sends spoofed messages to obtain money or sensitive credentials, they commit an offence under Section 66D.',
    is_bailable: false,
    is_cognizable: true,
    court_triable: 'Any Magistrate / Chief Judicial Magistrate',
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

  // 2. Cyber Law: Section 66 IT Act (Hacking & Data Tampering)
  {
    id: 'it-act-sec-66',
    official_name: 'Information Technology Act, 2000',
    act_name: 'Information Technology Act, 2000',
    short_act: 'IT Act, 2000',
    short_description: 'Criminalizes unauthorized access, hacking, data destruction, ransomware insertion, and system tampering committed dishonestly or fraudulently.',
    simple_explanation: 'If anyone dishonestly or fraudulently accesses, alters, deletes, or damages another person\'s computer, website, phone data, or network without permission, they are guilty of computer-related crime.',
    year_enacted: 2000,
    sections: 'Section 66',
    section_number: 'Section 66',
    section_title: 'Computer Related Offences (Hacking, Unauthorized Access & Data Tampering)',
    sub_sections: [
      'Operative Clause: If any person, dishonestly or fraudulently, does any act referred to in section 43',
      'Penal Provision: Punishable with imprisonment for a term which may extend to three years or with fine which may extend to five lakh rupees or with both'
    ],
    definitions: [
      {
        term: 'Computer Contaminant',
        meaning: 'Any set of computer instructions designed to modify, destroy, record, or transmit data or system resources without authorization (includes viruses, trojans, worms, ransomware).'
      },
      {
        term: 'Unauthorized Access',
        meaning: 'Gaining entry into a computer system, network, or cloud resource without the consent of the owner or person in lawful charge.'
      },
      {
        term: 'Dishonestly',
        meaning: 'Doing anything with the intention of causing wrongful gain to one person or wrongful loss to another person.'
      }
    ],
    offences: [
      'Hacking into private email, corporate cloud servers, or institutional databases without authorization',
      'Injecting ransomware, trojans, or spyware into computers to lock or steal records',
      'Defacing websites or deleting institutional customer records',
      'Denial of Service (DoS) and Distributed DoS (DDoS) attacks targeting network infrastructure'
    ],
    actions_covered: [
      'Unauthorized access into email, social media, or company server accounts',
      'Injecting ransomware, viruses, or spyware into computers',
      'Defacing websites or deleting institutional databases',
      'Denial of Service (DoS) attacks targeting public or private infrastructure'
    ],
    penalties_fines: 'Imprisonment up to 3 years, or fine up to ₹5,00,000 (Five Lakh Rupees), or both.',
    punishment: 'Imprisonment up to 3 years, or fine, or both',
    fine: 'Fine up to ₹5,00,000 (Five Lakh Rupees)',
    imprisonment: 'Up to 3 years',
    consequences: [
      'Parallel civil compensation proceedings up to ₹5 Crores before State IT Secretary (Adjudicating Officer)',
      'Forensic seizure of computing hardware, hard drives, and electronic media under Section 76',
      'Mandatory reporting to CERT-In (Indian Computer Emergency Response Team) within 6 hours by affected entities',
      'Ineligibility for government IT sector tenders and security clearances'
    ],
    other_consequences: 'Civil compensation damages up to ₹5 Crores under Section 43 adjudication before State IT Secretary.',
    exceptions: [
      'Authorized ethical hacking or vulnerability assessment conducted under signed contract with NDA',
      'Emergency remedial actions taken by CERT-In or designated cybersecurity authorities under Section 70B',
      'Accidental access where immediate sign-off occurred without viewing, copying, or altering any data'
    ],
    amendments: [
      'Information Technology (Amendment) Act, 2008: Substituted Section 66 to link criminal culpability directly to the civil contraventions under Section 43 with dishonest/fraudulent mens rea',
      'Digital Personal Data Protection Act, 2023: Introduced complementary civil penalties up to ₹250 Crores for personal data breaches'
    ],
    related_laws: [
      'Information Technology Act, 2000 - Section 43 (Civil liability for unauthorized access)',
      'Information Technology Act, 2000 - Section 66F (Cyber terrorism)',
      'Digital Personal Data Protection Act, 2023',
      'Bharatiya Nyaya Sanhita, 2023 - Section 316 (Criminal breach of trust)'
    ],
    current_status: 'In Force (Active - Enforced by State Cyber Police Stations and CERT-In)',
    category_id: 'cyber-law-it',
    official_text: 'If any person, dishonestly or fraudulently, does any act referred to in section 43, he shall be punishable with imprisonment for a term which may extend to three years or with fine which may extend to five lakh rupees or with both.',
    what_it_means: 'Section 66 criminalizes civil violations listed in Section 43 when done with dishonest or fraudulent intent. This covers unauthorized digital entry, introducing malware or ransomware, extracting source code, and denying services to authorized users.',
    is_bailable: true,
    is_cognizable: true,
    court_triable: 'Metropolitan Magistrate or Judicial Magistrate First Class',
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

  // 3. Intellectual Property: Copyright Act, 1957 (Sections 51 & 63)
  {
    id: 'copyright-sec-51',
    official_name: 'Copyright Act, 1957',
    act_name: 'Copyright Act, 1957',
    short_act: 'Copyright Act',
    short_description: 'Protects original creative works and criminalizes unauthorized reproduction, distribution, piracy, software duplication, and public broadcasting.',
    simple_explanation: 'Protects original creative works (music, software code, movies, books, artistic paintings). Making pirated copies, distributing unauthorized digital streams, or using copyrighted content commercially without a license is a criminal offence.',
    year_enacted: 1957,
    sections: 'Sections 51 & 63',
    section_number: 'Section 51 & 63',
    section_title: 'When Copyright Infringed & Offences of Infringement of Copyright',
    sub_sections: [
      'Section 51(a)(i): Doing anything, the exclusive right to do which is conferred upon the copyright owner, without a valid license',
      'Section 51(b): Making for sale or hire, or commercially distributing infringing copies of the work',
      'Section 63 Base Penalty: Imprisonment not less than six months extending to three years and fine not less than ₹50,000 extending to ₹2,00,000',
      'Section 63 Proviso (Repeat Offences): Enhanced imprisonment from one to three years and fine from ₹1,00,000 to ₹2,00,000'
    ],
    definitions: [
      {
        term: 'Copyright',
        meaning: 'The exclusive statutory right to do or authorize the doing of acts in respect of literary, dramatic, musical, artistic works, cinematograph films, and sound recordings.'
      },
      {
        term: 'Infringing Copy',
        meaning: 'Reproduction of a literary, dramatic, musical, artistic work, sound recording, or cinematograph film made in contravention of the provisions of the Act.'
      },
      {
        term: 'Fair Dealing',
        meaning: 'Statutory non-infringing exceptions for private use, research, criticism, review, and reporting of current events under Section 52.'
      }
    ],
    offences: [
      'Operating unauthorized digital movie streaming websites or torrent portals (Digital Piracy)',
      'Copying, reverse engineering, or commercially distributing proprietary software computer code without valid license',
      'Publishing duplicate or plagiarized textbooks and academic course materials for commercial gain',
      'Broadcasting copyrighted sporting events, live concerts, or music tracks in commercial venues without public performance license'
    ],
    actions_covered: [
      'Operating unauthorized movie piracy websites or torrent links (Camcording/Torrents)',
      'Copying and selling commercial software code or proprietary video games without license',
      'Publishing duplicate or plagiarized textbooks and course materials for commercial profit',
      'Broadcasting copyrighted sports matches or music concerts without broadcast rights'
    ],
    penalties_fines: 'Imprisonment not less than 6 months and up to 3 years, and fine between ₹50,000 to ₹2,00,000 (minimum 1 year jail and ₹1 Lakh fine for repeat conviction).',
    punishment: 'Imprisonment not less than 6 months and up to 3 years',
    fine: 'Fine between ₹50,000 to ₹2,00,000 (can be higher for repeat offenders)',
    imprisonment: '6 months to 3 years',
    consequences: [
      'Police power to seize infringing copies, recording equipment, and servers without warrant under Section 64',
      'High Court dynamic "John Doe" (Ashok Kumar) injunctions ordering ISPs to block piracy domain mirrors',
      'Anton Piller search orders and civil asset freezing of pirate operators',
      'Destruction and forfeiture of pirated merchandise and physical inventory'
    ],
    other_consequences: 'Police seizure of infringing copies, recording equipment, and website domain blocking under John Doe court orders.',
    exceptions: [
      'Fair dealing for private and personal use, research, criticism, review, or reporting current events (Section 52)',
      'Educational use by teachers or students in course of classroom instruction',
      'Making back-up copies of legally acquired computer software for personal archival use under Section 52(1)(aa)'
    ],
    amendments: [
      'Copyright (Amendment) Act, 2012: Brought Indian copyright law into compliance with WIPO Internet Treaties (WCT/WPPT); protected performer and author royalty rights',
      'Cinematograph (Amendment) Act, 2023: Introduced strict anti-camcording provisions penalizing unauthorized film recording in cinema halls with up to 3 years imprisonment'
    ],
    related_laws: [
      'Copyright Act, 1957 - Section 52 (Fair dealing exceptions)',
      'Copyright Act, 1957 - Section 64 (Power of police to seize infringing copies)',
      'Information Technology Act, 2000 - Section 79 (Intermediary liability safe harbor)',
      'Cinematograph Act, 1952 (Amended 2023)'
    ],
    current_status: 'In Force (Active - Enforced nationwide through specialized Intellectual Property Rights (IPR) police cells and High Courts)',
    category_id: 'intellectual-property-law',
    official_text: 'Any person who knowingly infringes or abets the infringement of the copyright in a work, or any other right conferred by this Act, shall be punishable with imprisonment for a term which shall not be less than six months but which may extend to three years and with fine which shall not be less than fifty thousand rupees but which may extend to two lakh rupees.',
    what_it_means: 'Copyright infringement in India is both a civil tort and a cognizable criminal offence. Police have power to seize pirated materials and servers without an arrest warrant upon complaint by copyright owner.',
    is_bailable: false,
    is_cognizable: true,
    court_triable: 'Court of Session / Chief Judicial Magistrate',
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
  }
];
