import { Img } from 'remotion';
import type { ChipBox } from './layout';
import { withAlpha } from './palette';

type LogoChipProps = {
  src: string;
  chip: ChipBox;
  plate: boolean;
  plateColor: string;
};

export const LogoChip = ({ src, chip, plate, plateColor }: LogoChipProps) => (
  <div
    style={{
      flexShrink: 0,
      width: chip.width,
      height: chip.height,
      borderRadius: chip.height / 2,
      backgroundColor: plate ? withAlpha(plateColor, 0.96) : 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Img src={src} style={{ width: chip.logoWidth, height: chip.logoHeight, display: 'block' }} />
  </div>
);
