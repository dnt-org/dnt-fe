// Utility functions related to user data stored in localStorage

/**
 * Get user's country/nation display from localStorage('user').
 * Returns user.nation or 'GLOBAL' if not available.
 */
export function getUserCountry() {
  try {
    if (typeof window === 'undefined') return 'Vietnam';
    const raw = localStorage.getItem('user');
    if (!raw) return 'Vietnam';
    const user = JSON.parse(raw);
    const nation = user?.nation;

    if (!nation) return 'Vietnam';

    if (typeof nation === 'object') {
      const lang = window.i18n?.language || document.documentElement.lang || 'vi';
      return nation[lang] || nation.en || nation.vi || 'Vietnam';
    }

    return nation;
  } catch {
    return 'Vietnam';
  }
}

