import { useEffect, useState } from 'react';
import { useDelayRender } from 'remotion';
import { resolveCustom } from '../../kit/resolve-custom';
import { type LogoBox, usableImage, useLogoBox } from '../../kit/use-logo-box';

export type LogoImage = { image: HTMLImageElement; box: LogoBox } | null;

export const useLogoImage = (value: string): LogoImage => {
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
    const pending = delayRender(`Loading the caller logo ${src.slice(0, 80)}`);
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
  return image !== null && box !== null ? { image, box } : null;
};
