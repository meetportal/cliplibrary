import { Img } from 'remotion';
import { FACES } from './fonts';
import type { BrandLayout } from './layout';

export const Brand = ({
  layout,
  src,
  name,
  font,
  text,
  surface,
  plate,
  opacity,
}: {
  layout: BrandLayout;
  src: string | null;
  name: string;
  font: keyof typeof FACES;
  text: string;
  surface: string;
  plate: boolean;
  opacity: number;
}) => {
  const face = FACES[font];
  const plateBox = layout.plate;
  return (
    <div style={{ position: 'absolute', inset: 0, opacity }}>
      {plateBox !== null && plate ? (
        <div
          style={{
            position: 'absolute',
            ...plateBox,
            backgroundColor: surface,
            borderRadius: Math.round(Math.min(plateBox.width, plateBox.height) * 0.22),
          }}
        />
      ) : null}
      {layout.logo !== null && src !== null ? (
        <Img src={src} style={{ position: 'absolute', ...layout.logo, display: 'block' }} />
      ) : null}
      {name.trim() === '' ? null : (
        <div
          style={{
            position: 'absolute',
            left: layout.name.left,
            top: layout.name.top,
            width: layout.name.width,
            fontSize: layout.name.size,
            lineHeight: `${Math.round(layout.name.size * 1.25)}px`,
            textAlign: layout.name.align,
            whiteSpace: 'nowrap',
            fontFamily: face.family,
            fontWeight: face.weight,
            fontStyle: face.style,
            letterSpacing: `${face.tracking}em`,
            color: text,
          }}
        >
          {name}
        </div>
      )}
    </div>
  );
};
