import { applyFont, type Context } from '../footage/canvas-type';
import { serifFont } from './page-fonts';

export const serif = (context: Context, size: number, weight = 900, style = 'normal') => {
  applyFont(context, serifFont, size, weight, style);
};
