'use client';

import { Monitor, Smartphone } from 'lucide-react';
import { type ReactNode, useMemo, useRef, useState } from 'react';
import { PropertiesPanel } from '@/components/editor/properties-panel';
import { Button } from '@/components/ui/button';
import { resolveClipControls } from '@/core/clip-controls';
import { cn } from '@/lib/utils';
import type { SiteTemplate } from '@/sites/types';
import { SiteCanvas } from '../site-canvas';
import { type BoundSite, bindSite } from '../site-registry';
import type { SubmitRsvp } from '../site-view';

type Device = 'phone' | 'desktop';

interface SiteWorkspaceProps {
  template: SiteTemplate;
  values: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
  toolbar: ReactNode;
  status: ReactNode;
  introRun: number;
}

const previewRsvp: SubmitRsvp = () => Promise.resolve();

const useLastValidSite = (templateId: string, values: unknown): BoundSite | null => {
  const last = useRef<BoundSite | null>(null);
  const site = bindSite(templateId, values);
  if (site !== null) {
    last.current = site;
  }
  return site ?? last.current;
};

export const SiteWorkspace = ({
  template,
  values,
  onChange,
  toolbar,
  status,
  introRun,
}: SiteWorkspaceProps) => {
  const [device, setDevice] = useState<Device>('phone');
  const sections = useMemo(
    () => resolveClipControls(template.schema, template.controls, template.defaults),
    [template],
  );
  const site = useLastValidSite(template.id, values);

  return (
    <div className="flex flex-col lg:h-[calc(100dvh-3.5rem)] lg:flex-row">
      <div className="flex h-[82dvh] flex-col gap-3 bg-muted/40 p-3 sm:p-4 lg:h-auto lg:min-h-0 lg:flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <div className="hidden rounded-lg bg-muted p-0.5 sm:flex">
            {(['phone', 'desktop'] as const).map((option) => (
              <Button
                key={option}
                type="button"
                size="sm"
                variant="ghost"
                aria-pressed={device === option}
                onClick={() => setDevice(option)}
                className={cn(device === option && 'bg-background shadow-sm hover:bg-background')}
              >
                {option === 'phone' ? <Smartphone /> : <Monitor />}
                {option === 'phone' ? 'Phone' : 'Desktop'}
              </Button>
            ))}
          </div>
          <div className="text-muted-foreground text-xs">{status}</div>
          <div className="ml-auto flex flex-wrap items-center gap-2">{toolbar}</div>
        </div>
        <div className="flex min-h-0 flex-1 justify-center">
          <div
            className={cn(
              'h-full overflow-hidden bg-background shadow-xl ring-1 ring-foreground/10 transition-[width] duration-300',
              device === 'phone' ? 'w-[390px] max-w-full rounded-[28px]' : 'w-full rounded-xl',
            )}
          >
            {site === null ? (
              <p className="p-8 text-center text-muted-foreground text-sm">
                Some values are not valid yet.
              </p>
            ) : (
              <SiteCanvas site={site} layout="frame" introRun={introRun} onRsvp={previewRsvp} />
            )}
          </div>
        </div>
      </div>
      <aside className="shrink-0 border-border border-t px-4 lg:w-[360px] lg:overflow-y-auto lg:border-t-0 lg:border-l">
        <PropertiesPanel sections={sections} values={values} onChange={onChange} />
      </aside>
    </div>
  );
};
