import { mixLab } from '../../kit/lab-color';
import type { Palette } from './palette';

const WIDTH = 1920;
const HEIGHT = 1080;
const BAND_WIDTH = 1100;
const BAND_PERIOD = 1700;

export const Paper = ({
  palette,
  showRules,
  spacing,
  drift,
  loop,
}: {
  palette: Palette;
  showRules: boolean;
  spacing: number;
  drift: number;
  loop: number;
}) => {
  const edge = mixLab(palette.paper, '#5c6470', 0.045);
  const rules = showRules
    ? Array.from({ length: Math.floor(HEIGHT / spacing) }, (_, index) => (index + 1) * spacing)
    : [];
  const shift = loop * BAND_PERIOD - BAND_WIDTH;
  const bands = [shift - BAND_PERIOD, shift, shift + BAND_PERIOD];
  return (
    <div style={{ position: 'absolute', inset: 0, background: palette.paper, overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(180deg, ${edge} 0%, ${palette.paper} 30%, ${palette.paper} 70%, ${edge} 100%)`,
        }}
      />
      {rules.map((top) => (
        <div
          key={top}
          style={{
            position: 'absolute',
            left: 0,
            top,
            width: WIDTH,
            height: 2,
            background: palette.rules,
          }}
        />
      ))}
      {drift > 0
        ? bands.map((left) => (
            <div
              key={left}
              style={{
                position: 'absolute',
                top: 0,
                left,
                width: BAND_WIDTH,
                height: HEIGHT,
                opacity: drift,
                background: `linear-gradient(90deg, ${palette.light}00 0%, ${palette.light} 50%, ${palette.light}00 100%)`,
              }}
            />
          ))
        : null}
    </div>
  );
};
