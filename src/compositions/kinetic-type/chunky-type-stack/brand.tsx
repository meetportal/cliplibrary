import { Img } from 'remotion';
import { useStackLogo } from './use-logo';

type BrandProps = {
  logo: string;
  centerX: number;
  centerY: number;
  maxHeight: number;
  maxWidth: number;
  plate: boolean;
  surface: string;
  shadow: string;
};

export const Brand = (props: BrandProps) => {
  const logo = useStackLogo(props.logo);
  if (logo === null) {
    return null;
  }
  const height = Math.min(props.maxHeight, props.maxWidth / logo.aspect);
  const width = height * logo.aspect;
  const pad = props.plate ? Math.round(height * 0.16) : 0;
  const boxWidth = Math.round(width + pad * 2);
  const boxHeight = Math.round(height + pad * 2);
  return (
    <div
      style={{
        position: 'absolute',
        left: Math.round(props.centerX - boxWidth / 2),
        top: Math.round(props.centerY - boxHeight / 2),
        width: boxWidth,
        height: boxHeight,
        borderRadius: props.plate ? Math.round(boxHeight * 0.24) : 0,
        backgroundColor: props.plate ? props.surface : 'transparent',
        boxShadow: props.plate
          ? `0 ${Math.round(boxHeight * 0.06)}px ${Math.round(boxHeight * 0.14)}px ${props.shadow}66`
          : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Img src={logo.src} style={{ width, height, objectFit: 'contain' }} />
    </div>
  );
};
