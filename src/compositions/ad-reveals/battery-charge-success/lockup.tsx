import { Easing, Img } from 'remotion';
import { resolveCustom } from '../../kit/resolve-custom';
import { alpha } from './color';
import { BODY_FACE, LABEL_FACE, type Wrapped } from './fonts';
import { pixelTween, progress } from './timeline';
import { usableImage } from './use-logo-aspect';

export type LockupLayout = {
  logo: { width: number; height: number; top: number; padding: number } | null;
  tagline: { wrapped: Wrapped; top: number; lineHeight: number } | null;
  website: { size: number; top: number } | null;
};

export type LockupLook = {
  frame: number;
  starts: readonly [number, number, number];
  frames: number;
  logo: string;
  tagline: string;
  website: string;
  plate: string;
  showPlate: boolean;
  text: string;
  accent: string;
};

const RISE = 46;
const EASE = Easing.out(Easing.cubic);

const entrance = (frame: number, start: number, frames: number) => ({
  opacity: progress(frame, start, start + frames * 0.5, Easing.inOut(Easing.sin)),
  offset: pixelTween(frame, RISE, 0, start, frames, EASE),
});

export const Lockup = ({ layout, look }: { layout: LockupLayout; look: LockupLook }) => {
  const [logoAt, taglineAt, websiteAt] = look.starts;
  const logo = entrance(look.frame, logoAt, look.frames);
  const tagline = entrance(look.frame, taglineAt, look.frames);
  const website = entrance(look.frame, websiteAt, look.frames);
  return (
    <>
      {layout.logo !== null && usableImage(look.logo) ? (
        <div
          style={{
            position: 'absolute',
            left: Math.round(540 - layout.logo.width / 2 - layout.logo.padding),
            top: layout.logo.top + logo.offset,
            width: layout.logo.width + layout.logo.padding * 2,
            height: layout.logo.height + layout.logo.padding * 2,
            borderRadius: Math.round(
              Math.min(layout.logo.height, layout.logo.width) * 0.22 + layout.logo.padding,
            ),
            backgroundColor: look.showPlate ? look.plate : 'transparent',
            boxShadow: look.showPlate ? `0 0 60px ${alpha(look.accent, 0.35)}` : undefined,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: logo.opacity,
          }}
        >
          <Img
            src={resolveCustom(look.logo)}
            style={{ width: layout.logo.width, height: layout.logo.height, objectFit: 'contain' }}
          />
        </div>
      ) : null}
      {layout.tagline === null ? null : (
        <div
          style={{
            position: 'absolute',
            left: 60,
            width: 960,
            top: layout.tagline.top + tagline.offset,
            textAlign: 'center',
            fontFamily: LABEL_FACE.family,
            fontWeight: LABEL_FACE.weight,
            fontSize: layout.tagline.wrapped.size,
            lineHeight: `${layout.tagline.lineHeight}px`,
            color: look.text,
            opacity: tagline.opacity,
            whiteSpace: 'nowrap',
          }}
        >
          {layout.tagline.wrapped.lines.map((line) => (
            <div key={line}>{line}</div>
          ))}
        </div>
      )}
      {layout.website === null ? null : (
        <div
          style={{
            position: 'absolute',
            left: 60,
            width: 960,
            top: layout.website.top + website.offset,
            textAlign: 'center',
            fontFamily: BODY_FACE.family,
            fontWeight: BODY_FACE.weight,
            fontSize: layout.website.size,
            lineHeight: 1.2,
            letterSpacing: '0.04em',
            color: look.accent,
            opacity: website.opacity,
            whiteSpace: 'nowrap',
          }}
        >
          {look.website}
        </div>
      )}
    </>
  );
};
