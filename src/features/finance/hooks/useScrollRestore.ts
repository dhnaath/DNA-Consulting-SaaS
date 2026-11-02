import { useEffect, useRef, UIEvent } from "react";

const scrollMap = new Map<string, number>();

export function useScrollRestore(key: string, isWindow: boolean = false) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Small timeout to allow DOM to render before restoring scroll
    setTimeout(() => {
      if (scrollMap.has(key)) {
        if (isWindow) {
          window.scrollTo(0, scrollMap.get(key)!);
        } else if (ref.current) {
          ref.current.scrollTop = scrollMap.get(key)!;
        }
      } else if (isWindow) {
        window.scrollTo(0, 0); // scroll to top for new screens
      }
    }, 10);
  }, [key, isWindow]);

  const handleScroll = (e: UIEvent<HTMLDivElement> | Event) => {
    if (isWindow) {
      scrollMap.set(key, window.scrollY);
    } else {
      scrollMap.set(key, (e as unknown as UIEvent<HTMLDivElement>).currentTarget.scrollTop);
    }
  };

  useEffect(() => {
    if (isWindow) {
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }
    return undefined;
  }, [key, isWindow]);

  return { ref, onScroll: isWindow ? undefined : (handleScroll as any) };
}
