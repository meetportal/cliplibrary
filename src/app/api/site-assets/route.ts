import { siteStore } from '@/lib/site-store';
import { MAX_ASSET_BYTES } from '@/sites/store';

export const POST = async (request: Request) => {
  const declared = Number(request.headers.get('content-length') ?? 0);
  if (declared > MAX_ASSET_BYTES) {
    return Response.json({ problem: 'Images must be under 8 MB.' }, { status: 413 });
  }
  const bytes = new Uint8Array(await request.arrayBuffer());
  const contentType = (request.headers.get('content-type') ?? '').split(';')[0]?.trim() ?? '';
  const result = await siteStore.putAsset(bytes, contentType);
  return result.ok
    ? Response.json({ url: `/api/site-assets/${result.value}` }, { status: 201 })
    : Response.json({ problem: result.problem }, { status: result.status });
};
