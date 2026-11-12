import { mixLab } from './color';
import { fitSize, HEADLINE_FACE, LABEL_FACE, type Measure } from './fonts';
import { Glow } from './glow';
import { PHONE, PHONE_CENTERS, Phone, type PhoneLook, Plug } from './phone';

const HEADLINE_CENTER = 470;
const LABEL_CENTER = 690;
const HEADLINE_TRACKING = -0.01;
const LABEL_TRACKING = 0.12;
const LABEL_WIDTH = 400;

export type CompareLayout = {
  lead: string;
  accent: string;
  headlineSize: number;
  labels: readonly [string, string];
  labelSize: number;
};

export const compareLayout = (
  input: { lead: string; accent: string; solo: string; team: string; uppercase: boolean },
  sizes: { headline: number; label: number },
  measure: Measure,
): CompareLayout => {
  const cased = (text: string) => (input.uppercase ? text.toUpperCase() : text);
  const lead = cased(input.lead.trim());
  const accent = cased(input.accent.trim());
  const full = [lead, accent].filter((part) => part !== '').join(' ');
  const headlineSize = fitSize(
    960,
    measure(full, HEADLINE_FACE, HEADLINE_TRACKING),
    sizes.headline,
    40,
  );
  const labels = [input.solo.trim().toUpperCase(), input.team.trim().toUpperCase()] as const;
  const labelEms = Math.max(...labels.map((text) => measure(text, LABEL_FACE, LABEL_TRACKING)));
  return {
    lead,
    accent,
    headlineSize,
    labels,
    labelSize: fitSize(LABEL_WIDTH, labelEms, sizes.label, 18),
  };
};

export type CompareLook = {
  text: string;
  muted: string;
  accentFrom: string;
  accentTo: string;
  teamLabel: string;
  glowColor: string;
  glow: number;
  cable: string;
  plugTop: number;
  pulse: number;
  phones: readonly [PhoneLook, PhoneLook];
};

export const Compare = ({ layout, look }: { layout: CompareLayout; look: CompareLook }) => {
  const accentLetters = [...layout.accent];
  return (
    <>
      <Glow
        color={look.glowColor}
        strength={look.glow}
        spot={{
          x: PHONE_CENTERS[1],
          y: PHONE.top + PHONE.height * 0.55,
          radius: 460,
          stretch: 1.3,
          peak: 0.32,
        }}
      />
      {PHONE_CENTERS.map((center) => (
        <Plug key={center} center={center} top={look.plugTop} cable={look.cable} />
      ))}
      <Phone look={look.phones[0]} />
      <Phone look={look.phones[1]} />
      {look.pulse > 0 && look.pulse < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: PHONE_CENTERS[1] - PHONE.width / 2 - 70 * look.pulse,
            top: PHONE.top - 70 * look.pulse,
            width: PHONE.width + 140 * look.pulse,
            height: PHONE.height + 140 * look.pulse,
            borderRadius: PHONE.radius + 70 * look.pulse,
            border: `4px solid ${look.glowColor}`,
            opacity: 0.7 * (1 - look.pulse) * Math.min(1, look.pulse * 2.5),
            boxSizing: 'border-box',
          }}
        />
      ) : null}
      <div
        style={{
          position: 'absolute',
          left: 40,
          width: 1000,
          top: Math.round(HEADLINE_CENTER - layout.headlineSize * 0.6),
          textAlign: 'center',
          fontFamily: HEADLINE_FACE.family,
          fontWeight: HEADLINE_FACE.weight,
          fontSize: layout.headlineSize,
          lineHeight: `${Math.round(layout.headlineSize * 1.2)}px`,
          letterSpacing: `${HEADLINE_TRACKING}em`,
          whiteSpace: 'pre',
        }}
      >
        <span style={{ color: look.text }}>{layout.lead === '' ? '' : `${layout.lead} `}</span>
        {accentLetters.map((letter, index) => (
          <span
            key={index}
            style={{
              color: mixLab(
                look.accentFrom,
                look.accentTo,
                index / Math.max(1, accentLetters.length - 1),
              ),
            }}
          >
            {letter}
          </span>
        ))}
      </div>
      {layout.labels.map((label, index) => (
        <div
          key={`${index}-${label}`}
          style={{
            position: 'absolute',
            left: (PHONE_CENTERS[index] ?? 0) - LABEL_WIDTH / 2,
            width: LABEL_WIDTH,
            top: Math.round(LABEL_CENTER - layout.labelSize * 0.6),
            textAlign: 'center',
            fontFamily: LABEL_FACE.family,
            fontWeight: LABEL_FACE.weight,
            fontSize: layout.labelSize,
            lineHeight: `${Math.round(layout.labelSize * 1.2)}px`,
            letterSpacing: `${LABEL_TRACKING}em`,
            color: index === 0 ? look.muted : look.teamLabel,
            whiteSpace: 'pre',
          }}
        >
          {label}
        </div>
      ))}
    </>
  );
};
