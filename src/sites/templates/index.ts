import type { SiteTemplate } from '../types';
import { emeraldRoseDefaults, emeraldRoseMeta, emeraldRoseSchema } from './weddings/emerald-rose';
import { emeraldRoseControls } from './weddings/emerald-rose-controls';
import { inkAndLaceDefaults, inkAndLaceMeta, inkAndLaceSchema } from './weddings/ink-and-lace';
import { inkAndLaceControls } from './weddings/ink-and-lace-controls';

export const SITE_TEMPLATES: readonly SiteTemplate[] = [
  {
    id: emeraldRoseMeta.id,
    meta: emeraldRoseMeta,
    schema: emeraldRoseSchema,
    defaults: emeraldRoseDefaults,
    controls: emeraldRoseControls,
    headline: (content) => {
      const parsed = emeraldRoseSchema.safeParse(content);
      return parsed.success
        ? `${parsed.data.couple.firstName} & ${parsed.data.couple.secondName}`
        : emeraldRoseMeta.title;
    },
  },
  {
    id: inkAndLaceMeta.id,
    meta: inkAndLaceMeta,
    schema: inkAndLaceSchema,
    defaults: inkAndLaceDefaults,
    controls: inkAndLaceControls,
    headline: (content) => {
      const parsed = inkAndLaceSchema.safeParse(content);
      return parsed.success
        ? `${parsed.data.couple.firstName} & ${parsed.data.couple.secondName}`
        : inkAndLaceMeta.title;
    },
  },
];

export const findSiteTemplate = (id: string): SiteTemplate | undefined =>
  SITE_TEMPLATES.find((template) => template.id === id);
