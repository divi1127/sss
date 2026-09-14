import { useEffect, useRef } from 'react';

/**
 * Wraps children and animates them when they scroll into view.
 * Usage: <ScrollReveal className="..."> ... </ScrollReveal>
 */
export default function ScrollReveal({ children, className = '', delay = 0, direction = 'up' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Set initial hidden state
    el.style.opacity = '0';
    el.style.transition = `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`;

    const transforms = {
      up:    'translateY(30px)',
      down:  'translateY(-30px)',
      left:  'translateX(-30px)',
      right: 'translateX(30px)',
      scale: 'scale(0.92)',
    };
    el.style.transform = transforms[direction] || transforms.up;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1';
          el.style.transform = 'none';
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, direction]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
