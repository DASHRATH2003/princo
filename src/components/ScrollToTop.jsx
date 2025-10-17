import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // If deep-linked to an anchor/hash, let browser handle it after paint
    if (hash) {
      // delay to allow anchor render
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 0);
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname, search, hash]);

  return null;
};

export default ScrollToTop;