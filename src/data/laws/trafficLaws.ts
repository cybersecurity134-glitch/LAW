import { LawItem } from '../../types';

export const TRAFFIC_LAWS: LawItem[] = [
  // 1. Motor Vehicle: Section 185 MVA (Drunk Driving)
  {
    id: 'mva-sec-185',
    official_name: 'Motor Vehicles Act, 1988',
    act_name: 'Motor Vehicles Act, 1988 (Amended 2019)',
    short_act: 'Motor Vehicles Act',
    short_description: 'Strictly prohibits driving or attempting to drive a motor vehicle with blood alcohol content exceeding 30 mg per 100 ml of blood or while impaired by drugs.',
    simple_explanation: 'Prohibits driving or attempting to drive any motor vehicle if your blood alcohol level exceeds 30 mg per 100 ml of blood detected by a breath analyser test, or while under the influence of narcotics.',
    year_enacted: 1988,
    sections: 'Section 185',
    section_number: 'Section 185',
    section_title: 'Driving by a Drunken Person or by a Person Under the Influence of Drugs',
    sub_sections: [
      'Clause (a): Blood alcohol level exceeding 30 mg per 100 ml of blood detected via breath analyser test or laboratory test',
      'Clause (b): Under the influence of a drug to such an extent as to be incapable of exercising proper control over the vehicle',
      'Clause (i): First offence penalty scale (jail up to 6 months and/or fine ₹10,000)',
      'Clause (ii): Second or subsequent offence within 3 years (jail up to 2 years and/or fine ₹15,000)'
    ],
    definitions: [
      {
        term: 'Blood Alcohol Content (BAC)',
        meaning: 'The concentration of alcohol in a person\'s bloodstream measured in milligrams of alcohol per 100 milliliters of blood; statutory threshold is 30 mg/100 ml.'
      },
      {
        term: 'Breath Analyser Test',
        meaning: 'A roadside breath screening test conducted by an authorized police officer under Section 203 of MVA to indicate alcohol presence.'
      },
      {
        term: 'Motor Vehicle',
        meaning: 'Any mechanically propelled vehicle adapted for use upon roads, including two-wheelers, four-wheelers, electric vehicles, and commercial transport.'
      }
    ],
    offences: [
      'Operating a two-wheeler, four-wheeler, or commercial transport while intoxicated (BAC > 30 mg/100 ml)',
      'Attempting to drive or sitting in the driver seat with the engine running while intoxicated',
      'Driving under the influence of illegal narcotics or prescription psychotropic substances impairing motor faculties',
      'Refusing to submit to a breath test or medical examination when lawfully directed by a police officer'
    ],
    actions_covered: [
      'Operating a two-wheeler, four-wheeler, or commercial transport while intoxicated',
      'Attempting to drive or sitting in the driver seat with the engine running while intoxicated',
      'Driving under the influence of illegal narcotics or psychotropic substances'
    ],
    penalties_fines: 'First offence: Imprisonment up to 6 months and/or fine of ₹10,000. Second or subsequent offence within 3 years: Imprisonment up to 2 years and/or fine of ₹15,000.',
    punishment: 'First offence: Imprisonment up to 6 months and/or fine. Second or subsequent offence within 3 years: Imprisonment up to 2 years and/or fine.',
    fine: 'First offence: ₹10,000. Second offence: ₹15,000.',
    imprisonment: 'Up to 6 months (1st offence); up to 2 years (subsequent offence within 3 years)',
    consequences: [
      'Mandatory immediate driving license suspension for at least 3 months recorded on Sarathi portal',
      'Vehicle impoundment on the spot under Section 206 of MVA',
      'Adverse entry in national Vahan database and insurance claim forfeiture under statutory intoxication exclusion',
      'Court appearance before Metropolitan Magistrate / Traffic Court'
    ],
    other_consequences: 'Immediate suspension of driving license for at least 3 months; mandatory entry in national Vahan/Sarathi portal; vehicle impounding.',
    exceptions: [
      'Prescribed medication taken strictly under registered medical supervision, provided it does not impair motor faculties (requires valid medical prescription at time of check)',
      'Defective breathalyzer device where blood laboratory test taken within 2 hours refutes the reading below 30 mg/100 ml threshold'
    ],
    amendments: [
      'Motor Vehicles (Amendment) Act, 2019: Steeply raised fine from ₹2,000 to ₹10,000 for first offence and from ₹3,000 to ₹15,000 for repeat violation effective 1 September 2019',
      'Pan-India Sarathi/Vahan digital integration for instant online license demerit and suspension'
    ],
    related_laws: [
      'Motor Vehicles Act, 1988 - Section 203 (Breath tests)',
      'Motor Vehicles Act, 1988 - Section 204 (Laboratory medical tests)',
      'Bharatiya Nyaya Sanhita, 2023 - Section 106 (Causing death by rash or negligent act)',
      'Bharatiya Nyaya Sanhita, 2023 - Section 281 (Rash driving on public way)'
    ],
    current_status: 'In Force (Active - Enforced nationwide with enhanced 2019 penalties)',
    category_id: 'motor-vehicle-traffic-law',
    official_text: 'Whoever, while driving, or attempting to drive, a motor vehicle has, in his blood, alcohol exceeding 30 mg. per 100 ml. of blood detected in a test by a breath analyser, or in any other test including a laboratory test, or is under the influence of a drug to such an extent as to be incapable of exercising proper control over the vehicle, shall be punishable.',
    what_it_means: 'Drunk driving is a serious criminal offence endangering public road users. Police have legal power to stop drivers, conduct breathalyser testing on the spot, and impound vehicles if alcohol threshold is breached.',
    is_bailable: true,
    is_cognizable: true,
    court_triable: 'Judicial Magistrate / Special Traffic Mobile Court',
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

  // 2. Motor Vehicle: Section 194D MVA (Helmet rules)
  {
    id: 'mva-sec-194d',
    official_name: 'Motor Vehicles Act, 1988',
    act_name: 'Motor Vehicles Act, 1988 (Amended 2019)',
    short_act: 'Motor Vehicles Act',
    short_description: 'Mandates that every two-wheeler rider and pillion passenger above 4 years old must wear an ISI-marked protective helmet securely strapped.',
    simple_explanation: 'Mandates that every rider and pillion passenger on a two-wheeler above 4 years old must wear an ISI-marked protective headgear (helmet) securely strapped, failing which a fine and license disqualification apply.',
    year_enacted: 1988,
    sections: 'Section 194D',
    section_number: 'Section 194D',
    section_title: 'Penalty for Violation of Safety Measures for Motor Cycles (Helmet Regulations)',
    sub_sections: [
      'Operative Clause: Driving or causing/allowing a motorcycle to be driven in contravention of Section 129',
      'Penal Scale: Punishable with a fine of one thousand rupees',
      'Disqualification: Mandatory disqualification for holding a driving license for a period of three months'
    ],
    definitions: [
      {
        term: 'Protective Headgear (Helmet)',
        meaning: 'A helmet complying with Bureau of Indian Standards (BIS) specifications (IS 4151), fastened securely with chin straps.'
      },
      {
        term: 'Pillion Passenger',
        meaning: 'Any passenger seated behind or alongside the rider on a two-wheeled motor vehicle.'
      }
    ],
    offences: [
      'Riding two-wheeler without wearing a protective helmet',
      'Allowing a pillion passenger aged 4 years or above to travel without a protective helmet',
      'Wearing an unstrapped or unapproved helmet that does not meet BIS standards',
      'Wearing industrial or novelty headgear not approved for road transport'
    ],
    actions_covered: [
      'Riding two-wheeler without wearing a protective helmet',
      'Pillion passenger not wearing a helmet',
      'Wearing an unstrapped or unapproved helmet that does not meet BIS standards'
    ],
    penalties_fines: 'Fine of ₹1,000 (One Thousand Rupees) and mandatory driving license disqualification for 3 months.',
    punishment: 'Disqualification of driving license for a period of 3 months',
    fine: '₹1,000 (One Thousand Rupees)',
    imprisonment: 'None (Compoundable monetary infraction)',
    consequences: [
      'Three months driving license suspension recorded on nationwide Sarathi portal',
      'Instant contactless e-challan generation via AI traffic surveillance cameras',
      'Mandatory road safety training/counselling in designated traffic commissionerates',
      'Accrual of demerit penalty points under state road safety frameworks'
    ],
    other_consequences: 'Three months driving license suspension marked on Sarathi portal; compulsory community road safety counselling in certain States.',
    exceptions: [
      'A person who is a Sikh wearing a turban while riding or driving in a public place (Section 129 Proviso)',
      'Infants below 9 months of age (children between 9 months and 4 years governed by separate CMVR safety harness rules)'
    ],
    amendments: [
      'Motor Vehicles (Amendment) Act, 2019: Introduced Section 194D with ₹1,000 fine and 3-month license suspension (increased from ₹100 under legacy Act)',
      'Central Motor Vehicles (Second Amendment) Rules, 2022: Safety harnesses and crash helmets made mandatory for children above 9 months'
    ],
    related_laws: [
      'Motor Vehicles Act, 1988 - Section 129 (Wearing of protective headgear)',
      'Central Motor Vehicles Rules, 1989 - Rule 138',
      'Bureau of Indian Standards Act, 2016 (IS 4151 helmet standards)'
    ],
    current_status: 'In Force (Active - Enforced nationwide with AI cameras and contactless e-challans)',
    category_id: 'motor-vehicle-traffic-law',
    official_text: 'Whoever drives a motor cycle or causes or allows a motor cycle to be driven in contravention of the provisions of section 129 or the rules or regulations made thereunder shall be punishable with a fine of one thousand rupees and he shall be disqualified for holding a licence for a period of three months.',
    what_it_means: 'Both rider and pillion must wear certified helmets conforming to Bureau of Indian Standards (BIS) specifications. Non-wearing incurs a monetary penalty plus statutory three-month driving license disqualification.',
    is_bailable: true,
    is_cognizable: false,
    court_triable: 'Authorized Police Officer (SI rank & above) / Traffic E-Challan Cell',
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

  // 3. Telangana Specific Traffic Regulations
  {
    id: 'telangana-mvr-traffic-rule',
    official_name: 'Telangana Motor Vehicles Rules, 1989 & Hyderabad City Police Act, 1348F',
    act_name: 'Telangana Motor Vehicles Rules, 1989 & Hyderabad City Police Act, 1348F',
    short_act: 'Telangana Traffic Rules & Police Act',
    short_description: 'Special State enforcement regulations applicable across Telangana for dangerous driving, wrong-side driving on flyovers, triple riding, and modified loud silencers.',
    simple_explanation: 'Special State enforcement regulations applicable across Hyderabad, Cyberabad, Rachakonda and Telangana districts for dangerous driving, wrong-side driving on flyovers/highways, triple riding, and unauthorized vehicle modifications (modified silencers).',
    year_enacted: 1989,
    sections: 'Rule 493 & Sections 21/76',
    section_number: 'Rule 493 & Sec 21/76',
    section_title: 'Regulation of Traffic, Wrong-Side Driving & Triple Riding Penalties in Telangana',
    sub_sections: [
      'Rule 493 TMVR: Regulatory directions on lane compliance, directional adherence, and public road discipline',
      'Section 21 Hyderabad Police Act: Police Commissioner regulatory orders for traffic regulation and public safety',
      'Section 76 Hyderabad Police Act: Penal sanctions for contravention of traffic orders and road obstructions'
    ],
    definitions: [
      {
        term: 'Wrong-Side Driving',
        meaning: 'Operating a motor vehicle against the authorized flow of traffic on divided carriageways, one-way streets, service roads, or elevated flyovers.'
      },
      {
        term: 'Modified Silencer',
        meaning: 'An aftermarket vehicle exhaust pipe or decibel booster modified to produce sound levels exceeding 80 decibels in violation of noise standards.'
      },
      {
        term: 'Triple Riding',
        meaning: 'Carrying more than one pillion rider on a two-wheeled motorcycle or scooter.'
      }
    ],
    offences: [
      'Driving against the flow of traffic (Wrong-side driving) on Telangana roads and ORR access corridors',
      'Triple riding on motorcycles or scooters in urban Commissionerates',
      'Fitting illegal loud exhaust pipes / modified silencers exceeding 80 decibels',
      'Obstructing emergency lanes on Hyderabad Outer Ring Road (ORR)'
    ],
    actions_covered: [
      'Driving against the flow of traffic (Wrong-side driving) on Telangana roads and ORR access corridors',
      'Triple riding on motorcycles or scooters in urban Commissionerates',
      'Fitting illegal loud exhaust pipes / modified silencers exceeding 80 decibels',
      'Obstructing emergency lanes on Hyderabad Outer Ring Road (ORR)'
    ],
    penalties_fines: 'Compounding fine of ₹1,000 to ₹5,000; vehicle seizure until fine payment; repeat offences forwarded to court with up to 3 months imprisonment under Section 184 MVA.',
    punishment: 'Vehicle seizure by Traffic Police until compounding fine cleared; court challan for repeat offences with up to 3 months imprisonment under Section 184 MVA.',
    fine: '₹1,000 to ₹5,000 depending on vehicle class and location (e.g. flyovers/ORR)',
    imprisonment: 'Up to 3 months for repeat reckless driving under Section 184 MVA',
    consequences: [
      'Penalty points accrued on Telangana RTA driving license profile; 12 points leads to 1-year suspension',
      'Immediate physical vehicle seizure until compounding fine cleared and silencer restored',
      'Mandatory attendance at Traffic Training Institute (TTI Goshamahal or Begumpet)',
      'Special Metropolitan Magistrate court trial for habitual offenders'
    ],
    other_consequences: 'Penalty points accrued on Telangana RTA driving license profile; 12 points leads to 1-year suspension; mandatory attendance at Traffic Training Institute (TTI Goshamahal / Begumpet).',
    exceptions: [
      'Emergency vehicles (Ambulances, Fire tenders, Police responding to distress) with sirens and lights active',
      'Authorized traffic diversions officially declared by Traffic Police Commissionerate during emergency repairs or VVIP movement'
    ],
    amendments: [
      'Telangana Penalty Points System (2017): Cumulative violation tracking resulting in automated license revocation',
      '2024 AI Surveillance Integration: Over 10,000 automated high-resolution ANPR and speed cameras deployed across Hyderabad Commissionerate'
    ],
    related_laws: [
      'Motor Vehicles Act, 1988 - Section 184 (Driving dangerously)',
      'Motor Vehicles Act, 1988 - Section 190(2) (Noise and pollution contraventions)',
      'Central Motor Vehicles Rules, 1989 - Rule 120 (Silencers)'
    ],
    current_status: 'In Force (Active - Enforced specifically within Telangana State by Hyderabad, Cyberabad, and Rachakonda Commissionerates)',
    category_id: 'motor-vehicle-traffic-law',
    official_text: 'In exercise of powers under Telangana Motor Vehicles Rules read with Section 21 of Hyderabad City Police Act, dangerous driving against flow of traffic, illegal triple riding on two-wheelers, and use of loud aftermarket silencers shall attract compounding fees and vehicle seizure.',
    what_it_means: 'In Telangana, wrong-side driving on arterial roads or flyovers is treated as dangerous driving under Section 184 MVA with compounding fines of ₹1,000 to ₹5,000 and possible vehicle impounding. Modified silencers causing sound pollution attract immediate seizure and court summons.',
    is_bailable: true,
    is_cognizable: true,
    court_triable: 'Special Metropolitan Magistrate for Traffic / E-Court',
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
  }
];
