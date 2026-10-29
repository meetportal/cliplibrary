'use client';

import { Clapperboard, Globe, Sparkles } from 'lucide-react';
import { type ReactNode, useEffect, useState } from 'react';
import { PendingNotice } from '@/components/auth/access-gate';
import { CopyField } from '@/components/sites/editor/copy-field';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ApiKeysPanel } from './api-keys-panel';
import { CodeBlock } from './code-block';

const KEY_PLACEHOLDER = '<your API key>';

const CAPABILITIES = [
  {
    icon: Clapperboard,
    title: 'Videos',
    tools: 'search_clips, get_clip, create_video, add_clip, edit_video',
    detail: 'Find labelled animation clips and assemble them into an editable video.',
  },
  {
    icon: Globe,
    title: 'Websites',
    tools: 'list_site_templates, get_site_template, create_site, edit_site',
    detail: 'Fill a template and publish it as a shareable website link.',
  },
] as const;

const snippets = (endpoint: string, key: string) => ({
  claude: `claude mcp add --transport http neuclip ${endpoint} \\\n  --header "Authorization: Bearer ${key}"`,
  cursor: JSON.stringify(
    { mcpServers: { neuclip: { url: endpoint, headers: { Authorization: `Bearer ${key}` } } } },
    null,
    2,
  ),
  other: `POST ${endpoint}\nAuthorization: Bearer ${key}\nContent-Type: application/json\nAccept: application/json, text/event-stream`,
});

const Section = ({
  step,
  title,
  children,
}: {
  step: number;
  title: string;
  children: ReactNode;
}) => (
  <section className="flex flex-col gap-4">
    <h2 className="flex items-center gap-3 font-semibold text-lg">
      <span className="flex size-7 items-center justify-center rounded-full bg-foreground text-background text-sm">
        {step}
      </span>
      {title}
    </h2>
    {children}
  </section>
);

export const McpSetup = ({ approved }: { approved: boolean }) => {
  const [origin, setOrigin] = useState('');
  const [secret, setSecret] = useState<string | null>(null);
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);
  const endpoint = `${origin}/mcp`;
  const code = snippets(endpoint, secret ?? KEY_PLACEHOLDER);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 py-10 sm:px-6">
      <header className="flex flex-col gap-2">
        <span className="flex items-center gap-2 font-medium text-sm text-violet-600 dark:text-violet-400">
          <Sparkles className="size-4" />
          MCP
        </span>
        <h1 className="font-semibold text-3xl tracking-tight">Use neuclip from your agent</h1>
        <p className="text-muted-foreground">
          Connect Claude Code, Cursor or any MCP client to build videos and publish websites from a
          prompt.
        </p>
      </header>
      {approved ? null : <PendingNotice />}
      <ul className="grid gap-3 sm:grid-cols-2">
        {CAPABILITIES.map((capability) => (
          <li key={capability.title} className="flex flex-col gap-2 rounded-2xl bg-muted/50 p-4">
            <span className="flex items-center gap-2 font-medium">
              <capability.icon className="size-4" />
              {capability.title}
            </span>
            <span className="text-muted-foreground text-sm">{capability.detail}</span>
            <code className="text-muted-foreground text-xs">{capability.tools}</code>
          </li>
        ))}
      </ul>
      <Section step={1} title="Your MCP endpoint">
        <CopyField
          id="mcp-endpoint"
          label="Server URL"
          value={endpoint}
          hint="Streamable HTTP. Every request needs one of your API keys."
        />
      </Section>
      <Section step={2} title="Create an API key">
        {approved ? (
          <ApiKeysPanel onSecret={setSecret} />
        ) : (
          <p className="text-muted-foreground text-sm">
            You can create keys once your account is approved.
          </p>
        )}
      </Section>
      <Section step={3} title="Add it to your client">
        <Tabs defaultValue="claude">
          <TabsList>
            <TabsTrigger value="claude">Claude Code</TabsTrigger>
            <TabsTrigger value="cursor">Cursor and others</TabsTrigger>
            <TabsTrigger value="other">Raw HTTP</TabsTrigger>
          </TabsList>
          <TabsContent value="claude" className="mt-3">
            <CodeBlock label="Claude Code command" code={code.claude} />
          </TabsContent>
          <TabsContent value="cursor" className="mt-3 flex flex-col gap-2">
            <p className="text-muted-foreground text-sm">Add this to your client's mcp.json.</p>
            <CodeBlock label="MCP config" code={code.cursor} />
          </TabsContent>
          <TabsContent value="other" className="mt-3">
            <CodeBlock label="HTTP headers" code={code.other} />
          </TabsContent>
        </Tabs>
      </Section>
    </div>
  );
};
