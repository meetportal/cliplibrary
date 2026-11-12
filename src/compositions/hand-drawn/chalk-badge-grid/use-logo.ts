import { useEffect, useState } from 'react';
import { useDelayRender } from 'remotion';
import { resolveCustom } from '../../kit/resolve-custom';

export type GridLogo = { src: string; aspect: number } | null;

const filled = (value: string) => value.trim() !== '' && !value.includes('{{');

export const useGridLogo = (value: string): GridLogo => {
  const src = filled(value) ? resolveCustom(value) : '';
  const [measured, setMeasured] = useState<{ src: string; aspect: number | null } | null>(null);
  const [handle, setHandle] = useState<number | null>(null);
  const { delayRender, continueRender } = useDelayRender();
  useEffect(() => {
    if (src === '') {
      return;
    }
    let active = true;
    const pending = delayRender(`Measuring the chalk grid logo ${src.slice(0, 80)}`);
    setHandle(pending);
    const image = new Image();
    const done = (aspect: number | null) => {
      if (active) {
        setMeasured({ src, aspect });
      } else {
        continueRender(pending);
      }
    };
    image.onload = () =>
      done(image.naturalHeight > 0 ? image.naturalWidth / image.naturalHeight : null);
    image.onerror = () => done(null);
    image.src = src;
    return () => {
      active = false;
    };
  }, [src, delayRender, continueRender]);
  useEffect(() => {
    if (measured !== null && measured.src === src && handle !== null) {
      continueRender(handle);
      setHandle(null);
    }
  }, [measured, src, handle, continueRender]);
  if (src === '' || measured === null || measured.src !== src || measured.aspect === null) {
    return null;
  }
  return { src, aspect: measured.aspect };
};
