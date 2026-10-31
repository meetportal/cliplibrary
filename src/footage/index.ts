import { elevatorNewspaperFootage } from './elevator-newspaper';
import type { FootageSpec } from './footage-spec';
import { newspaperCityCutsFootage } from './newspaper-city-cuts';
import { streetSignSwapFootage } from './street-sign-swap';

export const FOOTAGE: FootageSpec[] = [
  elevatorNewspaperFootage,
  streetSignSwapFootage,
  newspaperCityCutsFootage,
];
