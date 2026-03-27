'use client';

import { useEffect, useRef, useState } from 'react';

type UseInViewOptions = IntersectionObserverInit & {
  triggerOnce?: boolean;
  initialInView?: boolean;
};

export function useInView<T extends HTMLElement>({
  root = null,
  rootMargin = '240px 0px',
  threshold = 0.12,
  triggerOnce = true,
  initialInView = false,
}: UseInViewOptions = {}) {
  const ref = useRef<T | null>(null);
  const [isInView, setIsInView] = useState(initialInView);

  useEffect(() => {
    const element = ref.current;
    if (!element || isInView) {
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      // Schedule state update to avoid synchronous setState in effect body
      const id = requestAnimationFrame(() => setIsInView(true));
      return () => cancelAnimationFrame(id);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          setIsInView(true);

          if (triggerOnce) {
            observer.unobserve(entry.target);
          }
        });
      },
      { root, rootMargin, threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [initialInView, isInView, root, rootMargin, threshold, triggerOnce]);

  return { ref, isInView };
}
