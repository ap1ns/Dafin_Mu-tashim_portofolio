const initScrollReveal = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const revealElements = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
  if (!revealElements.length) return;

  revealElements.forEach((element, index) => {
    const delay = (index % 10) * 0.08;
    element.style.setProperty('--reveal-delay', `${delay}s`);
    element.style.willChange = 'opacity, transform';
  });

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        const element = entry.target as HTMLElement;
        if (entry.isIntersecting || entry.intersectionRatio > 0) {
          element.classList.add('visible');
          obs.unobserve(element);
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: '0px 0px -10% 0px',
    }
  );

  revealElements.forEach((element) => observer.observe(element));

  return () => observer.disconnect();
};

export default initScrollReveal;
