import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  const [clicking, setClicking] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    setClicking(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setClicking(false), 600);
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={`fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 border-2
        bg-brand-600 hover:bg-brand-700 border-brand-500 text-white
        ${visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-75 pointer-events-none'}
        ${clicking ? 'scale-90' : 'hover:scale-110'}
      `}
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}
