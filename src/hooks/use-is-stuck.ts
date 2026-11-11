import { useEffect, useRef, useState } from 'react';

/**
 * Tracks whether a sticky element is pinned at `offset` px from the top of the
 * viewport. Attach `sentinelRef` to an element placed right before it.
 */
export function useIsStuck(offset: number) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsStuck(!entry.isIntersecting),
      { rootMargin: `-${offset}px 0px 0px 0px` }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [offset]);

  return { sentinelRef, isStuck };
}
