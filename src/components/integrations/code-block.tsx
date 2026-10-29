'use client';

import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export const CodeBlock = ({ code, label }: { code: string; label: string }) => {
  const [copied, setCopied] = useState(false);
  return (
    <div className="relative rounded-xl bg-muted/70">
      <pre className="overflow-x-auto p-4 pr-24 font-mono text-xs leading-relaxed">
        <code>{code}</code>
      </pre>
      <Button
        type="button"
        size="sm"
        variant="secondary"
        aria-label={`Copy ${label}`}
        className="absolute top-2 right-2"
        onClick={() => {
          navigator.clipboard
            .writeText(code)
            .then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            })
            .catch(() => undefined);
        }}
      >
        {copied ? <Check /> : <Copy />}
        {copied ? 'Copied' : 'Copy'}
      </Button>
    </div>
  );
};
