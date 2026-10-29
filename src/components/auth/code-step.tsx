'use client';

import { Loader2 } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormError } from './auth-shell';

interface CodeStepProps {
  email: string;
  onVerify: (code: string) => Promise<string | null>;
  onResend: () => Promise<string | null>;
}

export const CodeStep = ({ email, onVerify, onResend }: CodeStepProps) => {
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const [resent, setResent] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setProblem(await onVerify(code.trim()));
    setBusy(false);
  };

  return (
    <form
      onSubmit={(event) => submit(event).catch(() => setBusy(false))}
      className="flex flex-col gap-4"
    >
      <p className="text-muted-foreground text-sm">
        We sent a 6-digit code to <span className="font-medium text-foreground">{email}</span>.
      </p>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="auth-code">Verification code</Label>
        <Input
          id="auth-code"
          inputMode="numeric"
          autoComplete="one-time-code"
          autoFocus
          maxLength={6}
          value={code}
          onChange={(event) => setCode(event.target.value.replace(/\D/g, ''))}
          className="text-center font-mono text-lg tracking-[0.5em]"
        />
      </div>
      <FormError message={problem} />
      <Button type="submit" disabled={busy || code.length < 6}>
        {busy ? <Loader2 className="animate-spin" /> : null}
        Verify
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={resent}
        onClick={() => {
          setResent(true);
          onResend()
            .then(setProblem)
            .catch(() => undefined);
        }}
      >
        {resent ? 'Code sent again' : 'Send a new code'}
      </Button>
    </form>
  );
};
