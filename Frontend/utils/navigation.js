/**
 * Navigation utility functions
 */

/**
 * Redirects user to the appropriate dashboard based on role
 * @param {string} role - User role (mentor or mentee)
 * @param {boolean} forcePage - Whether to force a full page navigation
 */
export const redirectToDashboard = (role, forcePage = true) => {
  console.log(`Redirecting to ${role} dashboard. Force page: ${forcePage}`);
  
  const dashboardUrl = role === 'mentor' ? '/dashboard/mentor' : '/dashboard/mentee';
  
  if (forcePage) {
    // Force a full page navigation for more reliability
    window.location.href = dashboardUrl;
  } else {
    // Use client-side navigation
    window.history.pushState({}, '', dashboardUrl);
    // Attempt to trigger a route change event
    try {
      const navEvent = new PopStateEvent('popstate');
      window.dispatchEvent(navEvent);
    } catch (err) {
      console.error('Failed to dispatch navigation event:', err);
      // Fallback to full page nav if client-side fails
      window.location.href = dashboardUrl;
    }
  }
};

/**
 * Check if dashboard pages exist and are accessible
 * @returns {Promise<Object>} Object with status of dashboard pages
 */
export const checkDashboardPages = async () => {
  const results = {
    mentor: false,
    mentee: false
  };
  
  try {
    const mentorRes = await fetch('/dashboard/mentor', { method: 'HEAD' });
    results.mentor = mentorRes.ok;
  } catch (err) {
    console.error('Error checking mentor dashboard:', err);
  }
  
  try {
    const menteeRes = await fetch('/dashboard/mentee', { method: 'HEAD' });
    results.mentee = menteeRes.ok;
  } catch (err) {
    console.error('Error checking mentee dashboard:', err);
  }
  
  return results;
}; 