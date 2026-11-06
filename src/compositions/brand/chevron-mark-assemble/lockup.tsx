import { useEffect, useState } from 'react';
import { continueRender, delayRender, Img } from 'remotion';
import type { ChevronMarkAssembleProps } from '@/schemas';
import { NAME_FONTS } from './fonts';
import type { EndLayout } from './layout';
import { pixelTween } from './pixel-tween';
import { BEATS, revealProgress, unfoldProgress } from './poses';

export const useImageAspect = (src: string | null): number | null => {
  const [initial] = useState(() => (src === null ? null : delayRender('Measuring the logo')));
  const [measured, setMeasured] = useState<{ src: string; aspect: number } | null>(null);
  useEffect(() => {
    if (src === null) {
      if (initial !== null) {
        continueRender(initial);
      }
      return;
    }
    let active = true;
    const image = new Image();
    const finish = (aspect: number) => {
      if (!active) {
        return;
      }
      active = false;
      setMeasured({ src, aspect });
      if (initial !== null) {
        continueRender(initial);
      }
    };
    image.onload = () =>
      finish(
        image.naturalWidth > 0 && image.naturalHeight > 0
          ? image.naturalWidth / image.naturalHeight
          : 1,
      );
    image.onerror = () => finish(1);
    image.src = src;
    return () => {
      active = false;
    };
  }, [src, initial]);
  return src !== null && measured?.src === src ? measured.aspect : null;
};

const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

const ignoreError = () => undefined;

type Plate = NonNullable<EndLayout['plate']>;

const window01 = (t: number, from: number, to: number) =>
  Math.min(1, Math.max(0, (t - from) / (to - from)));

const rise = (frame: number, speed: number, start: number, from: number) =>
  pixelTween(Math.round(frame / speed), [start / speed, (start + 30) / speed], from, 0);

const plateMotion = (frame: number, speed: number, unfold: boolean, plate: Plate, seed: number) => {
  const side = Math.min(plate.width, plate.height);
  if (unfold) {
    const t = unfoldProgress(frame);
    const shape = 1 - (1 - window01(t, 0, 0.7)) ** 3;
    const widen = 1 - (1 - window01(t, 0.2, 0.7)) ** 3;
    const width = lerp(side, plate.width, widen);
    const height = lerp(side, plate.height, widen);
    return {
      rise: 0,
      scale: lerp(seed / side, 1, shape),
      turn: 45 * (1 - shape),
      width,
      height,
      radius: shape * Math.min(plate.radius, Math.min(width, height) / 2),
      plateOpacity: Math.min(1, t * 5),
      logoOpacity: window01(t, 0.6, 1),
    };
  }
  const opacity = Math.min(1, revealProgress(frame, BEATS.plate, 30) * 1.6);
  return {
    rise: rise(frame, speed, BEATS.plate, 70),
    scale: 1,
    turn: 0,
    width: plate.width,
    height: plate.height,
    radius: plate.radius,
    plateOpacity: opacity,
    logoOpacity: opacity,
  };
};

const LogoPlate = ({
  frame,
  props,
  plate,
  logo,
  logoSrc,
  seed,
}: {
  frame: number;
  props: ChevronMarkAssembleProps;
  plate: Plate;
  logo: EndLayout['logo'];
  logoSrc: string | null;
  seed: number;
}) => {
  const motion = plateMotion(
    frame,
    props.timing.speed,
    props.brand.logoEntrance === 'unfold',
    plate,
    seed,
  );
  return (
    <div
      style={{
        position: 'absolute',
        left: plate.x - plate.width / 2,
        top: plate.y - plate.height / 2,
        width: plate.width,
        height: plate.height,
        transform: `translateY(${motion.rise}px) rotate(${motion.turn}deg) scale(${motion.scale})`,
      }}
    >
      {props.plate.show ? (
        <svg
          width={plate.width}
          height={plate.height}
          style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}
          aria-hidden="true"
        >
          <rect
            x={(plate.width - motion.width) / 2}
            y={(plate.height - motion.height) / 2}
            width={motion.width}
            height={motion.height}
            rx={motion.radius}
            fill={props.colors.plate}
            opacity={motion.plateOpacity}
          />
        </svg>
      ) : null}
      {logoSrc === null ? null : (
        <Img
          src={logoSrc}
          onError={ignoreError}
          style={{
            position: 'absolute',
            left: (plate.width - logo.width) / 2,
            top: (plate.height - logo.height) / 2,
            width: logo.width,
            height: logo.height,
            objectFit: 'contain',
            opacity: motion.logoOpacity,
          }}
        />
      )}
    </div>
  );
};

const CompanyName = ({
  frame,
  props,
  name,
  ink,
}: {
  frame: number;
  props: ChevronMarkAssembleProps;
  name: EndLayout['name'];
  ink: string;
}) => {
  const font = NAME_FONTS[props.brand.nameFont];
  const lift = rise(frame, props.timing.speed, BEATS.name, 0.4 * name.size);
  return (
    <div
      style={{
        position: 'absolute',
        left: name.x - name.width / 2,
        top: name.y,
        width: name.width,
        textAlign: 'center',
        color: ink,
        fontFamily: font.fontFamily,
        fontWeight: font.fontWeight,
        letterSpacing: font.letterSpacing,
        fontSize: name.size,
        lineHeight: 1.08,
        textWrap: 'balance',
        overflowWrap: 'anywhere',
        opacity: Math.min(1, revealProgress(frame, BEATS.name, 30) * 1.5),
        transform: `translateY(${lift}px)`,
      }}
    >
      {props.brand.name}
    </div>
  );
};

export const Lockup = ({
  frame,
  props,
  layout,
  logoSrc,
  ink,
  seed,
}: {
  frame: number;
  props: ChevronMarkAssembleProps;
  layout: EndLayout;
  logoSrc: string | null;
  ink: string;
  seed: number;
}) => (
  <>
    {layout.plate !== null && frame >= BEATS.plate ? (
      <LogoPlate
        frame={frame}
        props={props}
        plate={layout.plate}
        logo={layout.logo}
        logoSrc={logoSrc}
        seed={seed}
      />
    ) : null}
    {frame >= BEATS.name ? (
      <CompanyName frame={frame} props={props} name={layout.name} ink={ink} />
    ) : null}
  </>
);
