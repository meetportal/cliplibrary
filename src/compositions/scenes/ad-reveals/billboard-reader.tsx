import { Composition } from 'remotion';
import { billboardReaderDefaults, billboardReaderMeta, billboardReaderSchema } from '@/schemas';
import { BillboardReader } from '../../ad-reveals/billboard-reader/billboard-reader';
import type { SceneModule } from '../../scene-module';

export const billboardReaderScene: SceneModule = {
  id: 'billboard-reader',
  component: BillboardReader,
  render: (key) => (
    <Composition
      key={key}
      id="billboard-reader"
      component={BillboardReader}
      schema={billboardReaderSchema}
      defaultProps={billboardReaderDefaults}
      durationInFrames={billboardReaderMeta.durationInFrames}
      fps={billboardReaderMeta.fps}
      width={billboardReaderMeta.width}
      height={billboardReaderMeta.height}
    />
  ),
};
