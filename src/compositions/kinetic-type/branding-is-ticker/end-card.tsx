import { ArrowRight, Globe, Phone } from 'lucide-react';
import type { ReactNode } from 'react';
import type { BrandingIsTickerProps } from '@/schemas';
import { ramp } from '../../kit/motion';
import { faceStyle, type Measure, type WordFaces } from './fonts';
import { LogoImage, tileSize } from './logo-tile';
import { entry } from './motion';
import { ENTRY_FRAMES, type Timeline } from './timeline';

const SIDE = 90;
const NAME_TRACKING = 0.12;
const BUTTON_TRACKING = 0.06;
const TILE_WIDEST = 760;
const SHEEN_EVERY = 56;

export type EndInks = {
  ink: string;
  plate: string;
  gradient: [string, string];
  buttonInk: string;
  chipFill: string;
  chipInk: string;
};

const fitTo = (preferred: number, perSize: number, room: number) =>
  perSize > 0 ? Math.min(preferred, Math.floor(room / perSize)) : preferred;

const Rise = ({
  frame,
  start,
  top,
  children,
}: {
  frame: number;
  start: number;
  top: number;
  children: ReactNode;
}) => {
  const { opacity, offset } = entry(frame, start);
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: top + offset, opacity }}>
      {children}
    </div>
  );
};

