/**
 * Demographics and Case Study predefined values
 * These match the backend Profile.cs structure
 * Used for profile demographics and case study data collection
 */

/**
 * Gender options (profile_gender / case_study_gender)
 */
export const GENDER_OPTIONS = [
  { key: "male", label: "Male" },
  { key: "female", label: "Female" },
  { key: "nonbinary", label: "Non-Binary" },
  { key: "other", label: "Other" },
] as const;

export type GenderKey = typeof GENDER_OPTIONS[number]["key"];

/**
 * Ethnicity/Race options (profile_ethnicity / case_study_ethnicity)
 */
export const ETHNICITY_OPTIONS = [
  { key: "black", label: "African-American or Black" },
  { key: "asian", label: "Asian American" },
  { key: "hispanic", label: "Latinx or Hispanic" },
  { key: "middle", label: "Middle Eastern American" },
  { key: "native", label: "Native American or Alaska Native" },
  { key: "pacific", label: "Native Hawaiian or Other Pacific Islander" },
  { key: "white", label: "White or European American" },
  { key: "other", label: "Other" },
] as const;

export type EthnicityKey = typeof ETHNICITY_OPTIONS[number]["key"];

/**
 * Education options (profile_education / case_study_education)
 */
export const EDUCATION_OPTIONS = [
  { key: "some_high_school", label: "Some High School" },
  { key: "high_school", label: "High School Diploma - GED" },
  { key: "some_college", label: "Some College" },
  { key: "associate", label: "Associate Degree" },
  { key: "bachelor", label: "Bachelor Degree" },
  { key: "graduate", label: "Graduate Degree" },
  { key: "doctorate", label: "Doctorate" },
] as const;

export type EducationKey = typeof EDUCATION_OPTIONS[number]["key"];

/**
 * Annual Income options (profile_income / case_study_income)
 */
export const INCOME_OPTIONS = [
  { key: "lt25", label: "Up to $25,000" },
  { key: "b25_50", label: "$25,001 - $50,000" },
  { key: "b50_75", label: "$50,001 - $75,000" },
  { key: "b75_100", label: "$75,001 - $100,000" },
  { key: "gt100", label: "$100,001 or above" },
] as const;

export type IncomeKey = typeof INCOME_OPTIONS[number]["key"];

/**
 * Bank options (profile_bank / case_study_bank)
 */
