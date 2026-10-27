'use client';

import { ArrowRight, Check, CircleAlert, Wrench, X } from 'lucide-react';
import { describePath, type PathTarget, readPointer } from '@/agent/describe-path';
import type { MediaKind } from '@/agent/media';
import type { MediaAgentMessage } from '@/agent/tools';
import { AgentValue } from './agent-value';
import { RawJson, type StepTone, TraceStep } from './trace-step';

export type EditPart = Extract<MediaAgentMessage['parts'][number], { type: 'tool-editMedia' }>;

type DraftOperation = NonNullable<
  NonNullable<NonNullable<EditPart['input']>['operations']>[number]
>;

const OP_STYLES: Record<string, string> = {
  replace: 'bg-sky-500/10 text-sky-700 dark:text-sky-300',
  add: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  remove: 'bg-destructive/10 text-destructive',
  move: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
  copy: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
};

const stateOf = (part: EditPart): { label: string; tone: StepTone; live: boolean } => {
  if (part.state === 'input-streaming') {
    return { label: 'Preparing operations', tone: 'active', live: true };
  }
  if (part.state === 'input-available') {
    return { label: 'Validating', tone: 'active', live: true };
  }
  if (part.state === 'output-available') {
    return part.output.ok
      ? { label: 'Applied', tone: 'success', live: false }
      : { label: 'Rejected', tone: 'warning', live: false };
  }
  return { label: 'Failed', tone: 'error', live: false };
};

interface OperationGroup {
  key: string;
  operation: DraftOperation;
  target: PathTarget;
  before: unknown;
  paths: string[];
}

const groupOperations = (
  operations: readonly DraftOperation[],
  kind: MediaKind,
  document: unknown,
): OperationGroup[] => {
  const groups = new Map<string, OperationGroup>();
  for (const operation of operations) {
    const path = operation.path ?? '';
    const target = describePath(kind, document, path);
    const before = readPointer(document, path);
    const key = JSON.stringify([
      operation.op,
      target,
      operation.from,
      operation.op === 'add' ? null : before,
      operation.value,
    ]);
    const group = groups.get(key);
    if (group === undefined) {
      groups.set(key, { key, operation, target, before, paths: [path] });
    } else {
      group.paths.push(path);
    }
  }
  return [...groups.values()];
};

const ValueChange = ({ operation, before }: { operation: DraftOperation; before: unknown }) => {
  if (operation.op === 'remove') {
    return (
      <>
        <AgentValue value={before} />
        <ArrowRight className="size-3 text-muted-foreground" />
        <span className="text-destructive">removed</span>
      </>
    );
  }
  if (operation.op === 'move' || operation.op === 'copy') {
    return <span className="font-mono text-muted-foreground">from {operation.from}</span>;
  }
  return (
    <>
      {operation.op === 'add' ? null : (
        <>
          <AgentValue value={before} />
          <ArrowRight className="size-3 text-muted-foreground" />
        </>
      )}
      <AgentValue value={operation.value} />
    </>
  );
};

const OperationRow = ({ group }: { group: OperationGroup }) => {
  const { operation, target, paths } = group;
  return (
    <li className="rounded-md border bg-background px-2.5 py-2" data-testid="agent-operation">
      <div className="flex items-start gap-2">
        <span
          className={`shrink-0 rounded px-1.5 py-0.5 font-medium font-mono text-[10px] uppercase ${OP_STYLES[operation.op ?? ''] ?? 'bg-muted'}`}
        >
          {operation.op ?? '…'}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-foreground text-xs">
            {target.scope}
            {target.section === null ? null : (
              <span className="text-muted-foreground"> › {target.section}</span>
            )}
            <span className="text-muted-foreground"> › </span>
            {target.field}
          </p>
          <p
            className="truncate font-mono text-[10px] text-muted-foreground"
            title={paths.join('\n')}
          >
            {paths[0]}
            {paths.length > 1 ? ` +${paths.length - 1} more` : ''}
          </p>
        </div>
        {paths.length > 1 ? (
          <span className="shrink-0 rounded-full bg-muted px-1.5 py-0.5 font-medium text-[10px] tabular-nums">
            ×{paths.length}
          </span>
        ) : null}
      </div>
      <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[11px]">
        <ValueChange operation={operation} before={group.before} />
      </div>
    </li>
  );
};

const EditOutcome = ({ part }: { part: EditPart }) => {
  const rejection = part.state === 'output-available' && !part.output.ok ? part.output.error : null;
  return (
    <>
      {part.state === 'output-available' && part.output.ok ? (
        <p className="flex items-center gap-1.5 text-emerald-700 text-xs dark:text-emerald-400">
          <Check className="size-3.5" /> Passed schema validation, applied as one undo step
        </p>
      ) : null}
      {rejection === null ? null : (
        <div className="rounded-md border border-amber-500/40 bg-amber-500/5 p-2 text-xs">
          <p className="font-medium text-amber-700 dark:text-amber-400">
            Validation rejected this edit. The error went back to the model:
          </p>
          <pre className="mt-1 max-h-40 overflow-auto whitespace-pre-wrap break-all font-mono text-[11px]">
            {rejection}
          </pre>
        </div>
      )}
      {part.state === 'output-error' ? (
        <p className="text-destructive text-xs">{part.errorText}</p>
      ) : null}
      <div className="flex flex-col gap-1">
        {part.input === undefined ? null : <RawJson label="Tool input" value={part.input} />}
        {part.state === 'output-available' ? (
          <RawJson label="Tool output" value={part.output} />
        ) : null}
      </div>
    </>
  );
};

interface EditStepProps {
  part: EditPart;
  attempt: number;
  kind: MediaKind;
  document: unknown;
}

export const EditStep = ({ part, attempt, kind, document }: EditStepProps) => {
  const state = stateOf(part);
  const operations = (part.input?.operations ?? []).flatMap((operation) =>
    operation === undefined ? [] : [operation],
  );
  const Icon = part.state === 'output-available' ? (part.output.ok ? Check : X) : Wrench;
  return (
    <TraceStep
      icon={part.state === 'output-error' ? CircleAlert : Icon}
      tone={state.tone}
      live={state.live}
      title={
        <>
          editMedia
          {attempt > 1 ? <span className="text-muted-foreground"> · attempt {attempt}</span> : null}
        </>
      }
      meta={`${state.label}${operations.length > 0 ? ` · ${operations.length} op${operations.length === 1 ? '' : 's'}` : ''}`}
    >
      <div className="space-y-2" data-testid="agent-edit" data-state={part.state}>
        {part.input?.summary === undefined ? null : (
          <p className="text-muted-foreground text-xs italic">“{part.input.summary}”</p>
        )}
        {operations.length === 0 ? (
          <p className="text-muted-foreground text-xs">Choosing which controls to change…</p>
        ) : (
          <ul className="space-y-1.5">
            {groupOperations(operations, kind, document).map((group) => (
              <OperationRow key={group.key} group={group} />
            ))}
          </ul>
        )}
        <EditOutcome part={part} />
      </div>
    </TraceStep>
  );
};
