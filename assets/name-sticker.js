(() => {
  const sticker = document.querySelector('.name-sticker');
  if (!sticker) return;
  let bounds = null;
  const measure = () => {
    bounds = sticker.closest('.page-view').classList.contains('active')
      ? sticker.getBoundingClientRect() : null;
  };
  measure();
  // Use the uncut rectangle as the hover target so the lifted transparent
  // corner does not repeatedly enter and leave its own hit area.
  document.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch') return;
    if (!bounds || !sticker.closest('.page-view').classList.contains('active')) measure();
    const inside = bounds && event.clientX >= bounds.left && event.clientX <= bounds.right
      && event.clientY >= bounds.top && event.clientY <= bounds.bottom;
    sticker.classList.toggle('is-peeled', Boolean(inside));
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => sticker.classList.remove('is-peeled'));
  window.addEventListener('resize', measure, { passive: true });
  window.addEventListener('scroll', measure, { passive: true });
  document.addEventListener('animationend', measure);
  document.fonts.ready.then(measure);
})();
