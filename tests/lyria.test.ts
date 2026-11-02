import { describe, expect, it } from 'bun:test';
import { lyriaAudioStream } from '@/lib/lyria';

const sse = (lines: string[]): ReadableStream<Uint8Array> =>
  new Response(lines.map((line) => `${line}\n\n`).join('')).body as ReadableStream<Uint8Array>;

const chunk = (delta: unknown) => `data: ${JSON.stringify({ choices: [{ delta }] })}`;

describe('lyriaAudioStream', () => {
  it('decodes the base64 audio deltas into bytes', async () => {
    const stream = lyriaAudioStream(
      sse([
        chunk({ content: '<instrumental>' }),
        ': OPENROUTER PROCESSING',
        chunk({ audio: { data: Buffer.from('ID3').toString('base64') } }),
        chunk({ audio: { data: Buffer.from('-frames').toString('base64') } }),
        'data: [DONE]',
      ]),
    );
    expect(await new Response(stream).text()).toBe('ID3-frames');
  });

  it('fails the stream on an upstream error chunk', async () => {
    const stream = lyriaAudioStream(
      sse([`data: ${JSON.stringify({ error: { message: 'no credits' } })}`]),
    );
    await expect(new Response(stream).text()).rejects.toThrow('no credits');
  });
});
