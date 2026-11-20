import { useEffect, useMemo, useState } from 'react';
import { useDelayRender } from 'remotion';
import { resolveCustom } from '../../kit/resolve-custom';
import { type LogoBox, usableImage, useLogoBox } from '../../kit/use-logo-box';

export type BobLogo = { image: HTMLImageElement; box: LogoBox; reach: number } | null;

const SAMPLE = 96;
const ALPHA_FLOOR = 10;

const cornerReach = (box: LogoBox) => Math.hypot(1, 1 / box.aspect);

const measureReach = (image: HTMLImageElement, box: LogoBox): number => {
  const width = SAMPLE;
  const height = Math.max(1, Math.round(SAMPLE / box.aspect));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (context === null) {
    return cornerReach(box);
  }
  try {
    context.drawImage(
      image,
      box.x * image.naturalWidth,
      box.y * image.naturalHeight,
      box.w * image.naturalWidth,
      box.h * image.naturalHeight,
      0,
      0,
      width,
      height,
    );
    const { data } = context.getImageData(0, 0, width, height);
    let reach = 0;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if ((data[(y * width + x) * 4 + 3] ?? 0) > ALPHA_FLOOR) {
          reach = Math.max(reach, Math.hypot(x + 0.5 - width / 2, y + 0.5 - height / 2));
        }
      }
    }
    return reach > 0 ? reach / (width / 2) : cornerReach(box);
  } catch {
    return cornerReach(box);
  }
};

export const useBobLogo = (value: string): BobLogo => {
  const box = useLogoBox(value);
  const src = usableImage(value) ? resolveCustom(value) : '';
  const [loaded, setLoaded] = useState<{ src: string; image: HTMLImageElement | null } | null>(
    null,
  );
  const [handle, setHandle] = useState<number | null>(null);
  const { delayRender, continueRender } = useDelayRender();
  useEffect(() => {
    if (src === '') {
      return;
    }
    let active = true;
    const pending = delayRender(`Loading the pendulum logo ${src.slice(0, 80)}`);
    setHandle(pending);
    const image = new Image();
    const finish = (ok: boolean) => {
      if (active) {
        setLoaded({ src, image: ok ? image : null });
      } else {
        continueRender(pending);
      }
    };
    image.onload = () => {
      image.decode().then(
        () => finish(true),
        () => finish(true),
      );
    };
    image.onerror = () => finish(false);
    image.src = src;
    return () => {
      active = false;
    };
  }, [src, delayRender, continueRender]);
  useEffect(() => {
    if (loaded !== null && loaded.src === src && handle !== null) {
      continueRender(handle);
      setHandle(null);
    }
  }, [loaded, src, handle, continueRender]);
  const image = loaded !== null && loaded.src === src ? loaded.image : null;
  const reach = useMemo(
    () => (image !== null && box !== null ? measureReach(image, box) : 1),
    [image, box],
  );
  return image !== null && box !== null ? { image, box, reach } : null;
};
