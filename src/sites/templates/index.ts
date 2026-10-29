import type { SiteTemplate } from '../types';
import { emeraldRoseDefaults, emeraldRoseMeta, emeraldRoseSchema } from './weddings/emerald-rose';
import { emeraldRoseControls } from './weddings/emerald-rose-controls';

export const SITE_TEMPLATES: readonly SiteTemplate[] = [
  {
    id: emeraldRoseMeta.id,
    meta: emeraldRoseMeta,
    schema: emeraldRoseSchema,
    defaults: emeraldRoseDefaults,
    controls: emeraldRoseControls,
  },
];

export const findSiteTemplate = (id: string): SiteTemplate | undefined =>
  SITE_TEMPLATES.find((template) => template.id === id);
