'use client';

import { useSignIn } from '@clerk/nextjs';
import { Loader2 } from 'lucide-react';
import { type FormEvent, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Divider, FormError } from './auth-shell';
import { CodeStep } from './code-step';
import { GoogleButton } from './google-button';
import { describeAuthError } from './use-account';
import { useFinish } from './use-finish';

const NEEDS_CODE = new Set(['needs_second_factor', 'needs_client_trust']);

export const SignInForm = ({ returnTo }: { returnTo: string }) => {
  const { signIn } = useSignIn();
  const navigate = useFinish(returnTo);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const [needsCode, setNeedsCode] = useState(false);
  const resumed = useRef(false);

  useEffect(() => {
    if (resumed.current || !NEEDS_CODE.has(signIn.status)) {
      return;
    }
    resumed.current = true;
    setEmail(signIn.identifier ?? '');
    signIn.mfa
      .sendEmailCode()
      .then(({ error }) => {
        setProblem(describeAuthError(error));
        setNeedsCode(error === null);
      })
      .catch(() => undefined);
  }, [signIn]);

  const finish = async (): Promise<string | null> => {
    const { error } = await signIn.finalize({ navigate });
    return describeAuthError(error);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setProblem(null);
    const { error } = await signIn.password({ identifier: email.trim(), password });
    if (error !== null) {
      setProblem(describeAuthError(error));
    } else if (signIn.status === 'complete') {
      setProblem(await finish());
    } else if (NEEDS_CODE.has(signIn.status)) {
      const sent = await signIn.mfa.sendEmailCode();
      setProblem(describeAuthError(sent.error));
      setNeedsCode(sent.error === null);
    } else {
      setProblem('This account cannot sign in with a password. Try Google instead.');
    }
    setBusy(false);
  };

  if (needsCode) {
    return (
      <CodeStep
        email={email}
        onVerify={async (code) => {
          const { error } = await signIn.mfa.verifyEmailCode({ code });
          return error === null ? finish() : describeAuthError(error);
        }}
        onResend={async () => describeAuthError((await signIn.mfa.sendEmailCode()).error)}
      />
    );
  }

  return (
    <>
      <GoogleButton returnTo={returnTo} />
      <Divider />
      <form
        onSubmit={(event) => submit(event).catch(() => setBusy(false))}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="sign-in-email">Email</Label>
          <Input
            id="sign-in-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="sign-in-password">Password</Label>
          <Input
            id="sign-in-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <FormError message={problem} />
        <Button type="submit" disabled={busy}>
          {busy ? <Loader2 className="animate-spin" /> : null}
          Sign in
        </Button>
      </form>
    </>
  );
};