export const BANK_OPTIONS = [
  { key: "Other", label: "Other" },
  { key: "Abhyudaya Co-op Bank Ltd", label: "Abhyudaya Co-op Bank Ltd" },
  { key: "Alamerica Bank", label: "Alamerica Bank" },
  { key: "Allahabad Bank", label: "Allahabad Bank" },
  { key: "Ameris Bank", label: "Ameris Bank" },
  { key: "Arvest Bank", label: "Arvest Bank" },
  { key: "Associated Bank", label: "Associated Bank" },
  { key: "Axiom Bank", label: "Axiom Bank" },
  { key: "BancorpSouth Bank", label: "BancorpSouth Bank" },
  { key: "Bank of America", label: "Bank of America" },
  { key: "Bank of the Ozarks", label: "Bank of the Ozarks" },
  { key: "Bank of the West", label: "Bank of the West" },
  { key: "BankUnited", label: "BankUnited" },
  { key: "Banner Bank", label: "Banner Bank" },
  { key: "BB&T", label: "BB&T" },
  { key: "Berkshire Bank", label: "Berkshire Bank" },
  { key: "BMO Harris Bank", label: "BMO Harris Bank" },
  { key: "BOK Financial", label: "BOK Financial" },
  { key: "Bremer Bank", label: "Bremer Bank" },
  { key: "California Bank & Trust", label: "California Bank & Trust" },
  { key: "Canadian Imperial Bank of Commerce", label: "Canadian Imperial Bank of Commerce" },
  { key: "Capital Bank", label: "Capital Bank" },
  { key: "Capital City Bank", label: "Capital City Bank" },
  { key: "Capital One Bank", label: "Capital One Bank" },
  { key: "Carter Bank & Trust", label: "Carter Bank & Trust" },
  { key: "Carver State Bank", label: "Carver State Bank" },
  { key: "Centennial Bank", label: "Centennial Bank" },
  { key: "Chase Bank", label: "Chase Bank" },
  { key: "Chemical Bank", label: "Chemical Bank" },
  { key: "Citibank", label: "Citibank" },
  { key: "Citizens Bank", label: "Citizens Bank" },
  { key: "Citizens Bank of Pennsylvania", label: "Citizens Bank of Pennsylvania" },
  { key: "Citizens Savings Bank & Trust Company", label: "Citizens Savings Bank & Trust Company" },
  { key: "Citizens Trust Bank", label: "Citizens Trust Bank" },
  { key: "City First/Broadway Federal Bank", label: "City First/Broadway Federal Bank" },
  { key: "City National Bank", label: "City National Bank" },
  { key: "Columbia Savings & Loan Association", label: "Columbia Savings & Loan Association" },
  { key: "Columbia State Bank", label: "Columbia State Bank" },
  { key: "Comerica Bank", label: "Comerica Bank" },
  { key: "Commerce Bank", label: "Commerce Bank" },
  { key: "Commonwealth National Bank", label: "Commonwealth National Bank" },
  { key: "Community Bank", label: "Community Bank" },
  { key: "Compass Bank", label: "Compass Bank" },
  { key: "Credit Union of Atlanta", label: "Credit Union of Atlanta" },
  { key: "East West Bank", label: "East West Bank" },
  { key: "Eastern Bank", label: "Eastern Bank" },
  { key: "FAMU Federal Credit Union", label: "FAMU Federal Credit Union" },
  { key: "Fifth Third Bank", label: "Fifth Third Bank" },
  { key: "First Bank", label: "First Bank" },
  { key: "First Citizens Bank", label: "First Citizens Bank" },
  { key: "First Commonwealth Bank", label: "First Commonwealth Bank" },
  { key: "First Financial Bank", label: "First Financial Bank" },
  { key: "First Independence Bank", label: "First Independence Bank" },
  { key: "First Merchants Bank", label: "First Merchants Bank" },
  { key: "First Midwest Bank", label: "First Midwest Bank" },
  { key: "First National Bank of Omaha", label: "First National Bank of Omaha" },
  { key: "First National Bank of Pennsylvania", label: "First National Bank of Pennsylvania" },
  { key: "First National Bank Texas", label: "First National Bank Texas" },
  { key: "First Niagara Bank", label: "First Niagara Bank" },
  { key: "First State Bank", label: "First State Bank" },
  { key: "First Tennessee Bank", label: "First Tennessee Bank" },
  { key: "First Tuskegee Bank", label: "First Tuskegee Bank" },
  { key: "FirstBank", label: "FirstBank" },
  { key: "FirstMerit Bank", label: "FirstMerit Bank" },
  { key: "Flagstar Bank", label: "Flagstar Bank" },
  { key: "Frost Bank", label: "Frost Bank" },
  { key: "Fulton Bank", label: "Fulton Bank" },
  { key: "Glacier Bank", label: "Glacier Bank" },
  { key: "Great Southern Bank", label: "Great Southern Bank" },
  { key: "Great Western Bank", label: "Great Western Bank" },
  { key: "Guaranty Bank", label: "Guaranty Bank" },
  { key: "Harbor Bank of Maryland", label: "Harbor Bank of Maryland" },
  { key: "Hill Districk Credit Union", label: "Hill Districk Credit Union" },
  { key: "HSBC Bank USA", label: "HSBC Bank USA" },
  { key: "Huntington Bank", label: "Huntington Bank" },
  { key: "IBC Bank", label: "IBC Bank" },
  { key: "Iberiabank", label: "Iberiabank" },
  { key: "Illinois Service Federal Bank", label: "Illinois Service Federal Bank" },
  { key: "Industrial Bank", label: "Industrial Bank" },
  { key: "Investors Bank", label: "Investors Bank" },
  { key: "KeyBank", label: "KeyBank" },
  { key: "Liberty Bank", label: "Liberty Bank" },
  { key: "M&T Bank", label: "M&T Bank" },
  { key: "Mechanics & Farmers Bank", label: "Mechanics & Farmers Bank" },
  { key: "Metro Bank", label: "Metro Bank" },
  { key: "National Penn Bank", label: "National Penn Bank" },
  { key: "Navy Federal Credit Union", label: "Navy Federal Credit Union" },
  { key: "NBH Bank", label: "NBH Bank" },
  { key: "NBT Bank", label: "NBT Bank" },
  { key: "New York Community Bank", label: "New York Community Bank" },
  { key: "North Milwaukee State Bank", label: "North Milwaukee State Bank" },
  { key: "Northwest Bank", label: "Northwest Bank" },
  { key: "Old National Bank", label: "Old National Bank" },
  { key: "Omega Psi Phi Credit Union", label: "Omega Psi Phi Credit Union" },
  { key: "OneUnited Bank", label: "OneUnited Bank" },
  { key: "Pentagon Federal Credit Union", label: "Pentagon Federal Credit Union" },
  { key: "People's United Bank", label: "People's United Bank" },
  { key: "Phi Beta Sigma Federal Credit Union", label: "Phi Beta Sigma Federal Credit Union" },
  { key: "PNC Bank", label: "PNC Bank" },
  { key: "Prosperity Bank", label: "Prosperity Bank" },
  { key: "Rabobank", label: "Rabobank" },
  { key: "Regions Bank", label: "Regions Bank" },
  { key: "Renasant Bank", label: "Renasant Bank" },
  { key: "Santander Bank", label: "Santander Bank" },
  { key: "Scotia Bank", label: "Scotia Bank" },
  { key: "Seaway Bank & Trust Company", label: "Seaway Bank & Trust Company" },
  { key: "Simmons First National Bank", label: "Simmons First National Bank" },
  { key: "South Carolina Community Bank", label: "South Carolina Community Bank" },
  { key: "South State Bank", label: "South State Bank" },
  { key: "SunTrust Bank", label: "SunTrust Bank" },
  { key: "Synovus Bank", label: "Synovus Bank" },
  { key: "TCF National Bank", label: "TCF National Bank" },
  { key: "TD Bank", label: "TD Bank" },
  { key: "The Park National Bank", label: "The Park National Bank" },
  { key: "Toledo Urban Credit Union", label: "Toledo Urban Credit Union" },
  { key: "Tri-State Bank of Memphis", label: "Tri-State Bank of Memphis" },
  { key: "TrustCo Bank", label: "TrustCo Bank" },
  { key: "Trustmark National Bank", label: "Trustmark National Bank" },
  { key: "U.S. Bank", label: "U.S. Bank" },
  { key: "UMB Bank", label: "UMB Bank" },
  { key: "Umpqua Bank", label: "Umpqua Bank" },
  { key: "Union Bank", label: "Union Bank" },
  { key: "Union Bank & Trust", label: "Union Bank & Trust" },
  { key: "United Bank of Philadelphia", label: "United Bank of Philadelphia" },
  { key: "United Community Bank", label: "United Community Bank" },
  { key: "Unity National Bank", label: "Unity National Bank" },
  { key: "USAA", label: "USAA" },
  { key: "Valley National Bank", label: "Valley National Bank" },
  { key: "Washington Federal", label: "Washington Federal" },
  { key: "Webster Bank", label: "Webster Bank" },
  { key: "Wells Fargo Bank", label: "Wells Fargo Bank" },
  { key: "WesBanco", label: "WesBanco" },
  { key: "Westamerica Bank", label: "Westamerica Bank" },
  { key: "Whitney Bank", label: "Whitney Bank" },
  { key: "Woodforest National Bank", label: "Woodforest National Bank" },
  { key: "Zions First National Bank", label: "Zions First National Bank" },
] as const;

