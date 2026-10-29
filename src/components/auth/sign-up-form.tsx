'use client';

import { useSignUp } from '@clerk/nextjs';
import { Loader2 } from 'lucide-react';
import { type ComponentProps, type FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Divider, FormError } from './auth-shell';
import { CodeStep } from './code-step';
import { GoogleButton } from './google-button';
import { describeAuthError } from './use-account';
import { useFinish } from './use-finish';

const Field = ({
  id,
  label,
  ...input
}: { id: string; label: string } & ComponentProps<typeof Input>) => (
  <div className="flex flex-col gap-1.5">
    <Label htmlFor={id}>{label}</Label>
    <Input id={id} {...input} />
  </div>
);

export const SignUpForm = ({ returnTo }: { returnTo: string }) => {
  const { signUp } = useSignUp();
  const navigate = useFinish(returnTo);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setProblem(null);
    const created = await signUp.password({
      emailAddress: email.trim(),
      password,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    });
    if (created.error === null) {
      const sent = await signUp.verifications.sendEmailCode();
      setProblem(describeAuthError(sent.error));
      setVerifying(sent.error === null);
    } else {
      setProblem(describeAuthError(created.error));
    }
    setBusy(false);
  };

  if (verifying) {
    return (
      <CodeStep
        email={email}
        onVerify={async (code) => {
          const { error } = await signUp.verifications.verifyEmailCode({ code });
          if (error !== null) {
            return describeAuthError(error);
          }
          if (signUp.status !== 'complete') {
            return 'Almost there. Please check your details and try again.';
          }
          return describeAuthError((await signUp.finalize({ navigate })).error);
        }}
        onResend={async () => describeAuthError((await signUp.verifications.sendEmailCode()).error)}
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
        <div className="grid grid-cols-2 gap-3">
          <Field
            id="sign-up-first"
            label="First name"
            autoComplete="given-name"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
          />
          <Field
            id="sign-up-last"
            label="Last name"
            autoComplete="family-name"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
          />
        </div>
        <Field
          id="sign-up-email"
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Field
          id="sign-up-password"
          label="Password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <div id="clerk-captcha" />
        <FormError message={problem} />
        <Button type="submit" disabled={busy}>
          {busy ? <Loader2 className="animate-spin" /> : null}
          Create account
        </Button>
      </form>
    </>
  );
};
