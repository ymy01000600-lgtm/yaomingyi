(() => {
  const page = document.getElementById('view-about');
  if (!page || !('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const elements = page.querySelectorAll('.history-editorial-heading, .personal-history-row');
  elements.forEach(element => {
    element.classList.add('history-reveal');
    if (element.matches('.personal-history-row')) {
      element.style.setProperty('--history-delay', `${Array.from(element.parentElement.children).indexOf(element) * 130}ms`);
    }
  });
  const observer = new IntersectionObserver(entries => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting && page.classList.contains('active')) target.classList.add('history-visible');
    });
  }, { threshold: .12, rootMargin: '0px 0px -24px 0px' });
  elements.forEach(element => observer.observe(element));
  // Replay when revisiting About, while avoiding repeated animations during
  // normal up/down scrolling within one visit.
  new MutationObserver(() => {
    if (!page.classList.contains('active')) elements.forEach(element => element.classList.remove('history-visible'));
  }).observe(page, { attributes: true, attributeFilter: ['class'] });
})();
