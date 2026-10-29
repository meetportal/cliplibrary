import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';
import {
  decodeSite,
  encodeSite,
  type SharedSite,
  type SiteCheck,
  type SiteLinkQuery,
} from '@/sites/site-link';

const secret = (): string => {
  // biome-ignore lint/style/noProcessEnv: the link signing secret is server-only configuration
  const { SITE_LINK_SECRET: value } = process.env;
  if (value === undefined || value.length < 32) {
    throw new Error('Set SITE_LINK_SECRET to a random string of at least 32 characters.');
  }
  return value;
};

const signature = (data: string): string =>
  createHmac('sha256', secret()).update(data).digest('base64url');

export const signSite = (site: SharedSite): SiteLinkQuery => {
  const d = encodeSite(site);
  return { d, sig: signature(d) };
};

export const openSignedSite = ({ d, sig }: SiteLinkQuery): SiteCheck => {
  const expected = Buffer.from(signature(d));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) {
    return { ok: false, error: 'This website link is not valid.' };
  }
  return decodeSite(d);
};
