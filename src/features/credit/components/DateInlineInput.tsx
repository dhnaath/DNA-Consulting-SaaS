// @ts-nocheck
import React, { useState, useEffect } from "react";

export const DateInlineInput = ({
  date,
  onChange,
  highlight,
}: {
  date: Date | null;
  onChange: (isoDate: string) => void;
  highlight: boolean;
}) => {
  const [val, setVal] = useState("");

  useEffect(() => {
    if (date && !isNaN(date.getTime())) {
      const d = String(date.getDate()).padStart(2, "0");
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const y = date.getFullYear();
      setVal(`${d}/${m}/${y}`);
    } else {
      setVal("");
    }
  }, [date]);

  const handleBlur = () => {
    // Parse user input (allow d/m/y, dd/mm/yyyy, etc)
    const parts = val.split("/");
    if (parts.length === 3) {
      const [d, m, y] = parts;
      if (d.length >= 1 && d.length <= 2 && m.length >= 1 && m.length <= 2 && y.length === 4) {
        const iso = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
        if (!isNaN(new Date(iso).getTime())) {
          onChange(iso);
          return;
        }
      }
    }

    // Fallback parsing for DD-MM-YYYY
    const partsDashRev = val.split("-");
    if (partsDashRev.length === 3) {
      const [d, m, y] = partsDashRev;
      if (d.length >= 1 && d.length <= 2 && m.length >= 1 && m.length <= 2 && y.length === 4) {
        const iso = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
        if (!isNaN(new Date(iso).getTime())) {
          onChange(iso);
          return;
        }
      }
    }

    // Fallback parsing for YYYY-MM-DD in case they typed that
    const partsDash = val.split("-");
    if (partsDash.length === 3) {
      const [y, m, d] = partsDash;
      if (y.length === 4 && m.length >= 1 && d.length >= 1) {
        const iso = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
        if (!isNaN(new Date(iso).getTime())) {
          onChange(iso);
          return;
        }
      }
    }

    // Fallback for D/M/YY
    if (parts.length === 3) {
      const [d, m, y] = parts;
      if (y.length === 2) {
        const fullY = "20" + y;
        const iso = `${fullY}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
        if (!isNaN(new Date(iso).getTime())) {
          onChange(iso);
          return;
        }
      }
    }

    // Revert if invalid
    if (date && !isNaN(date.getTime())) {
      const d = String(date.getDate()).padStart(2, "0");
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const y = date.getFullYear();
      setVal(`${d}/${m}/${y}`);
    } else {
      setVal("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  return (
    <input
      type="text"
      value={val}
      onChange={(e) => setVal(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      placeholder={"-"}
      className={`w-full h-full min-h-[38px] p-2 bg-transparent text-center focus:outline-none focus:bg-primary/10 transition-colors text-foreground font-semibold placeholder:text-[#004f71] placeholder:font-bold`}
    />
  );
};
