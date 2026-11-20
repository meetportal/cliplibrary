import { AbsoluteFill, useCurrentFrame } from 'remotion';
import type { AppScreensPromoProps } from '@/schemas';
import { useLogoBox } from '../../kit/use-logo-box';
import { Backdrop } from './backdrop';
import { CAPTION_WIDTH, Caption } from './caption';
import { EndCard } from './end-card';
import { useFacesReady } from './fonts';
import { Intro } from './intro';
import { phonePose, phoneSpecs, phoneVisible } from './layout';
import { paletteFor } from './palette';
import { Phone } from './phone';
import { FEATURE_1, FEATURE_2 } from './timeline';

const SIDE = 170;

export const AppScreensPromo = (props: AppScreensPromoProps) => {
  const frame = useCurrentFrame();
  const ready = useFacesReady(props.type.font);
  const logo = useLogoBox(props.logo);
  const palette = paletteFor(props);
  const specs = phoneSpecs(props);
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {props.showBackground && (
        <Backdrop
          background={palette.background}
          shape={palette.shape}
          frame={frame}
          drift={props.backdrop.drift}
        />
      )}
      <Intro props={props} palette={palette} logo={logo} frame={frame} ready={ready} />
      {specs
        .filter((spec) => phoneVisible(spec, frame))
        .map((spec) => {
          const pose = phonePose(spec, frame, props.phones.float);
          return <Phone key={spec.key} src={props[pose.screen]} pose={pose} palette={palette} />;
        })}
      <Caption
        props={props}
        feature={props.feature1}
        palette={palette}
        frame={frame}
        ready={ready}
        left={SIDE}
        start={FEATURE_1.textIn}
        leave={FEATURE_1.textOut}
      />
      <Caption
        props={props}
        feature={props.feature2}
        palette={palette}
        frame={frame}
        ready={ready}
        left={1920 - SIDE - CAPTION_WIDTH + 60}
        start={FEATURE_2.textIn}
        leave={FEATURE_2.textOut}
      />
      <EndCard props={props} palette={palette} logo={logo} frame={frame} ready={ready} />
    </AbsoluteFill>
  );
};
