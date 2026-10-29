import { siteStore } from '@/lib/site-store';

export const GET = async (
  _request: Request,
  { params }: { params: Promise<{ assetId: string }> },
) => {
  const { assetId } = await params;
  const asset = await siteStore.getAsset(assetId);
  if (asset === null) {
    return new Response('Not found', { status: 404 });
  }
  return new Response(new Blob([new Uint8Array(asset.bytes)], { type: asset.contentType }), {
    headers: { 'cache-control': 'public, max-age=31536000, immutable' },
  });
};
