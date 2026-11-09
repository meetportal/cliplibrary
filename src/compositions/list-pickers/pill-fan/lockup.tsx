import { Img } from 'remotion';
import type { PillFanProps } from '@/schemas';
import type { FontFace } from './fonts';
import type { Lockup as LockupBox } from './layout';

type LockupProps = {
  box: LockupBox;
  logo: string | null;
  props: PillFanProps;
  face: FontFace;
};

export const Lockup = ({ box, logo, props, face }: LockupProps) => {
  const name = props.companyName.trim();
  const plate = box.platePadding;
  return (
    <div
      style={{
        position: 'absolute',
        left: box.x,
        top: box.y,
        height: box.height,
        display: 'flex',
        alignItems: 'center',
        gap: box.gap,
      }}
    >
      {logo === null ? null : (
        <div
          style={{
            padding: plate,
            borderRadius: (box.logoHeight + plate * 2) / 2,
            background: props.brand.plate ? props.colors.plate : 'transparent',
            display: 'flex',
          }}
        >
          <Img
            src={logo}
            style={{ width: box.logoWidth, height: box.logoHeight, objectFit: 'contain' }}
          />
        </div>
      )}
      {name === '' ? null : (
        <div
          style={{
            fontFamily: face.family,
            fontWeight: face.weight,
            fontSize: box.nameSize,
            lineHeight: 1,
            whiteSpace: 'nowrap',
            color: props.colors.text,
          }}
        >
          {name}
        </div>
      )}
    </div>
  );
};
