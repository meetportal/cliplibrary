import { copyFileSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { $ } from 'bun';
import { type FootageSpec, PLATE_STAMP, type PlateSegment } from '@/footage/footage-spec';
import { plateFile, publishDir, shotFile } from './footage-paths';

const frameName = (index: number) => `${String(index + 1).padStart(5, '0')}.png`;

const segmentFrames = ({ from, to, step = 1 }: PlateSegment): number[] => {
  const direction = to >= from ? 1 : -1;
  const count = Math.floor(Math.abs(to - from) / step) + 1;
  return Array.from({ length: count }, (_, index) => from + direction * index * step);
};

const stampFilter = (spec: FootageSpec): string => {
  const block = spec.width / PLATE_STAMP.bits;
  const boxes = Array.from(
    { length: PLATE_STAMP.bits },
    (_, bit) =>
      `drawbox=x=${bit * block}:y=${spec.height}:w=${block}:h=${PLATE_STAMP.rows}:color=white:t=fill:enable='eq(mod(floor(n/${2 ** bit}),2),1)'`,
  );
  return [`pad=iw:ih+${PLATE_STAMP.rows}:0:0:black`, ...boxes].join(',');
};

export const plateFrameOrder = (spec: FootageSpec) =>
  spec.plate.flatMap((segment) =>
    segmentFrames(segment).map((frame) => ({ shot: segment.shot, frame })),
  );

export const assemblePlate = async (spec: FootageSpec): Promise<void> => {
  const work = mkdtempSync(join(tmpdir(), `${spec.id}-plate-`));
  try {
    const shots = [...new Set(spec.plate.map((segment) => segment.shot))];
    for (const shot of shots) {
      mkdirSync(join(work, shot));
      const fit = `scale=${spec.width}:-2:flags=lanczos,crop=${spec.width}:${spec.height}`;
      await $`ffmpeg -v error -i ${shotFile(spec, shot)} -vf ${fit} ${join(work, shot, '%05d.png')}`;
    }
    const sequence = join(work, 'sequence');
    mkdirSync(sequence);
    plateFrameOrder(spec).forEach(({ shot, frame }, index) => {
      copyFileSync(join(work, shot, frameName(frame)), join(sequence, frameName(index)));
    });
    mkdirSync(publishDir(spec), { recursive: true });
    await $`ffmpeg -v error -y -framerate ${spec.fps} -i ${join(sequence, '%05d.png')} -vf ${stampFilter(spec)} -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart ${plateFile(spec)}`;
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
};
