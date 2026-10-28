'use client';

import { ScanSearch } from 'lucide-react';
import type { AgentContext } from '@/agent/trace';
import { RawJson, TraceStep } from './trace-step';

const Fact = ({ label, value }: { label: string; value: string }) => (
  <div className="min-w-0 rounded-md bg-muted/50 px-2 py-1.5">
    <dt className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</dt>
    <dd className="truncate font-medium text-foreground text-xs">{value}</dd>
  </div>
);

export const ContextStep = ({ context }: { context: AgentContext }) => {
  const facts: [string, string][] = [
    ['Canvas', context.canvas],
    ...(context.timing === null ? [] : ([['Timing', context.timing]] as [string, string][])),
    [
      'Elements',
      `${context.elements} on ${context.layers} layer${context.layers === 1 ? '' : 's'}`,
    ],
    ['Controls', `${context.controls} ${context.kind === 'clip' ? 'mapped' : 'theme controls'}`],
    ['Selected', context.selection.length === 0 ? 'Nothing' : context.selection.join(', ')],
    ['History', `${context.history} message${context.history === 1 ? '' : 's'}`],
    ['Hidden media', `${context.assets} asset${context.assets === 1 ? '' : 's'}`],
    ['Model', context.model.replace(/^google\//, '')],
  ];
  return (
    <TraceStep
      icon={ScanSearch}
      tone="success"
      title={`Read the ${context.kind === 'clip' ? 'video' : 'poster'}`}
      meta={`${(context.documentBytes / 1024).toFixed(1)} KB sent`}
      collapsible
    >
      <div className="space-y-2" data-testid="agent-context">
        <dl className="grid grid-cols-2 gap-1.5">
          {facts.map(([label, value]) => (
            <Fact key={label} label={label} value={value} />
          ))}
        </dl>
        <p className="text-[11px] text-muted-foreground">
          Falls back to {context.fallbackModel.replace(/^google\//, '')} if the main model is busy.
        </p>
        <RawJson
          label={`System prompt · ${context.instructions.length.toLocaleString()} characters`}
          value={context.instructions}
        />
      </div>
    </TraceStep>
  );
};
