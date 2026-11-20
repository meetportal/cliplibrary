import type { AppScreensPromoProps } from '@/schemas';
import type { LogoBox } from '../../kit/use-logo-box';
import { DISPLAY_FACES } from './fonts';
import { fitBox, LogoImage } from './logo';
import type { Palette } from './palette';

export type TileShape = { width: number; height: number };

export const tileShape = (box: LogoBox | null, size: number): TileShape => {
  const stretch = Math.min(4, Math.max(1, box?.aspect ?? 1));
  return { width: Math.min(size * 1.4, size * stretch ** 0.33), height: size * stretch ** -0.2 };
};

export const Tile = ({
  props,
  palette,
  logo,
  shape,
}: {
  props: AppScreensPromoProps;
  palette: Palette;
  logo: LogoBox | null;
  shape: TileShape;
}) => {
  const { tile } = props;
  const radius = Math.min(shape.width, shape.height) * tile.roundness;
  const padding = Math.min(shape.width, shape.height) * tile.logoPadding;
  const inner = fitBox(logo?.aspect ?? 1, shape.width - padding * 2, shape.height - padding * 2.4);
  const pill = { width: shape.width * 0.2, height: Math.max(8, shape.height * 0.035) };
  const font = DISPLAY_FACES[props.type.font];
  return (
    <div
      style={{
        position: 'relative',
        width: shape.width,
        height: shape.height,
        borderRadius: radius,
        backgroundColor: palette.tile,
        boxShadow: `0 40px 70px -24px ${palette.shadow}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {[0.07, 0.93 - pill.height / shape.height].map((top) => (
        <div
          key={top}
          style={{
            position: 'absolute',
            left: (shape.width - pill.width) / 2,
            top: shape.height * top,
            width: pill.width,
            height: pill.height,
            borderRadius: pill.height / 2,
            backgroundImage: `linear-gradient(90deg, ${palette.tileAccent}, ${palette.screenTo})`,
          }}
        />
      ))}
      {logo === null ? (
        <div
          style={{
            fontFamily: font.family,
            fontWeight: font.weight,
            fontSize: Math.round(shape.height * 0.5),
            lineHeight: 1,
            color: palette.tileInk,
          }}
        >
          {[...props.companyName.trim()][0] ?? ''}
        </div>
      ) : (
        <LogoImage src={props.logo} box={logo} width={inner.width} height={inner.height} />
      )}
    </div>
  );
};

export const plateShape = (box: LogoBox | null, height: number, maxWidth: number): TileShape => {
  const stretch = Math.min(4, Math.max(1, box?.aspect ?? 1));
  const shape = tileShape(box, height * stretch ** 0.2);
  return { width: Math.min(maxWidth, shape.width), height: shape.height };
};
