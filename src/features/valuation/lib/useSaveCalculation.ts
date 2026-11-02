import { useState } from "react";

export const useSaveCalculation = (_toolName: string) => {
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  const save = async (_label: string, _input: unknown, _result: unknown) => {
    setStatus("saving");
    await new Promise((resolve) => setTimeout(resolve, 350));
    setStatus("saved");
    window.setTimeout(() => setStatus("idle"), 2000);
  };

  return { save, status };
};