export type BankKey = typeof BANK_OPTIONS[number]["key"];

/**
 * HBCU options (profile_hbcu / case_study_hbcu)
 */
export const HBCU_OPTIONS = [
  { key: "None", label: "None" },
  { key: "Alabama A&M University", label: "Alabama A&M University" },
  { key: "Alcorn State University", label: "Alcorn State University" },
  { key: "Allen University", label: "Allen University" },
  { key: "American Baptist College", label: "American Baptist College" },
  { key: "University of Arkansas at Pine Bluff", label: "University of Arkansas at Pine Bluff" },
  { key: "Arkansas Baptist College", label: "Arkansas Baptist College" },
  { key: "Barber-Scotia College", label: "Barber-Scotia College" },
  { key: "Benedict College", label: "Benedict College" },
  { key: "Bennett College", label: "Bennett College" },
  { key: "Bethune-Cookman University", label: "Bethune-Cookman University" },
  { key: "Bishop State Community College", label: "Bishop State Community College" },
  { key: "Bluefield State College", label: "Bluefield State College" },
  { key: "Bowie State University", label: "Bowie State University" },
  { key: "Central State University", label: "Central State University" },
  { key: "Cheyney University of Pennsylvania", label: "Cheyney University of Pennsylvania" },
  { key: "Claflin University", label: "Claflin University" },
  { key: "Clark Atlanta University", label: "Clark Atlanta University" },
  { key: "Clinton College", label: "Clinton College" },
  { key: "Coahoma Community College", label: "Coahoma Community College" },
  { key: "Concordia College, Alabama", label: "Concordia College, Alabama" },
  { key: "Coppin State University", label: "Coppin State University" },
  { key: "Delaware State University", label: "Delaware State University" },
  { key: "Denmark Technical College", label: "Denmark Technical College" },
  { key: "Dillard University", label: "Dillard University" },
  { key: "University of the District of Columbia", label: "University of the District of Columbia" },
  { key: "Edward Waters College", label: "Edward Waters College" },
  { key: "Elizabeth City State University", label: "Elizabeth City State University" },
  { key: "Fayetteville State University", label: "Fayetteville State University" },
  { key: "Fisk University", label: "Fisk University" },
  { key: "Florida A&M University", label: "Florida A&M University" },
  { key: "Florida Memorial University", label: "Florida Memorial University" },
  { key: "Fort Valley State University", label: "Fort Valley State University" },
  { key: "Gadsden State Community College", label: "Gadsden State Community College" },
  { key: "Grambling State University", label: "Grambling State University" },
  { key: "Hampton University", label: "Hampton University" },
  { key: "Harris-Stowe State University", label: "Harris-Stowe State University" },
  { key: "Hinds Community College at Utica", label: "Hinds Community College at Utica" },
  { key: "Howard University", label: "Howard University" },
  { key: "Huston-Tillotson University", label: "Huston-Tillotson University" },
  { key: "Interdenominational Theological Center", label: "Interdenominational Theological Center" },
  { key: "J. F. Drake State Technical College", label: "J. F. Drake State Technical College" },
  { key: "Jackson State University", label: "Jackson State University" },
  { key: "Jarvis Christian College", label: "Jarvis Christian College" },
  { key: "Johnson C. Smith University", label: "Johnson C. Smith University" },
  { key: "Kentucky State University", label: "Kentucky State University" },
  { key: "Knoxville College", label: "Knoxville College" },
  { key: "Lane College", label: "Lane College" },
  { key: "Langston University", label: "Langston University" },
  { key: "Lawson State Community College", label: "Lawson State Community College" },
  { key: "LeMoyne-Owen College", label: "LeMoyne-Owen College" },
  { key: "Lewis College of Business", label: "Lewis College of Business" },
  { key: "The Lincoln University", label: "The Lincoln University" },
  { key: "Lincoln University", label: "Lincoln University" },
  { key: "Livingstone College", label: "Livingstone College" },
  { key: "University of Maryland Eastern Shore", label: "University of Maryland Eastern Shore" },
  { key: "Meharry Medical College", label: "Meharry Medical College" },
  { key: "Miles College", label: "Miles College" },
  { key: "Mississippi Valley State University", label: "Mississippi Valley State University" },
  { key: "Morehouse College", label: "Morehouse College" },
  { key: "Morehouse School of Medicine", label: "Morehouse School of Medicine" },
  { key: "Morgan State University", label: "Morgan State University" },
  { key: "Morris Brown College", label: "Morris Brown College" },
  { key: "Morris College", label: "Morris College" },
  { key: "Norfolk State University", label: "Norfolk State University" },
  { key: "North Carolina A&T State University", label: "North Carolina A&T State University" },
  { key: "North Carolina Central University", label: "North Carolina Central University" },
  { key: "Oakwood University", label: "Oakwood University" },
  { key: "Paine College", label: "Paine College" },
  { key: "Paul Quinn College", label: "Paul Quinn College" },
  { key: "Philander Smith College", label: "Philander Smith College" },
  { key: "Prairie View A&M University", label: "Prairie View A&M University" },
  { key: "Rust College", label: "Rust College" },
  { key: "Saint Paul's College", label: "Saint Paul's College" },
  { key: "Savannah State University", label: "Savannah State University" },
  { key: "Selma University", label: "Selma University" },
  { key: "Shaw University", label: "Shaw University" },
  { key: "Shelton State Community College", label: "Shelton State Community College" },
  { key: "Shorter College", label: "Shorter College" },
  { key: "Simmons College of Kentucky", label: "Simmons College of Kentucky" },
  { key: "South Carolina State University", label: "South Carolina State University" },
  { key: "Southern University at New Orleans", label: "Southern University at New Orleans" },
  { key: "Southern University at Shreveport", label: "Southern University at Shreveport" },
  { key: "Southern University and A&M College", label: "Southern University and A&M College" },
  { key: "Southwestern Christian College", label: "Southwestern Christian College" },
  { key: "Spelman College", label: "Spelman College" },
  { key: "St. Augustine's University", label: "St. Augustine's University" },
  { key: "St. Philip's College", label: "St. Philip's College" },
  { key: "Stillman College", label: "Stillman College" },
  { key: "Talladega College", label: "Talladega College" },
  { key: "Tennessee State University", label: "Tennessee State University" },
  { key: "Texas College", label: "Texas College" },
  { key: "Texas Southern University", label: "Texas Southern University" },
  { key: "Tougaloo College", label: "Tougaloo College" },
  { key: "H. Councill Trenholm State Community College", label: "H. Councill Trenholm State Community College" },
  { key: "Tuskegee University", label: "Tuskegee University" },
  { key: "University of the Virgin Islands", label: "University of the Virgin Islands" },
  { key: "Virginia State University", label: "Virginia State University" },
  { key: "Virginia Union University", label: "Virginia Union University" },
  { key: "Virginia University of Lynchburg", label: "Virginia University of Lynchburg" },
  { key: "Voorhees College", label: "Voorhees College" },
  { key: "West Virginia State University", label: "West Virginia State University" },
  { key: "Wilberforce University", label: "Wilberforce University" },
  { key: "Wiley College", label: "Wiley College" },
  { key: "Winston-Salem State University", label: "Winston-Salem State University" },
  { key: "Xavier University of Louisiana", label: "Xavier University of Louisiana" },
] as const;

