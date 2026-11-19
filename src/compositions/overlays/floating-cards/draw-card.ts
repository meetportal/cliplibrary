import type { FloatingCardsProps } from '@/schemas';
import { type Card, type CardBox, type CardSprite, platePath } from './card-face';
import type { CardPalette } from './palette';
import type { CardMotion } from './timeline';

const AMBIENT = { blur: 30, drop: 12, alpha: 0.16, liftBlur: 18, liftDrop: 12, liftFade: 0.3 };
const CONTACT = { blur: 4, drop: 2, alpha: 0.07, liftFade: 0.6 };
const OFFSTAGE = 10000;

const alphaHex = (alpha: number) =>
  Math.round(Math.max(0, Math.min(1, alpha)) * 255)
    .toString(16)
    .padStart(2, '0');

const castShadow = (
  context: CanvasRenderingContext2D,
  box: CardBox,
  shadow: { color: string; blur: number; drop: number; ratio: number },
) => {
  const { a, b } = context.getTransform();
  context.save();
  context.shadowColor = shadow.color;
  context.shadowBlur = shadow.blur * shadow.ratio;
  context.shadowOffsetX = OFFSTAGE * a;
  context.shadowOffsetY = OFFSTAGE * b + shadow.drop * shadow.ratio;
  context.translate(-OFFSTAGE, 0);
  platePath(context, box);
  context.fill();
  context.restore();
};

export const drawCard = (
  context: CanvasRenderingContext2D,
  card: Card,
  sprite: CardSprite,
  motion: CardMotion,
  props: FloatingCardsProps,
  palette: CardPalette,
  ratio: number,
) => {
  if (motion.opacity <= 0) {
    return;
  }
  const { box, margin } = sprite;
  const size = props.card.size;
  const lift = motion.lift * props.float.depth;
  const strength = props.card.shadow * motion.opacity;
  context.save();
  context.translate(card.x + props.layout.x + motion.x, card.y + props.layout.y + motion.y);
  context.rotate(((card.tilt + motion.angle) * Math.PI) / 180);
  context.scale(motion.scale, motion.scale);
  if (strength > 0) {
    context.fillStyle = palette.shadow;
    castShadow(context, box, {
      color: `${palette.shadow}${alphaHex(strength * AMBIENT.alpha * (1 - AMBIENT.liftFade * lift))}`,
      blur: (AMBIENT.blur + AMBIENT.liftBlur * lift) * size,
      drop: (AMBIENT.drop + AMBIENT.liftDrop * lift) * size,
      ratio,
    });
    castShadow(context, box, {
      color: `${palette.shadow}${alphaHex(strength * CONTACT.alpha * (1 - CONTACT.liftFade * lift))}`,
      blur: CONTACT.blur * size,
      drop: CONTACT.drop * size,
      ratio,
    });
  }
  context.globalAlpha = motion.opacity;
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.drawImage(
    sprite.canvas,
    -box.width / 2 - margin,
    -box.height / 2 - margin,
    sprite.canvas.width / sprite.density,
    sprite.canvas.height / sprite.density,
  );
  context.restore();
};
