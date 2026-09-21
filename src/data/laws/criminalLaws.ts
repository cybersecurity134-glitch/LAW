import { LawItem } from '../../types';

export const CRIMINAL_LAWS: LawItem[] = [
  // 1. Criminal Law: Section 103 BNS (Murder & Mob Lynching)
  {
    id: 'bns-sec-103',
    official_name: 'Bharatiya Nyaya Sanhita, 2023',
    act_name: 'Bharatiya Nyaya Sanhita, 2023 (BNS)',
    short_act: 'Bharatiya Nyaya Sanhita, 2023',
    short_description: 'Defines and prescribes capital punishment or life imprisonment for murder, including landmark statutory provisions against mob lynching.',
    simple_explanation: 'Defines and prescribes severe punishment for intentionally killing another person (murder). Also specifically penalizes mob lynching or murder committed by a group of five or more persons on grounds of race, caste, or religion.',
    year_enacted: 2023,
    sections: 'Section 103',
    section_number: 'Section 103',
    section_title: 'Punishment for Murder (Replaced Section 302 IPC)',
    sub_sections: [
      'Sub-section (1): Whoever commits murder shall be punished with death or imprisonment for life, and shall also be liable to fine',
      'Sub-section (2): When a group of five or more persons acting in concert commits murder on the ground of race, caste or community, sex, place of birth, language, personal belief or any other similar ground, each member of such group shall be punished with death or with imprisonment for life, and shall also be liable to fine'
    ],
    definitions: [
      {
        term: 'Murder',
        meaning: 'Culpable homicide where the act by which death is caused is done with the intention of causing death, or bodily injury known to be likely to cause death, or an act so imminently dangerous that it must in all probability cause death.'
      },
      {
        term: 'Mob Lynching',
        meaning: 'Murder committed by a group of five or more persons acting in concert on grounds of race, caste, community, sex, place of birth, language, or personal belief.'
      },
      {
        term: 'Culpable Homicide',
        meaning: 'Causing death by doing an act with the intention of causing death or bodily injury likely to cause death, or with the knowledge that it is likely to cause death.'
      }
    ],
    offences: [
      'Premeditated intentional killing of another human being',
      'Doing an act with the knowledge that it is so imminently dangerous that it must in all probability cause death',
      'Mob lynching committed by five or more persons based on caste, religion, community, or language',
      'Inflicting fatal injuries sufficient in ordinary course of nature to cause death'
    ],
    actions_covered: [
      'Premeditated intentional killing of another human being',
      'Doing an act with the knowledge that it is so imminently dangerous that it must in all probability cause death',
      'Mob lynching committed by five or more persons based on caste, religion, community, or language'
    ],
    penalties_fines: 'Death penalty or Imprisonment for Life, and mandatory judicial fine assessed by the Court of Session.',
    punishment: 'Death penalty or Imprisonment for Life',
    fine: 'Mandatory judicial fine assessed by the Court of Session',
    imprisonment: 'Life imprisonment (until natural death subject to remission rules) or Death sentence',
    consequences: [
      'Immediate non-bailable arrest, custodial interrogation, and remand under BNSS 2023',
      'Attachment and forfeiture of proceeds of crime and movable/immovable assets under Section 107 of BNSS 2023',
      'Permanent disqualification from public office and elections upon conviction',
      'Mandatory victim compensation ordered to next-of-kin under Section 396 of BNSS 2023'
    ],
    other_consequences: 'Civil disqualification, forfeiture of crime proceeds under BNSS 2023, permanent criminal record.',
    exceptions: [
      'Grave and sudden provocation without premeditation (culpable homicide not amounting to murder under Section 105 BNS)',
      'Right of private defence of body or property exercised within legal limits (Sections 34-44 BNS)',
      'Public servant acting in good faith for the advancement of public justice',
      'Sudden fight in the heat of passion upon a sudden quarrel without taking undue advantage'
    ],
    amendments: [
      'Bharatiya Nyaya Sanhita, 2023 (Act 45 of 2023): Repealed and replaced Section 302 of the Indian Penal Code, 1860; introduced historic sub-section (2) specifically penalizing mob lynching nationwide effective 1 July 2024'
    ],
    related_laws: [
      'Bharatiya Nyaya Sanhita, 2023 - Section 101 (Culpable homicide defined)',
      'Bharatiya Nyaya Sanhita, 2023 - Section 105 (Punishment for culpable homicide not amounting to murder)',
      'Bharatiya Nagarik Suraksha Sanhita, 2023 - Section 187 (Custody and remand)',
      'Indian Penal Code, 1860 - Section 302 (Repealed predecessor section)'
    ],
    current_status: 'In Force (Active - Enacted under Act 45 of 2023, in full effect nationwide since 1 July 2024)',
    category_id: 'criminal-law',
    official_text: '(1) Whoever commits murder shall be punished with death or imprisonment for life, and shall also be liable to fine. (2) When a group of five or more persons acting in concert commits murder on the ground of race, caste or community, sex, place of birth, language, personal belief or any other similar ground, each member of such group shall be punished with death or with imprisonment for life, and shall also be liable to fine.',
    what_it_means: 'Section 103 of BNS 2023 replaces the historic Section 302 of the Indian Penal Code (IPC). It sets the punishment for murder as capital punishment (death penalty) or life imprisonment. Sub-section (2) introduces a landmark provision specifically holding every member of a lynching mob strictly punishable with death or life imprisonment.',
    is_bailable: false,
    is_cognizable: true,
    court_triable: 'Court of Session',
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

  // 2. Criminal Law: Section 318 BNS (Cheating & Fraud)
  {
    id: 'bns-sec-318',
    official_name: 'Bharatiya Nyaya Sanhita, 2023',
    act_name: 'Bharatiya Nyaya Sanhita, 2023 (BNS)',
    short_act: 'Bharatiya Nyaya Sanhita, 2023',
    short_description: 'Punishes cheating, fraudulent deception, and dishonest inducement to deliver property, consolidating legacy IPC cheating provisions.',
    simple_explanation: 'Punishes anyone who dishonestly tricks someone into handing over money, property, or valuable security, or induces someone to do something they would not have done if they had not been deceived.',
    year_enacted: 2023,
    sections: 'Section 318',
    section_number: 'Section 318',
    section_title: 'Cheating (Replaced Section 415 & 420 IPC)',
    sub_sections: [
      'Sub-section (1): Deceiving any person and fraudulently or dishonestly inducing delivery of property or consent to retain property',
      'Sub-section (2): Punishment for simple cheating - Imprisonment up to three years, or fine, or both',
      'Sub-section (3): Cheating with knowledge of wrongful loss to protected party - Imprisonment up to five years, or fine, or both',
      'Sub-section (4): Cheating and dishonestly inducing delivery of property or valuable security - Imprisonment up to seven years and fine'
    ],
    definitions: [
      {
        term: 'Cheating',
        meaning: 'Deceiving any person fraudulently or dishonestly to induce delivery of property or intentionally inducing a person to do or omit to do anything which causes damage or harm in body, mind, reputation, or property.'
      },
      {
        term: 'Valuable Security',
        meaning: 'A document whereby any legal right is created, extended, transferred, restricted, extinguished, or released.'
      },
      {
        term: 'Fraudulently',
        meaning: 'Doing a thing with intent to defraud, but not otherwise.'
      }
    ],
    offences: [
      'Financial scams, Ponzi schemes, and fraudulent investment promises',
      'Selling fake goods or counterfeit gold while claiming authenticity',
      'Selling someone else\'s land using forged title deeds',
      'Inducing delivery of money or assets on false pretexts'
    ],
    actions_covered: [
      'Financial scams, Ponzi schemes, and fraudulent investment promises',
      'Selling fake goods or counterfeit gold while claiming authenticity',
      'Selling someone else\'s land using forged title deeds',
      'Inducing delivery of money on false pretexts'
    ],
    penalties_fines: 'Simple cheating: up to 3 years imprisonment and/or fine. Cheating with delivery of property (Sub-section 4): up to 7 years imprisonment and mandatory fine.',
    punishment: 'Simple cheating: up to 3 years imprisonment. Cheating with delivery of property: up to 7 years imprisonment.',
    fine: 'Fine as determined by the trial court',
    imprisonment: 'Up to 7 years',
    consequences: [
      'Freezing of bank accounts and attachment of criminal proceeds under Section 107 of BNSS 2023',
      'Court-ordered restitution of stolen money or property to victims',
      'Issuance of Look Out Circulars (LOC) preventing foreign travel',
      'Commercial credit and directorship disqualification'
    ],
    other_consequences: 'Restitution of stolen money/property to victim under BNSS 2023; attachment of bank accounts.',
    exceptions: [
      'Pure civil breach of contract where there was no deceptive intent at the start of agreement',
      'Customary sales puffery that does not amount to fraudulent misrepresentation of material fact'
    ],
    amendments: [
      'Bharatiya Nyaya Sanhita, 2023 (Act 45 of 2023): Repealed and consolidated Sections 415, 417, 418, and 420 of the Indian Penal Code, 1860 into Section 318 effective 1 July 2024'
    ],
    related_laws: [
      'Bharatiya Nyaya Sanhita, 2023 - Section 319 (Cheating by personation)',
      'Bharatiya Nyaya Sanhita, 2023 - Section 336 (Forgery)',
      'Bharatiya Nagarik Suraksha Sanhita, 2023 - Section 107 (Attachment of property obtained via crime)',
      'Indian Penal Code, 1860 - Section 420 (Repealed predecessor section)'
    ],
    current_status: 'In Force (Active - Enacted under Act 45 of 2023, in full effect nationwide since 1 July 2024)',
    category_id: 'criminal-law',
    official_text: 'Whoever, by deceiving any person, fraudulently or dishonestly induces the person so deceived to deliver any property to any person, or to consent that any person shall retain any property... shall be punished with imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine.',
    what_it_means: 'Section 318 combines and simplifies the cheating provisions previously scattered across Sections 415, 417, and 420 of the Indian Penal Code. Fraudulent intent at the inception of the transaction is key.',
    is_bailable: false,
    is_cognizable: true,
    court_triable: 'Magistrate of the First Class',
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

  // 3. Evidence & Procedure: Section 173 BNSS (Zero FIR & e-FIR)
  {
    id: 'bnss-sec-173',
    official_name: 'Bharatiya Nagarik Suraksha Sanhita, 2023',
    act_name: 'Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)',
    short_act: 'Bharatiya Nagarik Suraksha Sanhita, 2023',
    short_description: 'Establishes the statutory right to register a Zero FIR at any police station across India irrespective of jurisdiction, introduces e-FIR, and protects victim rights.',
    simple_explanation: 'Allows any crime victim to register a Police FIR at ANY police station regardless of jurisdiction (known as Zero FIR), and legally introduces e-FIR (filing complaints online or via electronic communication).',
    year_enacted: 2023,
    sections: 'Section 173',
    section_number: 'Section 173',
    section_title: 'Information in Cognizable Cases (Mandatory Zero FIR & Electronic FIR - Replaced Sec 154 CrPC)',
    sub_sections: [
      'Sub-section (1): Information of cognizable offence, irrespective of the area where committed (Zero FIR), may be given orally or by electronic communication (e-FIR)',
      'Sub-section (1) Proviso (i): Electronic communication (e-FIR) shall be taken on record by police on being signed within three days by the person giving it',
      'Sub-section (1) Proviso (ii): Statement of female victim of sexual offences shall be recorded by a woman police officer at the residence of the victim',
      'Sub-section (2): A copy of the FIR shall be given forthwith, free of cost, to the informant or victim',
      'Sub-section (3): Preliminary enquiry up to 14 days permitted in offences punishable between 3 and 7 years with prior permission of Deputy SP'
    ],
    definitions: [
      {
        term: 'Zero FIR',
        meaning: 'An FIR registered by a police station regardless of whether the crime occurred within its territorial jurisdiction, which is numbered as "0" and transferred immediately to the competent police station after initial preservation of evidence.'
      },
      {
        term: 'Electronic FIR (e-FIR)',
        meaning: 'Information of a cognizable offence submitted electronically through digital portal, email, or citizen app, formalized upon signature within three days.'
      },
      {
        term: 'Cognizable Offence',
        meaning: 'An offence for which a police officer may arrest without warrant and initiate investigation without Magistrate order.'
      }
    ],
    offences: [
      'Police officer refusing to register an FIR for a cognizable crime citing territorial jurisdiction or local boundary excuses',
      'Failing to provide a free copy of the registered FIR immediately to the complainant or informant',
      'Refusing to record the statement of a female victim of sexual offence at her residence or by a female officer',
      'Demanding bribes or unlawful gratification to register complaints'
    ],
    actions_covered: [
      'Registering an FIR at the nearest police station while traveling away from home',
      'Submitting cyber crime, theft, or assault complaints via e-mail or state citizen portal (e-FIR)',
      'Mandatory recording of statements of female victims by a woman police officer at the victim\'s residence'
    ],
    penalties_fines: 'Defaulting police officers face criminal prosecution under Section 199 BNS (imprisonment up to 2 years and fine); departmental disciplinary suspension.',
    punishment: 'A police officer who willfully refuses to register an FIR in cognizable crimes faces up to 2 years imprisonment under Section 199 BNS (earlier Section 166A IPC).',
    fine: 'Fine on defaulting police officer',
    imprisonment: 'Up to 2 years for police officer refusing registration',
    consequences: [
      'Statutory right of aggrieved citizen to escalate complaint to Superintendent of Police (SP) under Section 173(4)',
      'Right to approach Judicial Magistrate under Section 175(3) for court-directed investigation',
      'Immediate digital transmission of FIR to the jurisdictional Magistrate within 24 hours via CCTNS / ICJS system',
      'Compulsory video recording and forensic evidence collection mandated for serious offences'
    ],
    other_consequences: 'Free copy of FIR must be given immediately to the complainant or informant.',
    exceptions: [
      'Preliminary enquiry allowed for up to 14 days in offences punishable between 3 and 7 years with prior approval of Deputy SP rank officer to verify prima facie validity',
      'Non-cognizable complaints are registered in Non-Cognizable Report (NCR) diary requiring Magistrate warrant to investigate'
    ],
    amendments: [
      'Bharatiya Nagarik Suraksha Sanhita, 2023 (Act 46 of 2023): Repealed and replaced the Code of Criminal Procedure, 1973 (CrPC); codified statutory Zero FIR and electronic FIR effective 1 July 2024'
    ],
    related_laws: [
      'Code of Criminal Procedure, 1973 - Section 154 (Repealed predecessor section)',
      'Bharatiya Nyaya Sanhita, 2023 - Section 199 (Public servant disobeying law)',
      'Bharatiya Sakshya Adhiniyam, 2023 - Section 63 (Admissibility of electronic records)'
    ],
    current_status: 'In Force (Active - Enacted under Act 46 of 2023, fully operational nationwide since 1 July 2024)',
    category_id: 'evidence-procedure',
    official_text: '(1) Every information relating to the commission of a cognizable offence, irrespective of the area where the offence is committed may be given orally or by electronic communication to an officer in charge of a police station... Provided that if the information is given by electronic communication, it shall be taken on record by him on being signed within three days by the person giving it.',
    what_it_means: 'Section 173 of BNSS 2023 gives statutory backing to "Zero FIR" which was previously only a judicial guideline. Police officers CANNOT refuse to register an FIR claiming that the incident happened outside their police station limits. They must register, provide emergency aid, and transfer the case.',
    is_bailable: true,
    is_cognizable: false,
    court_triable: 'Judicial Magistrate having territorial jurisdiction',
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

  // 4. Family & Personal Law: Protection of Women from Domestic Violence Act, 2005 (PWDVA Section 12)
  {
    id: 'pwdva-sec-12',
    official_name: 'Protection of Women from Domestic Violence Act, 2005',
    act_name: 'Protection of Women from Domestic Violence Act, 2005',
    short_act: 'Domestic Violence Act',
    short_description: 'Provides an emergency judicial shield and multi-faceted civil-cum-penal remedies to women facing physical, emotional, sexual, or economic domestic abuse in shared households.',
    simple_explanation: 'Provides an immediate legal shield to any woman living in a shared household who faces physical abuse, verbal insult, emotional torture, sexual harassment, or economic denial by relatives.',
    year_enacted: 2005,
    sections: 'Section 12',
    section_number: 'Section 12',
    section_title: 'Application to Magistrate for Protection, Residence, Monetary Relief & Custody Orders',
    sub_sections: [
      'Sub-section (1): Application to Magistrate by an aggrieved person, Protection Officer, or authorized representative seeking reliefs under the Act',
      'Sub-section (2): Relief may include claims for compensatory damages without prejudice to rights under other civil or criminal laws',
      'Sub-section (4): Magistrate shall fix the first date of hearing which shall not ordinarily exceed three days from the date of receipt of application',
      'Sub-section (5): Magistrate shall endeavor to dispose of every application within a period of sixty days from the date of its first hearing'
    ],
    definitions: [
      {
        term: 'Domestic Violence',
        meaning: 'Any act, omission, or conduct that harms, injures, or endangers the health, safety, life, limb, or well-being of the aggrieved woman, including physical, sexual, verbal, emotional, and economic abuse.'
      },
      {
        term: 'Shared Household',
        meaning: 'A household where the person aggrieved lives or at any stage has lived in a domestic relationship either singly or along with the respondent (irrespective of ownership).'
      },
      {
        term: 'Protection Order',
        meaning: 'An injunction passed under Section 18 prohibiting the respondent from committing acts of violence, entering the workplace, or contacting the aggrieved person.'
      }
    ],
    offences: [
      'Physical battery, slapping, kicking, or domestic assault',
      'Verbal abuse, continuous insults, name-calling, or dowry harassment',
      'Economic deprivation (not providing money for food, medicine, or children\'s education)',
      'Forcibly evicting or locking out a woman from her shared matrimonial residence'
    ],
    actions_covered: [
      'Physical battery, slapping, or domestic violence',
      'Verbal abuse, insults, name-calling, or dowry harassment',
      'Economic deprivation (not giving money for food, medicine, or children education)',
      'Forcibly evicting a woman from her shared matrimonial residence'
    ],
    penalties_fines: 'Breach of protection order (Section 31): Imprisonment of either description up to 1 year and/or fine up to ₹20,000; non-payment of maintenance triggers civil jail.',
    punishment: 'Breach of a protection order passed by Magistrate is a criminal offence punishable with imprisonment up to 1 year and/or fine up to ₹20,000 under Section 31.',
    fine: 'Fine up to ₹20,000 for breaching protection order; monetary maintenance and compensation determined by court',
    imprisonment: 'Up to 1 year for violation of protection order',
    consequences: [
      'Immediate ex-parte restraining and residence orders preventing respondent from alienating or entering the matrimonial home',
      'Appointment and direct intervention of court-designated Protection Officers and Service Providers',
      'Attachment of respondent\'s monthly salary or bank account for direct payment of interim monetary maintenance',
      'Right to secure residence in government-supported shelter homes and access to free legal aid'
    ],
    other_consequences: 'Immediate police intervention, appointment of Protection Officer, right to shelter homes and free legal aid.',
    exceptions: [
      'Proceedings are civil in origin to provide relief and protection; penal sanctions activate when a court order is willfully violated',
      'Bona fide domestic disputes without harassment or coercive intent (requires evidentiary proof before Magistrate)'
    ],
    amendments: [
      'Hiralal P. Harsora v. Kusum Harsora (2016) Supreme Court Landmark: Struck down the words "adult male" in Section 2(q), allowing domestic violence complaints to be filed against female relatives as well',
      'Satish Chander Ahuja v. Sneha Ahuja (2020) Supreme Court: Expanded right of residence in shared households even if owned by in-laws'
    ],
    related_laws: [
      'Bharatiya Nyaya Sanhita, 2023 - Section 85 & 86 (Cruelty by husband or relatives - Earlier Section 498A IPC)',
      'Protection of Women from Domestic Violence Act, 2005 - Section 18 (Protection orders)',
      'Protection of Women from Domestic Violence Act, 2005 - Section 19 (Residence orders)',
      'Family Courts Act, 1984'
    ],
    current_status: 'In Force (Active - Enforced nationwide with fast-track hearings before Judicial Magistrates)',
    category_id: 'family-personal-law',
    official_text: 'An aggrieved person or a Protection Officer or any other person on behalf of the aggrieved person may present an application to the Magistrate seeking one or more reliefs under this Act, including protection orders, residence orders, monetary relief, and custody orders.',
    what_it_means: 'This civil-cum-quasi-criminal enactment ensures women cannot be thrown out of their matrimonial home (Right to Reside). The Magistrate must hold the first hearing within 3 days of filing and can pass ex-parte emergency injunction orders.',
    is_bailable: false,
    is_cognizable: true,
    court_triable: 'Judicial Magistrate of First Class / Metropolitan Magistrate',
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

  // 5. Labour & Employment Law: POSH Act, 2013 (Section 3 & 4)
  {
    id: 'posh-act-sec-3',
    official_name: 'Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013',
    act_name: 'Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013',
    short_act: 'POSH Act, 2013',
    short_description: 'Prohibits workplace sexual harassment and mandates every organization with ten or more employees to constitute an Internal Committee (IC) with strict fines for employer non-compliance.',
    simple_explanation: 'Mandates every workplace with 10 or more employees to set up an Internal Committee (IC) to address sexual harassment complaints, ensuring safe working conditions for all women employees.',
    year_enacted: 2013,
    sections: 'Sections 3 & 4',
    section_number: 'Section 3 & 4',
    section_title: 'Prevention of Sexual Harassment & Constitution of Internal Committee (IC)',
    sub_sections: [
      'Section 3(1): General Prohibition - No woman shall be subjected to sexual harassment at any workplace',
      'Section 3(2): Circumstances amounting to sexual harassment (implied/explicit promise of preferential treatment, threat of detrimental treatment, or creating an intimidating hostile environment)',
      'Section 4(1): Mandatory Constitution - Every employer shall constitute an Internal Committee (IC) by order in writing',
      'Section 4(2): Composition - Presiding officer must be a senior woman employee, not less than two members committed to women causes, and one independent external member from an NGO'
    ],
    definitions: [
      {
        term: 'Sexual Harassment',
        meaning: 'Unwelcome physical contact and advances, demand or request for sexual favors, making sexually colored remarks, showing pornography, or any other unwelcome physical, verbal, or non-verbal conduct of a sexual nature.'
      },
      {
        term: 'Aggrieved Woman',
        meaning: 'In relation to a workplace, a woman of any age, whether employed or not, who alleges to have been subjected to any act of sexual harassment by the respondent.'
      },
      {
        term: 'Workplace',
        meaning: 'Any department, enterprise, institution, establishment, office, sports complex, factory, private firm, hospital, or any place visited by the employee during the course of employment, including transportation provided by employer.'
      }
    ],
    offences: [
      'Physical contact and advances, or sexually colored remarks',
      'Demand or request for sexual favors under promise of promotion or threat of termination (Quid Pro Quo)',
      'Creating a hostile, intimidating, or offensive work environment',
      'Showing pornography or sending unsolicited explicit messages to colleagues',
      'Employer failing to constitute an Internal Committee or failing to act upon its inquiry report'
    ],
    actions_covered: [
      'Physical contact and advances, or sexually colored remarks',
      'Demand or request for sexual favors under promise of promotion or threat of termination (Quid Pro Quo)',
      'Creating a hostile, intimidating, or offensive work environment',
      'Showing pornography or sending unsolicited explicit messages to colleagues'
    ],
    penalties_fines: 'Employer non-compliance: Fine of ₹50,000 for first offence; repeated violation leads to double fine (₹1,00,000) and cancellation of business registration or statutory license.',
    punishment: 'For employer failing to constitute IC: Fine of ₹50,000; repeated violation leads to double fine and cancellation of business registration or statutory license.',
    fine: '₹50,000 for first employer violation; up to ₹1,00,000 for repeated breach',
    imprisonment: 'Disciplinary service termination for respondent under service rules; criminal charges under BNS Section 75/78.',
    consequences: [
      'Disciplinary action against respondent including warning, withholding promotion, suspension, or termination of employment',
      'Direct deduction of monetary compensation from respondent\'s salary payable to the aggrieved woman',
      'Parallel criminal prosecution of accused under Section 75 of Bharatiya Nyaya Sanhita, 2023',
      'Mandatory annual filing of POSH compliance data with District Officer and in company\'s Annual Board Report'
    ],
    other_consequences: 'Withholding of promotion, deduction of compensation amount from salary for complainant, civil court liability.',
    exceptions: [
      'Malicious or false complaints proven with clear evidence allow internal committee to recommend action against complainant, but failure to prove does not imply malicious intent',
      'Consensual personal relationships between colleagues that do not involve workplace coercion or hostile environment'
    ],
    amendments: [
      'Aureliano Fernandes v. State of Goa (2023) Supreme Court Ruling: Directed all Union and State Governments, statutory bodies, and private institutions to conduct time-bound POSH audit and compliance certification',
      'Ministry of Corporate Affairs Notification: Made disclosure of constitution of Internal Committee mandatory in the Directors\' Report of all companies under Section 134 of Companies Act, 2013'
    ],
    related_laws: [
      'Bharatiya Nyaya Sanhita, 2023 - Section 75 (Sexual harassment)',
      'Bharatiya Nyaya Sanhita, 2023 - Section 78 (Stalking)',
      'Constitution of India - Articles 14, 15, 19(1)(g), and 21',
      'Industrial Disputes Act, 1947 / Code on Wages, 2019'
    ],
    current_status: 'In Force (Active - Mandatorily enforced across all public and private workplaces across India)',
    category_id: 'labour-employment-law',
    official_text: 'No woman shall be subjected to sexual harassment at any workplace... Every employer of a workplace shall, by an order in writing, constitute a Committee to be known as the Internal Committee.',
    what_it_means: 'Applies to organized and unorganized sectors, private companies, IT hubs, factories, hospitals, and educational institutions. An employer who fails to constitute an Internal Committee faces government fines and cancellation of business license.',
    is_bailable: true,
    is_cognizable: false,
    court_triable: 'Internal Committee / Local Complaints Committee / Judicial Magistrate',
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
  }
];
