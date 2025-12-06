// Utility functions related to user data stored in localStorage

/**
 * Get user's country/nation display from localStorage('user').
 * Fallback order:
 * - user.nation / user.country (object with i18n keys: vi/en, or string)
 * - user.nationCode / user.countryCode
 * - null if not available
 */
export function getUserCountry() {
  try {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    const user = JSON.parse(raw);
    const { nation, country, nationCode, countryCode } = user || {};

    const getLang = () => {
      try {
        if (typeof window !== 'undefined' && window.i18n?.language) return window.i18n.language;
        if (typeof document !== 'undefined') return document.documentElement.lang || 'vi';
      } catch {}
      return 'vi';
    };
    const lang = getLang();

    // Object form with i18n keys
    if (nation && typeof nation === 'object') {
      return nation[lang] || nation.en || nation.vi || null;
    }
    if (country && typeof country === 'object') {
      return country[lang] || country.en || country.vi || null;
    }

    // Simple string fields
    if (typeof nation === 'string' && nation.trim()) return nation;
    if (typeof country === 'string' && country.trim()) return country;

    // Codes
    if (typeof nationCode === 'string' && nationCode.trim()) return nationCode;
    if (typeof countryCode === 'string' && countryCode.trim()) return countryCode;

    return null;
  } catch {
    return null;
  }
}

