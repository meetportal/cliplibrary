import { Img } from 'remotion';
import type { DominoWordsProps } from '@/schemas';
import { alpha } from './color';
import { BRAND_FACE, capTop, type Measure } from './fonts';
import type { LogoImage } from './logo';

const SIDE = 72;
const FOOTER_FROM_BOTTOM = 96;
const RULE = 56;

export type BrandLayout = {
  logoWidth: number;
  logoHeight: number;
  pad: number;
  nameSize: number;
  nameTop: number;
  bottom: number;
};

export const layoutBrand = (
  brand: DominoWordsProps['brand'],
  companyName: string,
  logo: LogoImage,
  measure: Measure,
  width: number,
): BrandLayout => {
  const logoWidth = logo === null ? 0 : Math.min(logo.aspect * brand.logoHeight, width * 0.5);
  const logoHeight = logo === null ? 0 : logoWidth / logo.aspect;
  const pad = logo !== null && brand.plate ? brand.logoHeight * 0.2 : 0;
  const box = measure(companyName, BRAND_FACE);
  const nameSize =
    companyName.trim() === ''
      ? 0
      : Math.min(brand.nameSize, (width - 2 * SIDE) / Math.max(0.1, box.width));
  const plateBottom = brand.top + (logo === null ? 0 : logoHeight + 2 * pad);
  const nameTop = plateBottom + (logo === null ? 0 : brand.nameSize * 0.45);
  return {
    logoWidth,
    logoHeight,
    pad,
    nameSize,
    nameTop,
    bottom: nameTop + nameSize * box.cap,
  };
};

export const BrandLockup = ({
  layout,
  logo,
  companyName,
  colors,
  measure,
  width,
  top,
}: {
  layout: BrandLayout;
  logo: LogoImage;
  companyName: string;
  colors: DominoWordsProps['colors'];
  measure: Measure;
  width: number;
  top: number;
}) => {
  const box = measure(companyName, BRAND_FACE);
  const plateWidth = layout.logoWidth + 2 * layout.pad;
  const plateHeight = layout.logoHeight + 2 * layout.pad;
  return (
    <>
      {logo === null ? null : (
        <div
          style={{
            position: 'absolute',
            left: (width - plateWidth) / 2,
            top,
            width: plateWidth,
            height: plateHeight,
            borderRadius: layout.pad > 0 ? Math.min(plateHeight / 2, layout.pad * 1.6) : 0,
            background: layout.pad > 0 ? colors.surface : 'transparent',
            boxShadow: layout.pad > 0 ? `0 10px 30px ${alpha('#000000', 0.18)}` : 'none',
          }}
        >
          <Img
            src={logo.src}
            style={{
              position: 'absolute',
              left: layout.pad,
              top: layout.pad,
              width: layout.logoWidth,
              height: layout.logoHeight,
            }}
          />
        </div>
      )}
      {layout.nameSize > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            width,
            top: layout.nameTop - capTop(box, layout.nameSize),
            textAlign: 'center',
            fontFamily: BRAND_FACE.family,
            fontWeight: BRAND_FACE.weight,
            fontSize: layout.nameSize,
            lineHeight: `${layout.nameSize}px`,
            whiteSpace: 'pre',
            color: colors.text,
          }}
        >
          {companyName}
        </div>
      ) : null}
    </>
  );
};

export const FooterLine = ({
  website,
  size,
  colors,
  measure,
  width,
  height,
}: {
  website: string;
  size: number;
  colors: DominoWordsProps['colors'];
  measure: Measure;
  width: number;
  height: number;
}) => {
  if (website.trim() === '') {
    return null;
  }
  const box = measure(website, BRAND_FACE);
  const room = width - 2 * SIDE - 2 * (RULE + size);
  const fitted = Math.min(size, room / Math.max(0.1, box.width));
  const textWidth = box.width * fitted;
  const middle = height - FOOTER_FROM_BOTTOM;
  const ink = alpha(colors.text, 0.72);
  const rule = (left: number) => (
    <div
      style={{
        position: 'absolute',
        left,
        top: middle - 1,
        width: RULE,
        height: 2,
        background: alpha(colors.text, 0.35),
      }}
    />
  );
  return (
    <>
      {rule((width - textWidth) / 2 - size - RULE)}
      {rule((width + textWidth) / 2 + size)}
      <div
        style={{
          position: 'absolute',
          left: 0,
          width,
          top: middle - (fitted * box.cap) / 2 - capTop(box, fitted),
          textAlign: 'center',
          fontFamily: BRAND_FACE.family,
          fontWeight: BRAND_FACE.weight,
          fontSize: fitted,
          lineHeight: `${fitted}px`,
          whiteSpace: 'pre',
          color: ink,
        }}
      >
        {website}
      </div>
    </>
  );
};
