'use client';

import { KeyRound, Loader2, Plus, Trash2 } from 'lucide-react';
import { type FormEvent, useCallback, useEffect, useState } from 'react';
import { CopyField } from '@/components/sites/editor/copy-field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { type ApiKeyRow, createApiKey, listApiKeys, revokeApiKey } from '@/lib/site-api';

type Loaded = { keys: ApiKeyRow[] } | { problem: string } | null;

const formatDate = (iso: string | null): string =>
  iso === null
    ? 'Never'
    : new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(iso));

export const ApiKeysPanel = ({ onSecret }: { onSecret: (secret: string) => void }) => {
  const [loaded, setLoaded] = useState<Loaded>(null);
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);

  const refresh = useCallback(() => {
    listApiKeys()
      .then((result) =>
        setLoaded(result.ok ? { keys: result.value.keys } : { problem: result.problem }),
      )
      .catch(() => undefined);
  }, []);

  useEffect(refresh, [refresh]);

  const create = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    const result = await createApiKey(name.trim() || 'MCP client');
    setBusy(false);
    if (!result.ok) {
      setProblem(result.problem);
      return;
    }
    setProblem(null);
    setName('');
    setSecret(result.value.secret);
    onSecret(result.value.secret);
    refresh();
  };

  const revoke = async (id: string) => {
    const result = await revokeApiKey(id);
    setProblem(result.ok ? null : result.problem);
    refresh();
  };

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={(event) => create(event).catch(() => setBusy(false))} className="flex gap-2">
        <Input
          value={name}
          maxLength={60}
          placeholder="Key name, for example Claude Code on my laptop"
          onChange={(event) => setName(event.target.value)}
          aria-label="Key name"
        />
        <Button type="submit" disabled={busy}>
          {busy ? <Loader2 className="animate-spin" /> : <Plus />}
          Create key
        </Button>
      </form>
      {problem === null ? null : <p className="text-destructive text-sm">{problem}</p>}
      {secret === null ? null : (
        <div className="rounded-xl bg-emerald-500/10 p-4">
          <CopyField
            id="new-api-key"
            label="Your new API key"
            value={secret}
            hint="Copy it now. For your safety it is only shown once; the setup steps below already include it."
          />
        </div>
      )}
      {loaded === null ? (
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      ) : 'problem' in loaded ? (
        <p className="rounded-xl bg-muted/60 p-4 text-muted-foreground text-sm">{loaded.problem}</p>
      ) : loaded.keys.length === 0 ? (
        <p className="text-muted-foreground text-sm">No keys yet.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-border rounded-xl bg-muted/40">
          {loaded.keys.map((key) => (
            <li key={key.id} className="flex items-center gap-3 px-4 py-3 text-sm">
              <KeyRound className="size-4 shrink-0 text-muted-foreground" />
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate font-medium">{key.name}</span>
                <span className="text-muted-foreground text-xs">
                  Created {formatDate(key.createdAt)} · Last used {formatDate(key.lastUsedAt)}
                </span>
              </div>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => revoke(key.id).catch(() => undefined)}
              >
                <Trash2 />
                Revoke
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
