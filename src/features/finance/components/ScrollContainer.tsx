import React from "react";
import { useScrollRestore } from "../hooks/useScrollRestore";

export function ScrollContainer({
  id,
  children,
  className,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { ref, onScroll } = useScrollRestore(id);
  return (
    <div ref={ref} onScroll={onScroll} className={className}>
      {children}
    </div>
  );
}