export const EndCard = ({
  frame,
  line,
  props,
  measure,
  faces,
  logo,
  aspect,
  inks,
  width,
  height,
}: {
  frame: number;
  line: Timeline;
  props: BrandingIsTickerProps;
  measure: Measure;
  faces: WordFaces;
  logo: string | null;
  aspect: number | null;
  inks: EndInks;
  width: number;
  height: number;
}) => {
  const card = props.endCard;
  const name = props.endCard.nameCaps
    ? props.companyName.trim().toUpperCase()
    : props.companyName.trim();
  const room = width - 2 * SIDE;
  const nameSize = fitTo(card.nameSize, measure(name, faces.bold, NAME_TRACKING), room);
  const tile = tileSize(card.logoSize, aspect, Math.min(TILE_WIDEST, room));
  const label = props.callToAction.trim();
  const buttonText = measure(label.toUpperCase(), faces.bold, BUTTON_TRACKING);
  const buttonSize = fitTo(card.buttonSize, buttonText + 1.6, room - card.buttonSize * 2);
  const buttonHeight = Math.round(buttonSize * 2.9);
  const buttonWidth = Math.round(buttonSize * (buttonText + 1.4) + buttonSize * 2.6);
  const chip = Math.round(card.contactSize * 1.8);
  const textRoom = room - chip - card.contactSize * 0.6;
  const rows = [
    { key: 'web', icon: Globe, text: props.website.trim() },
    { key: 'phone', icon: Phone, text: props.phone.trim() },
  ].filter((row) => row.text !== '');
  const contactSize = Math.min(
    ...rows.map((row) => fitTo(card.contactSize, measure(row.text, faces.medium), textRoom)),
    card.contactSize,
  );
  const textWidth = Math.max(
    0,
    ...rows.map((row) => measure(row.text, faces.medium) * contactSize),
  );
  const blockWidth = chip + card.contactSize * 0.6 + textWidth;
  const rowGap = Math.round(chip * 1.42);
  const gaps = { name: 40, button: name === '' ? 0 : 70, rows: label === '' ? 0 : 104 };
  const total =
    tile.height +
    (name === '' ? 0 : gaps.name + nameSize) +
    (label === '' ? 0 : gaps.button + buttonHeight) +
    (rows.length === 0 ? 0 : gaps.rows + chip + (rows.length - 1) * rowGap);
  const tileTop = Math.round((height - total) / 2);
  const nameTop = tileTop + tile.height + gaps.name;
  const buttonTop = (name === '' ? tileTop + tile.height : nameTop + nameSize) + gaps.button;
  const rowsTop = (label === '' ? buttonTop - gaps.button : buttonTop + buttonHeight) + gaps.rows;
  const at = (slot: number) => line.entryStart + slot * line.stagger;
  const aliveFrom = at(2) + ENTRY_FRAMES;
  const hold = Math.max(0, frame - aliveFrom);
  const turn = 135 + 25 * Math.sin((2 * Math.PI * hold) / 180);
  const sheen = card.sheen && frame >= aliveFrom;
  const sheenIn = ramp(frame, aliveFrom, aliveFrom + 24);
  const sheenBands = [0, 0.5].map((phase) => -0.45 + 1.45 * ((hold / SHEEN_EVERY + phase) % 1));
  const nudge = frame >= aliveFrom ? 6 * (1 - Math.cos((2 * Math.PI * hold) / 40)) : 0;
  const plateInset = Math.round(tile.height * 0.06);
  const plate = { width: tile.width - 2 * plateInset, height: tile.height - 2 * plateInset };
  return (
    <>
      <Rise frame={frame} start={at(0)} top={tileTop}>
        <div
          style={{
            position: 'relative',
            margin: '0 auto',
            width: tile.width,
            height: tile.height,
            borderRadius: tile.height * 0.24,
            backgroundImage: `linear-gradient(${turn}deg, ${inks.gradient[0]}, ${inks.gradient[1]})`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: plateInset,
              top: plateInset,
              width: plate.width,
              height: plate.height,
              borderRadius: tile.height * 0.19,
              backgroundColor: inks.plate,
            }}
          >
            <LogoImage src={logo} aspect={aspect} box={plate} />
          </div>
        </div>
      </Rise>
      {name === '' ? null : (
        <Rise frame={frame} start={at(1)} top={nameTop}>
          <div
            style={{
              ...faceStyle(faces.bold),
              fontSize: nameSize,
              lineHeight: `${nameSize}px`,
              letterSpacing: `${NAME_TRACKING}em`,
              textAlign: 'center',
              whiteSpace: 'nowrap',
              color: inks.ink,
              paddingLeft: `${NAME_TRACKING}em`,
            }}
          >
            {name}
          </div>
        </Rise>
      )}
      {label === '' ? null : (
        <Rise frame={frame} start={at(2)} top={buttonTop}>
          <div
            style={{
              position: 'relative',
              margin: '0 auto',
              width: buttonWidth,
              height: buttonHeight,
              borderRadius: buttonHeight / 2,
              overflow: 'hidden',
              backgroundImage: `linear-gradient(90deg, ${inks.gradient[0]}, ${inks.gradient[1]})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: buttonSize * 0.5,
              color: inks.buttonInk,
            }}
          >
            {sheen
              ? sheenBands.map((band, index) => (
                  <div
                    key={index === 0 ? 'lead' : 'follow'}
                    style={{
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      left: Math.round(band * buttonWidth),
                      width: Math.round(buttonWidth * 0.45),
                      opacity: sheenIn,
                      backgroundImage:
                        'linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.26) 50%, rgba(255,255,255,0) 100%)',
                    }}
                  />
                ))
              : null}
            <span
              style={{
                ...faceStyle(faces.bold),
                fontSize: buttonSize,
                lineHeight: `${buttonSize}px`,
                letterSpacing: `${BUTTON_TRACKING}em`,
                whiteSpace: 'nowrap',
              }}
            >
              {label.toUpperCase()}
            </span>
            <ArrowRight
              size={Math.round(buttonSize * 0.95)}
              strokeWidth={2.6}
              style={{ transform: `translateX(${nudge.toFixed(2)}px)` }}
            />
          </div>
        </Rise>
      )}
      {rows.map((row, index) => (
        <Rise key={row.key} frame={frame} start={at(3 + index)} top={rowsTop + index * rowGap}>
          <div
            style={{
              margin: '0 auto',
              width: Math.round(blockWidth),
              display: 'flex',
              alignItems: 'center',
              gap: card.contactSize * 0.6,
            }}
          >
            <div
              style={{
                width: chip,
                height: chip,
                flex: 'none',
                borderRadius: chip * 0.3,
                backgroundColor: inks.chipFill,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: inks.chipInk,
              }}
            >
              <row.icon size={Math.round(chip * 0.5)} strokeWidth={2} />
            </div>
            <div
              style={{
                ...faceStyle(faces.medium),
                fontSize: contactSize,
                lineHeight: `${contactSize}px`,
                whiteSpace: 'nowrap',
                color: inks.ink,
              }}
            >
              {row.text}
            </div>
          </div>
        </Rise>
      ))}
    </>
  );
};