export type HBCUKey = typeof HBCU_OPTIONS[number]["key"];

/**
 * Greek Affiliation options (profile_greek / case_study_greek)
 */
export const GREEK_OPTIONS = [
  { key: "None", label: "None" },
  { key: "Alpha Phi Alpha Fraternity", label: "Alpha Phi Alpha Fraternity" },
  { key: "Alpha Kappa Alpha Sorority", label: "Alpha Kappa Alpha Sorority" },
  { key: "Kappa Alpha Psi Fraternity", label: "Kappa Alpha Psi Fraternity" },
  { key: "Omega Psi Phi Fraternity", label: "Omega Psi Phi Fraternity" },
  { key: "Delta Sigma Theta Sorority", label: "Delta Sigma Theta Sorority" },
  { key: "Phi Beta Sigma Fraternity", label: "Phi Beta Sigma Fraternity" },
  { key: "Zeta Phi Beta Sorority", label: "Zeta Phi Beta Sorority" },
  { key: "Sigma Gamma Rho Sorority", label: "Sigma Gamma Rho Sorority" },
  { key: "Iota Phi Theta Fraternity", label: "Iota Phi Theta Fraternity" },
] as const;

export type GreekKey = typeof GREEK_OPTIONS[number]["key"];

/**
 * Helper functions to convert to FormSelect format (value/label pairs)
 */

