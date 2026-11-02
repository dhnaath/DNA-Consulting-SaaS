import { useState } from "react";
export function useSaveCalculation(toolName: string) {
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const save = async (label: string, input: any, result: any) => {
    setStatus("saving");
    setTimeout(() => {
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    }, 500);
  };
  return { save, status };
}
