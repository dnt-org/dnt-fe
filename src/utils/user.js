// Utility functions related to user data stored in localStorage

/**
 * Get user's country/nation display from localStorage('user').
 * Returns user.nation or 'GLOBAL' if not available.
 */
export function getUserCountry() {
  try {
    if (typeof window === 'undefined') return 'GLOBAL';
    const raw = localStorage.getItem('user');
    if (!raw) return 'GLOBAL';
    const user = JSON.parse(raw);
    const nation = user?.nation;

    if (!nation) return 'GLOBAL';

    if (typeof nation === 'object') {
      const lang = window.i18n?.language || document.documentElement.lang || 'vi';
      return nation[lang] || nation.en || nation.vi || 'GLOBAL';
    }

    return nation;
  } catch {
    return 'GLOBAL';
  }
}

