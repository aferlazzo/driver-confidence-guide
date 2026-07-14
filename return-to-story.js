document.addEventListener('DOMContentLoaded', function () {
  const params = new URLSearchParams(window.location.search);
  const returnPath = params.get('return');
  if (!returnPath) return;

  const destination = new URL(returnPath, window.location.origin + '/driver-confidence-guide/');
  if (destination.origin !== window.location.origin || !destination.pathname.startsWith('/driver-confidence-guide/adventures/')) return;

  const section = document.querySelector('.bottom-navigation');
  const buttons = section && section.querySelector('.navigation-buttons');
  if (!buttons) return;

  const link = document.createElement('a');
  link.className = 'nav-button primary return-to-story';
  link.href = destination.pathname + destination.search + destination.hash;
  link.textContent = '← Return to Story';
  buttons.prepend(link);

  section.scrollIntoView({ block: 'nearest' });
});