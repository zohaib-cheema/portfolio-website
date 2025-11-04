/**
 * Professional email validation utility
 * Validates that emails are from professional domains (not personal email providers)
 */

// List of personal email domains to reject
const PERSONAL_EMAIL_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'aol.com',
  'icloud.com',
  'protonmail.com',
  'mail.com',
  'yandex.com',
  'zoho.com',
  'gmx.com',
  'live.com',
  'msn.com',
  'rediffmail.com',
  'inbox.com',
  'tutanota.com',
];

/**
 * Validates email format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if email format is valid
 */
export const isValidEmailFormat = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Checks if email domain is from a personal email provider
 * @param {string} email - Email address to check
 * @returns {boolean} - True if domain is a personal email provider
 */
export const isPersonalEmailDomain = (email) => {
  const domain = email.split('@')[1]?.toLowerCase();
  return PERSONAL_EMAIL_DOMAINS.includes(domain);
};

/**
 * Validates if email is from a professional domain
 * Professional domains typically include:
 * - Company domains (company.com, company.io, etc.)
 * - Educational domains (university.edu, school.edu, etc.)
 * - Organization domains (org.org, etc.)
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if email is from a professional domain
 */
export const isProfessionalEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return false;
  }

  // Check basic email format
  if (!isValidEmailFormat(email)) {
    return false;
  }

  // Reject personal email domains
  if (isPersonalEmailDomain(email)) {
    return false;
  }

  // Extract domain
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) {
    return false;
  }

  // Check for common professional domain patterns
  // Accept: .edu, .org, .com, .io, .co, .net, .gov, etc. (but not personal domains)
  const professionalPatterns = [
    /\.edu$/i,        // Educational institutions
    /\.org$/i,        // Organizations
    /\.gov$/i,        // Government
    /\.mil$/i,        // Military
    /\.com$/i,        // Commercial (but filter out personal domains above)
    /\.io$/i,         // Tech companies
    /\.co$/i,         // Companies
    /\.net$/i,        // Networks
    /\.tech$/i,       // Tech companies
    /\.ai$/i,         // AI companies
  ];

  // Check if domain matches professional patterns
  const matchesProfessionalPattern = professionalPatterns.some(pattern => 
    pattern.test(domain)
  );

  // Additional check: if it's a .com but not in personal list, it's likely professional
  // Or if it matches any professional pattern
  return matchesProfessionalPattern || (!domain.endsWith('.com') || !isPersonalEmailDomain(email));
};

/**
 * Validates professional email and returns error message if invalid
 * @param {string} email - Email address to validate
 * @returns {{valid: boolean, message: string}} - Validation result
 */
export const validateProfessionalEmail = (email) => {
  if (!email || email.trim() === '') {
    return {
      valid: false,
      message: 'Please provide an email address.',
    };
  }

  if (!isValidEmailFormat(email)) {
    return {
      valid: false,
      message: 'Please enter a valid email address format (e.g., name@company.com).',
    };
  }

  if (isPersonalEmailDomain(email)) {
    return {
      valid: false,
      message: 'I need a professional email address (like name@companyname.edu or name@company.com). This helps ensure Zohaib\'s resume reaches the right contacts.',
    };
  }

  if (!isProfessionalEmail(email)) {
    return {
      valid: false,
      message: 'Please provide a professional email address from a company or educational institution.',
    };
  }

  return {
    valid: true,
    message: 'Email looks good!',
  };
};

