import { useEffect, useState } from 'react';
import { useDelayRender } from 'remotion';
import { resolveCustom } from '../../kit/resolve-custom';

export type LogoImage = { src: string; aspect: number } | null;

const usable = (value: string) => value.trim() !== '' && !value.includes('{{');

export const useLogoImage = (value: string): LogoImage => {
  const src = usable(value) ? resolveCustom(value) : '';
  const [loaded, setLoaded] = useState<{ src: string; aspect: number | null } | null>(null);
  const [handle, setHandle] = useState<number | null>(null);
  const { delayRender, continueRender } = useDelayRender();
  useEffect(() => {
    if (src === '') {
      return;
    }
    let active = true;
    const pending = delayRender(`Loading the domino words logo ${src.slice(0, 80)}`);
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
  if (src === '' || loaded === null || loaded.src !== src || loaded.aspect === null) {
    return null;
  }
  return { src, aspect: loaded.aspect };
};
