import type { ComponentType, CSSProperties } from 'react';
import {
  Binary,
  Candy,
  Code,
  Flower2,
  Gift,
  Ghost,
  Handshake,
  Shirt,
  Heart,
  PartyPopper,
  Ribbon,
  Skull,
  Snowflake,
  Sparkles,
  Star,
  Terminal,
  TreePine,
  VenetianMask,
  Watch,
} from 'lucide-react';

import { ColombiaFlag } from '@/components/seasonal-icons';

export type SeasonalIcon = ComponentType<{ className?: string; style?: CSSProperties }>;

interface DayRange {
  from: Date;
  to: Date;
}

/** Returns the days an event is active for a given year. */
export type DateRule = (year: number) => DayRange;

export interface SeasonalEvent {
  id: string;
  /** Text shown in the tooltip when hovering the header icon. */
  message: string;
  /** When the event is active each year. */
  dates: DateRule;
  /** Icon shown in the header next to the brand name. */
  icon: SeasonalIcon;
  /** One to any number of falling icons. They are used in order and repeat as needed. */
  particles: SeasonalIcon[];
  /** One to any number of colors. They are used in order and repeat as needed. */
  colors: string[];
  /** Header icon color per theme. Defaults to the first color in `colors`. */
  iconColor?: { light: string; dark: string };
}

/** Fixed range as MM-DD. If `to` is before `from`, the range wraps into the next year. */
function fixed(from: string, to: string): DateRule {
  return (year) => {
    const [fromMonth, fromDay] = from.split('-').map(Number);
    const [toMonth, toDay] = to.split('-').map(Number);
    const wraps = toMonth * 100 + toDay < fromMonth * 100 + fromDay;
    return {
      from: new Date(year, fromMonth - 1, fromDay),
      to: new Date(year + (wraps ? 1 : 0), toMonth - 1, toDay),
    };
  };
}

/** The nth weekday of a month. Weekday: 0 = Sunday, 6 = Saturday. */
function nthWeekday(month: number, weekday: number, n: number): DateRule {
  return (year) => {
    const first = new Date(year, month - 1, 1);
    const offset = (weekday - first.getDay() + 7) % 7;
    const date = new Date(year, month - 1, 1 + offset + (n - 1) * 7);
    return { from: date, to: date };
  };
}

/** A specific day of the year, such as day 256 (Programmer's Day). */
function dayOfYear(n: number): DateRule {
  return (year) => {
    const date = new Date(year, 0, n);
    return { from: date, to: date };
  };
}

/** Gregorian Easter Sunday (Anonymous algorithm). */
function easterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const dayOfMonth = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, dayOfMonth);
}

/** Barranquilla Carnival: the four days ending the Tuesday before Ash Wednesday. */
const barranquillaCarnival: DateRule = (year) => {
  const easter = easterSunday(year);
  const ashWednesday = new Date(
    easter.getFullYear(),
    easter.getMonth(),
    easter.getDate() - 46
  );
  return {
    from: new Date(ashWednesday.getFullYear(), ashWednesday.getMonth(), ashWednesday.getDate() - 4),
    to: new Date(ashWednesday.getFullYear(), ashWednesday.getMonth(), ashWednesday.getDate() - 1),
  };
};

export const seasonalEvents: SeasonalEvent[] = [
  {
    id: 'christmas',
    message: 'Merry Christmas',
    dates: fixed('11-10', '01-06'),
    icon: Snowflake,
    particles: [Snowflake, TreePine, Star, Gift],
    colors: ['#15803d', '#e5173a', '#fbbf24'],
  },
  {
    id: 'halloween',
    message: 'Happy Halloween',
    dates: fixed('10-20', '10-31'),
    icon: Ghost,
    particles: [Ghost, Skull, Candy],
    colors: ['#ea580c', '#7c3aed'],
  },
  {
    id: 'colombia',
    message: 'Feliz Día de la Independencia',
    dates: fixed('07-20', '07-20'),
    icon: ColombiaFlag,
    particles: [ColombiaFlag],
    colors: ['#fcd116', '#003893', '#ce1126', '#fcd116'],
  },
  {
    id: 'amor-amistad',
    message: 'Feliz Día del Amor y la Amistad',
    dates: nthWeekday(9, 6, 3),
    icon: Heart,
    particles: [Heart, Sparkles],
    colors: ['#e11d48', '#f472b6'],
  },
  {
    id: 'carnaval-barranquilla',
    message: 'Carnaval de Barranquilla',
    dates: barranquillaCarnival,
    icon: VenetianMask,
    particles: [PartyPopper, Sparkles, VenetianMask],
    colors: ['#facc15', '#ec4899', '#22c55e'],
  },
  {
    id: 'dia-madre',
    message: 'Feliz Día de la Madre',
    dates: nthWeekday(5, 0, 2),
    icon: Flower2,
    particles: [Flower2, Heart],
    colors: ['#ec4899', '#f9a8d4'],
  },
  {
    id: 'dia-padre',
    message: 'Feliz Día del Padre',
    dates: nthWeekday(6, 0, 3),
    icon: Watch,
    particles: [Handshake, Shirt, Watch, Star],
    colors: ['#1d4ed8', '#0ea5e9'],
  },
  {
    id: 'dia-programador',
    message: 'Feliz Día del Programador',
    dates: dayOfYear(256),
    icon: Code,
    particles: [Code, Terminal, Binary],
    colors: ['#06b6d4', '#84cc16', '#8b5cf6'],
  },
  {
    id: 'dia-cancer',
    message: 'Día Mundial contra el Cáncer',
    dates: fixed('02-04', '02-04'),
    icon: Ribbon,
    particles: [Ribbon, Heart],
    colors: ['#db2777', '#f472b6'],
  },
  {
    id: 'dia-cancer-mama',
    message: 'Día Mundial contra el Cáncer de Mama',
    dates: fixed('10-19', '10-19'),
    icon: Ribbon,
    particles: [Ribbon, Heart],
    colors: ['#db2777', '#f472b6'],
  },
];

function isActiveOn(date: Date, event: SeasonalEvent): boolean {
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  // Check the previous year too, so ranges that wrap into January are detected.
  return [date.getFullYear(), date.getFullYear() - 1].some((year) => {
    const { from, to } = event.dates(year);
    return day >= from && day <= to;
  });
}

/**
 * Returns the event active on the given date. Pass `override` to force an
 * event by id, or `'none'` to disable decorations (used for previews).
 */
export function getActiveEvent(
  date: Date = new Date(),
  override?: string | null
): SeasonalEvent | null {
  if (override === 'none') return null;
  if (override) return seasonalEvents.find((event) => event.id === override) ?? null;
  return seasonalEvents.find((event) => isActiveOn(date, event)) ?? null;
}
