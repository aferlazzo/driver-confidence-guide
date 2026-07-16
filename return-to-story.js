document.addEventListener('DOMContentLoaded', function () {
  const params = new URLSearchParams(window.location.search);
  let returnUrl = params.get('return');

  if (!returnUrl && document.referrer) {
    try {
      const referrer = new URL(document.referrer);
      if (referrer.origin === window.location.origin && referrer.pathname.startsWith('/driver-confidence-guide/adventures/')) {
        returnUrl = referrer.pathname + referrer.search + referrer.hash;
      }
    } catch (error) {
      returnUrl = null;
    }
  }

  if (!returnUrl) return;

  const destination = new URL(returnUrl, window.location.origin + '/driver-confidence-guide/');
  if (destination.origin !== window.location.origin || !destination.pathname.startsWith('/driver-confidence-guide/adventures/')) return;

  const section = document.querySelector('.bottom-navigation');
  const buttons = section && section.querySelector('.navigation-buttons');
  if (!buttons) return;

  const link = document.createElement('a');
  link.className = 'nav-button primary return-to-story';
  link.href = destination.pathname + destination.search + destination.hash;
  link.textContent = '← Continue Episode';
  buttons.prepend(link);
});