import { useState } from "react";

export function CodePanel({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="relative rounded-xl bg-code" dir="ltr">
      <button
        onClick={() => { navigator.clipboard?.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
        className="absolute end-2 top-2 rounded-md bg-secondary px-2 py-1 text-[11px] text-secondary-foreground hover:bg-accent"
      >
        {copied ? "Copied" : "Copy"}
      </button>
      <pre className="overflow-x-auto p-3 pe-16 font-mono text-[11px] leading-relaxed text-primary">{code}</pre>
    </div>
  );
}
