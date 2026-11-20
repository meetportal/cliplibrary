import type { AppScreensPromoProps } from '@/schemas';
import type { LogoBox } from '../../kit/use-logo-box';
import { BAR, Entering, textStyle } from './caption';
import { fitText } from './fit-text';
import { BADGE_FACE, BODY_FACE, DISPLAY_FACES } from './fonts';
import type { Palette } from './palette';
import { plateShape, Tile } from './tile';
import { END, END_TEXT_LEFT, progress, settle } from './timeline';

const LEFT = END_TEXT_LEFT;
const WIDTH = 820;
const LOGO = { width: 460, height: 200 };
const BADGE = { height: 82, gap: 16, icon: 34 };

const AppGlyph = ({ color }: { color: string }) => (
  <svg width={BADGE.icon} height={BADGE.icon} viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="10" fill="none" stroke={color} strokeWidth="2" />
    <path
      d="M12 6.5v9M8 12l4 4 4-4"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PlayGlyph = ({ color }: { color: string }) => (
  <svg width={BADGE.icon} height={BADGE.icon} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6 3.5v17l14-8.5z" fill={color} />
  </svg>
);

const Badge = ({
  top,
  label,
  glyph,
  palette,
  ready,
  width,
}: {
  top: string;
  label: string;
  glyph: 'app' | 'play';
  palette: Palette;
  ready: boolean;
  width: number;
}) => {
  const textWidth = width - BADGE.icon - 66;
  const big = fitText(label, BADGE_FACE, ready, { maxSize: 30, maxLines: 1, width: textWidth });
  const small = fitText(top, BODY_FACE, ready, { maxSize: 16, maxLines: 1, width: textWidth });
  return (
    <div
      style={{
        height: BADGE.height,
        maxWidth: width,
        boxSizing: 'border-box',
        borderRadius: 18,
        backgroundColor: palette.badge,
        border: `2px solid ${palette.badgeRim}`,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '0 26px 0 20px',
        color: palette.badgeInk,
      }}
    >
      {glyph === 'app' ? (
        <AppGlyph color={palette.badgeInk} />
      ) : (
        <PlayGlyph color={palette.badgeInk} />
      )}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {top.trim() !== '' && (
          <div style={textStyle(BODY_FACE, small, Math.round(small.size * 1.2))}>
            {small.lines[0]}
          </div>
        )}
        <div style={textStyle(BADGE_FACE, big, Math.round(big.size * 1.12))}>{big.lines[0]}</div>
      </div>
    </div>
  );
};

export const EndCard = ({
  props,
  palette,
  logo,
  frame,
  ready,
}: {
  props: AppScreensPromoProps;
  palette: Palette;
  logo: LogoBox | null;
  frame: number;
  ready: boolean;
}) => {
  if (frame < END.textIn) {
    return null;
  }
  const font = DISPLAY_FACES[props.type.font];
  const name = fitText(props.companyName, font, ready, {
    maxSize: props.type.nameSize,
    maxLines: 2,
    width: WIDTH,
  });
  const tagline = fitText(props.tagline, BODY_FACE, ready, {
    maxSize: props.type.lineSize,
    maxLines: 2,
    width: WIDTH - 60,
  });
  const plate = plateShape(logo, LOGO.height, LOGO.width);
  const nameLine = Math.round(name.size * 1.04);
  const tagLine = Math.round(tagline.size * 1.42);
  const hasTagline = props.tagline.trim() !== '';
  const { show } = props.badges;
  const blocks = [
    plate.height + 40,
    name.lines.length * nameLine,
    26 + BAR.height,
    hasTagline ? 24 + tagline.lines.length * tagLine : 0,
    show ? 44 + BADGE.height : 0,
  ];
  const height = blocks.reduce((sum, value) => sum + value, 0);
  const top = Math.round(540 - height / 2);
  const at = (index: number) => top + blocks.slice(0, index).reduce((sum, value) => sum + value, 0);
  const stagger = props.timing.textStagger;
  const start = (index: number) => END.textIn + index * stagger;
  const badgeWidth = (WIDTH - BADGE.gap) / 2;
  return (
    <>
      <Entering frame={frame} start={start(0)} leave={null} top={at(0)} left={LEFT}>
        <Tile props={props} palette={palette} logo={logo} shape={plate} />
      </Entering>
      <Entering
        frame={frame}
        start={start(1)}
        leave={null}
        top={at(1)}
        left={LEFT}
        style={{ ...textStyle(font, name, nameLine), color: palette.text }}
      >
        {name.lines.join('\n')}
      </Entering>
      <Entering frame={frame} start={start(2)} leave={null} top={at(2) + 26} left={LEFT + 4}>
        <div
          style={{
            width: BAR.width,
            height: BAR.height,
            borderRadius: BAR.height / 2,
            backgroundColor: palette.accent,
            transform: `scaleX(${0.2 + 0.8 * progress(frame, start(2), 24, settle)})`,
            transformOrigin: 'left center',
          }}
        />
      </Entering>
      {hasTagline && (
        <Entering
          frame={frame}
          start={start(3)}
          leave={null}
          top={at(3) + 24}
          left={LEFT + 2}
          style={{ ...textStyle(BODY_FACE, tagline, tagLine), color: palette.line }}
        >
          {tagline.lines.join('\n')}
        </Entering>
      )}
      {show && (
        <Entering frame={frame} start={start(4)} leave={null} top={at(4) + 44} left={LEFT}>
          <div style={{ display: 'flex', gap: BADGE.gap }}>
            <Badge
              top={props.badges.appStoreTop}
              label={props.badges.appStore}
              glyph="app"
              palette={palette}
              ready={ready}
              width={badgeWidth}
            />
            <Badge
              top={props.badges.playTop}
              label={props.badges.play}
              glyph="play"
              palette={palette}
              ready={ready}
              width={badgeWidth}
            />
          </div>
        </Entering>
      )}
    </>
  );
};
