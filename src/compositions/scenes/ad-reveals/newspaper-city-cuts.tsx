import { AbsoluteFill, Composition, Sequence, useCurrentFrame } from 'remotion';
import {
  type NewspaperCityCutsProps,
  newspaperCityCutsDefaults,
  newspaperCityCutsMeta,
  newspaperCityCutsSchema,
} from '@/schemas';
import { FootageStage } from '../../footage/footage-stage';
import { EndCard } from '../../newspaper-city-cuts/end-card';
import { NewspaperPrints } from '../../newspaper-city-cuts/newspaper-prints';
import { CITY_CUTS_PLATE } from '../../newspaper-city-cuts/plate';
import { TransitionFrame } from '../../promo/transition-frame';
import type { SceneModule } from '../../scene-module';

const NewspaperCityCuts = (props: NewspaperCityCutsProps) => {
  const frame = useCurrentFrame();
  const cut = props.endCard.cutFrame;
  return (
    <TransitionFrame motion={props.motion}>
      <AbsoluteFill style={{ backgroundColor: props.endCard.background, overflow: 'hidden' }}>
        {frame < cut ? (
          <Sequence durationInFrames={cut} layout="none">
            <FootageStage plate={CITY_CUTS_PLATE} frame={frame}>
              <NewspaperPrints props={props} />
            </FootageStage>
          </Sequence>
        ) : (
          <EndCard endCard={props.endCard} frame={frame} />
        )}
      </AbsoluteFill>
    </TransitionFrame>
  );
};

export const newspaperCityCutsScene: SceneModule = {
  id: 'newspaper-city-cuts',
  component: NewspaperCityCuts,
  render: (key) => (
    <Composition
      key={key}
      id="newspaper-city-cuts"
      component={NewspaperCityCuts}
      schema={newspaperCityCutsSchema}
      defaultProps={newspaperCityCutsDefaults}
      durationInFrames={newspaperCityCutsMeta.durationInFrames}
      fps={newspaperCityCutsMeta.fps}
      width={newspaperCityCutsMeta.width}
      height={newspaperCityCutsMeta.height}
    />
  ),
};
