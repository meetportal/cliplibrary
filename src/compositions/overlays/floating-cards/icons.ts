import {
  ArrowDownLeft,
  Bell,
  Calendar,
  ChartLine,
  Check,
  CircleDollarSign,
  CreditCard,
  Gift,
  Heart,
  type IconNode,
  PiggyBank,
  ShoppingBag,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Users,
  Wallet,
  Zap,
} from 'lucide';
import type { FloatingCardsIcon } from '@/schemas';

const ICONS: Record<FloatingCardsIcon, IconNode> = {
  'trending-up': TrendingUp,
  'arrow-down-left': ArrowDownLeft,
  target: Target,
  wallet: Wallet,
  'piggy-bank': PiggyBank,
  'credit-card': CreditCard,
  'circle-dollar-sign': CircleDollarSign,
  'chart-line': ChartLine,
  users: Users,
  star: Star,
  heart: Heart,
  bell: Bell,
  check: Check,
  zap: Zap,
  'shopping-bag': ShoppingBag,
  calendar: Calendar,
  trophy: Trophy,
  gift: Gift,
};

const GRID = 24;
const STROKE = 2;

type Attributes = Record<string, string | number | undefined>;

const read = (attributes: Attributes, key: string) => attributes[key] ?? 0;

const shapeOf = (tag: string, attributes: Attributes) => {
  const num = (key: string) => Number(read(attributes, key));
  const shape = new Path2D();
  if (tag === 'path') {
    return new Path2D(String(read(attributes, 'd')));
  }
  if (tag === 'circle') {
    shape.arc(num('cx'), num('cy'), num('r'), 0, Math.PI * 2);
  } else if (tag === 'line') {
    shape.moveTo(num('x1'), num('y1'));
    shape.lineTo(num('x2'), num('y2'));
  } else if (tag === 'rect') {
    shape.roundRect(num('x'), num('y'), num('width'), num('height'), num('rx'));
  }
  return shape;
};

const cache = new Map<FloatingCardsIcon, Path2D[]>();

const shapesFor = (icon: FloatingCardsIcon): Path2D[] => {
  const known = cache.get(icon);
  if (known !== undefined) {
    return known;
  }
  const shapes = ICONS[icon].map(([tag, attributes]) => shapeOf(tag, attributes));
  cache.set(icon, shapes);
  return shapes;
};

export const drawIcon = (
  context: CanvasRenderingContext2D,
  icon: FloatingCardsIcon,
  centerX: number,
  centerY: number,
  size: number,
  color: string,
) => {
  const unit = size / GRID;
  context.save();
  context.translate(centerX - size / 2, centerY - size / 2);
  context.scale(unit, unit);
  context.strokeStyle = color;
  context.lineWidth = STROKE;
  context.lineCap = 'round';
  context.lineJoin = 'round';
  for (const shape of shapesFor(icon)) {
    context.stroke(shape);
  }
  context.restore();
};
