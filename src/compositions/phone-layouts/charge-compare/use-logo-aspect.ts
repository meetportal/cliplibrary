import { useEffect, useState } from 'react';
import { useDelayRender } from 'remotion';
import { resolveCustom } from '../../kit/resolve-custom';

export const usableImage = (value: string) => value.trim() !== '' && !value.includes('{{');

export const useLogoAspect = (value: string): number | null => {
  const src = usableImage(value) ? resolveCustom(value) : '';
  const [loaded, setLoaded] = useState<{ src: string; aspect: number | null } | null>(null);
  const [handle, setHandle] = useState<number | null>(null);
  const { delayRender, continueRender } = useDelayRender();
  useEffect(() => {
    if (src === '') {
      return;
    }
    let active = true;
    const pending = delayRender(`Measuring the charge compare logo ${src.slice(0, 80)}`);
    setHandle(pending);
    const image = new Image();
    const finish = (aspect: number | null) => {
      if (active) {
        setLoaded({ src, aspect });
      } else {
        continueRender(pending);
      }
    };
    image.onload = () =>
      finish(image.naturalHeight > 0 ? image.naturalWidth / image.naturalHeight : null);
    image.onerror = () => finish(null);
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
  return loaded !== null && loaded.src === src ? loaded.aspect : null;
};