export function getGenderOptions() {
  return GENDER_OPTIONS.map(option => ({
    value: option.key,
    label: option.label,
  }));
}

export function getEthnicityOptions() {
  return ETHNICITY_OPTIONS.map(option => ({
    value: option.key,
    label: option.label,
  }));
}

export function getEducationOptions() {
  return EDUCATION_OPTIONS.map(option => ({
    value: option.key,
    label: option.label,
  }));
}

export function getIncomeOptions() {
  return INCOME_OPTIONS.map(option => ({
    value: option.key,
    label: option.label,
  }));
}

export function getBankOptions() {
  return BANK_OPTIONS.map(option => ({
    value: option.key,
    label: option.label,
  }));
}

export function getHBCUOptions() {
  return HBCU_OPTIONS.map(option => ({
    value: option.key,
    label: option.label,
  }));
}

export function getGreekOptions() {
  return GREEK_OPTIONS.map(option => ({
    value: option.key,
    label: option.label,
  }));
}

/**
 * Helper functions to get label from key
 */
export function getGenderLabel(key: GenderKey | string): string {
  return GENDER_OPTIONS.find(opt => opt.key === key)?.label || key;
}

export function getEthnicityLabel(key: EthnicityKey | string): string {
  return ETHNICITY_OPTIONS.find(opt => opt.key === key)?.label || key;
}

export function getEducationLabel(key: EducationKey | string): string {
  return EDUCATION_OPTIONS.find(opt => opt.key === key)?.label || key;
}

export function getIncomeLabel(key: IncomeKey | string): string {
  return INCOME_OPTIONS.find(opt => opt.key === key)?.label || key;
}

export function getBankLabel(key: BankKey | string): string {
  return BANK_OPTIONS.find(opt => opt.key === key)?.label || key;
}

export function getHBCULabel(key: HBCUKey | string): string {
  return HBCU_OPTIONS.find(opt => opt.key === key)?.label || key;
}

export function getGreekLabel(key: GreekKey | string): string {
  return GREEK_OPTIONS.find(opt => opt.key === key)?.label || key;
}
