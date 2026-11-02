import { useState, useEffect } from "react";

interface TypewriterSearchTextProps {
  text?: string;
  active?: boolean;
  speed?: number;
  startDelay?: number;
  className?: string;
}

export function TypewriterSearchText({
  text = "Search",
  active = true,
  speed = 55,
  startDelay = 60,
  className = "text-[12.5px] font-medium tracking-tight text-foreground/85 group-hover:text-foreground transition-colors",
}: TypewriterSearchTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!active) {
      setDisplayedText("");
      setIsTyping(false);
      return;
    }

    let intervalId: any = null;
    let index = 0;
    setDisplayedText("");
    setIsTyping(true);

    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        index++;
        setDisplayedText(text.slice(0, index));
        if (index >= text.length) {
          clearInterval(intervalId);
          setIsTyping(false);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [active, text, speed, startDelay]);

  return (
    <span className={`inline-flex items-center min-w-[42px] select-none ${className}`}>
      {displayedText}
      {isTyping && (
        <span className="inline-block w-[1.5px] h-3 bg-muted-foreground/70 ml-0.5 rounded-full animate-pulse" />
      )}
    </span>
  );
}
