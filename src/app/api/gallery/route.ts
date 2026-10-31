import { z } from 'zod';
import { galleryPage } from '@/lib/gallery-catalog';
import { parseFilters } from '@/lib/gallery-filters';

const cursorSchema = z.coerce.number().int().min(0).catch(0);

export const GET = (request: Request) => {
  const params = new URL(request.url).searchParams;
  const page = galleryPage(parseFilters(params), cursorSchema.parse(params.get('cursor')));
  return Response.json(page, { headers: { 'Cache-Control': 'no-store' } });
};
