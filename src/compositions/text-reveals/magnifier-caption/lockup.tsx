import { Img } from 'remotion';
import type { MagnifierCaptionProps } from '@/schemas';
import { alpha } from './color';
import type { BodyFaces } from './fonts';
import { fitLine, type Measurer } from './measure';
import type { LogoState } from './use-logo';

type Box = { x: number; y: number; width: number; height: number };

export type LockupLayout = {
  plate: Box;
  logo: Box;
  nameTop: number;
  nameSize: number;
  websiteTop: number;
  websiteSize: number;
};

const PADDING = 20;
const LOGO_AREA = 300 * 75;
const TEXT_WIDTH = 900;

export const layoutLockup = ({
  props,
  logo,
  measure,
  faces,
}: {
  props: MagnifierCaptionProps;
  logo: LogoState;
  measure: Measurer;
  faces: BodyFaces;
}): LockupLayout => {
  const { brand, type } = props;
  const aspect = logo?.aspect ?? 2.4;
  const area = LOGO_AREA * (brand.logoWidth / 300) ** 2;
  const fit = Math.min(
    1,
    brand.logoWidth / Math.sqrt(area * aspect),
    brand.logoHeight / Math.sqrt(area / aspect),
  );
  const width = Math.sqrt(area * aspect) * fit;
  const height = width / aspect;
  const logoBox = { x: 540 - width / 2, y: brand.y - height / 2, width, height };
  const plate = {
    x: logoBox.x - PADDING,
    y: logoBox.y - PADDING,
    width: width + PADDING * 2,
    height: height + PADDING * 2,
  };
  const nameSize = fitLine(measure, props.companyName, faces.name, type.nameSize, TEXT_WIDTH);
  const websiteSize = fitLine(measure, props.website, faces.word, type.websiteSize, TEXT_WIDTH);
  const nameTop = plate.y + plate.height + 22;
  return {
    plate,
    logo: logoBox,
    nameTop,
    nameSize,
    websiteTop: nameTop + nameSize * 1.2 + 8,
    websiteSize,
  };
};

const line = (top: number, size: number, family: string, weight: number, color: string) =>
  ({
    position: 'absolute',
    left: 0,
    right: 0,
    top,
    textAlign: 'center',
    whiteSpace: 'pre',
    fontFamily: family,
    fontWeight: weight,
    fontSize: size,
    lineHeight: 1.2,
    color,
  }) as const;

export const Lockup = ({
  props,
  layout,
  logo,
  faces,
  colors,
}: {
  props: MagnifierCaptionProps;
  layout: LockupLayout;
  logo: LogoState;
  faces: BodyFaces;
  colors: { surface: string; name: string; website: string; shadow: string };
}) => {
  const radius = Math.min(layout.plate.height, layout.plate.width) * 0.22;
  return (
    <>
      {props.brand.plate ? (
        <div
          style={{
            position: 'absolute',
            left: layout.plate.x,
            top: layout.plate.y,
            width: layout.plate.width,
            height: layout.plate.height,
            borderRadius: radius,
            background: colors.surface,
            boxShadow: `0 ${(layout.plate.height * 0.08).toFixed(1)}px ${(layout.plate.height * 0.3).toFixed(1)}px ${alpha(colors.shadow, 0.35)}`,
          }}
        />
      ) : null}
      {logo === null ? (
        <div
          style={{
            position: 'absolute',
            left: layout.logo.x,
            top: layout.logo.y,
            width: layout.logo.width,
            height: layout.logo.height,
            boxSizing: 'border-box',
            borderRadius: radius * 0.6,
            border: `3px dashed ${colors.website}`,
            opacity: 0.5,
          }}
        />
      ) : (
        <Img
          src={logo.src}
          style={{
            position: 'absolute',
            left: layout.logo.x,
            top: layout.logo.y,
            width: layout.logo.width,
            height: layout.logo.height,
            objectFit: 'contain',
          }}
        />
      )}
      <div
        style={line(
          layout.nameTop,
          layout.nameSize,
          faces.name.family,
          faces.name.weight,
          colors.name,
        )}
      >
        {props.companyName}
      </div>
      <div
        style={line(
          layout.websiteTop,
          layout.websiteSize,
          faces.word.family,
          faces.word.weight,
          colors.website,
        )}
      >
        {props.website}
      </div>
    </>
  );
};
