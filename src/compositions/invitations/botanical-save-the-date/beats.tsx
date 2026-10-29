import type { BotanicalSaveTheDateProps } from '@/schemas';
import { BeatColumn, Caps, GoldRule, type InviteType, Rise, Script } from './lettering';

type Lettering = BotanicalSaveTheDateProps['lettering'];

interface BeatProps {
  frame: number;
  start: number;
  end?: number | undefined;
  type: InviteType;
  lettering: Lettering;
}

const linesOf = (text: string): string[] => text.split('\n').filter((line) => line.trim() !== '');

export const PoemBeat = ({ start, end, type, lettering, poem }: BeatProps & { poem: string }) => (
  <BeatColumn type={type}>
    {linesOf(poem).map((line, index) => (
      <Rise
        key={`${index}:${line}`}
        start={start}
        end={end}
        delay={index * type.stagger}
        distance={22}
      >
        {index % 2 === 0 ? (
          <Caps text={line} size={lettering.poemSerifSize} type={type} />
        ) : (
          <Script
            text={line}
            size={lettering.poemScriptSize}
            type={type}
            lineHeight={1.05}
            style={{ marginBottom: lettering.poemScriptSize * 0.12 }}
          />
        )}
      </Rise>
    ))}
  </BeatColumn>
);

export const SaveTheDateBeat = ({
  frame,
  start,
  end,
  type,
  lettering,
  top,
  joiner,
  bottom,
  date,
}: BeatProps & { top: string; joiner: string; bottom: string; date: string }) => {
  const step = type.stagger;
  const big = {
    size: lettering.saveSize,
    type,
    weight: lettering.saveWeight,
    tracking: 0.04,
  };
  return (
    <BeatColumn type={type}>
      <Rise start={start} end={end} distance={34}>
        <div style={{ lineHeight: 0.9 }}>
          <Caps text={top} {...big} />
        </div>
      </Rise>
      {joiner.length > 0 ? (
        <Rise start={start} end={end} delay={step} distance={26}>
          <Script
            text={joiner}
            size={lettering.saveScriptSize}
            type={type}
            lineHeight={0.62}
            style={{ margin: `${-lettering.saveScriptSize * 0.06}px 0` }}
          />
        </Rise>
      ) : null}
      <Rise start={start} end={end} delay={step * 2} distance={34}>
        <Caps text={bottom} {...big} />
      </Rise>
      <GoldRule
        frame={frame}
        start={start + step * 3 + 4}
        end={end}
        width={lettering.saveSize * 1.7}
        type={type}
        margin={lettering.dateSize * 0.5}
      />
      <Rise start={start} end={end} delay={step * 3 + 10} distance={18}>
        <Caps text={date} size={lettering.dateSize} type={type} tracking={type.tracking * 1.2} />
      </Rise>
    </BeatColumn>
  );
};

export const CoupleBeat = ({
  start,
  end,
  type,
  lettering,
  intro,
  first,
  joiner,
  second,
}: BeatProps & { intro: string; first: string; joiner: string; second: string }) => {
  const step = type.stagger;
  const name = { size: lettering.nameSize, type, weight: 500, tracking: 0.06 };
  return (
    <BeatColumn type={type}>
      {intro.length > 0 ? (
        <Rise start={start} end={end} distance={18}>
          <div style={{ marginBottom: lettering.introSize * 0.7 }}>
            <Caps text={intro} size={lettering.introSize} type={type} color={type.muted} />
          </div>
        </Rise>
      ) : null}
      <Rise start={start} end={end} delay={step} distance={30}>
        <Caps text={first} {...name} />
      </Rise>
      {joiner.length > 0 ? (
        <Rise start={start} end={end} delay={step * 2} distance={24}>
          <Script
            text={joiner}
            size={lettering.partnerJoinerSize}
            type={type}
            lineHeight={0.8}
            style={{ margin: `${-lettering.partnerJoinerSize * 0.05}px 0` }}
          />
        </Rise>
      ) : null}
      <Rise start={start} end={end} delay={step * 3} distance={30}>
        <Caps text={second} {...name} />
      </Rise>
    </BeatColumn>
  );
};

export const ClosingBeat = ({
  frame,
  start,
  type,
  lettering,
  line,
  signoff,
  family,
}: BeatProps & { line: string; signoff: string; family: string }) => {
  const lines = linesOf(line);
  const step = type.stagger;
  const after = lines.length * step;
  return (
    <BeatColumn type={type}>
      {lines.map((text, index) => (
        <Rise key={`${index}:${text}`} start={start} delay={index * step} distance={22}>
          <Caps text={text} size={lettering.closingSize} type={type} />
        </Rise>
      ))}
      <GoldRule
        frame={frame}
        start={start + after + 2}
        width={lettering.closingSize * 2.4}
        type={type}
        margin={lettering.closingSize * 0.7}
      />
      {signoff.length > 0 ? (
        <Rise start={start} delay={after + 8} distance={16}>
          <Caps text={signoff} size={lettering.signoffSize} type={type} color={type.muted} />
        </Rise>
      ) : null}
      <Rise start={start} delay={after + 14} distance={26}>
        <Script text={family} size={lettering.familySize} type={type} />
      </Rise>
    </BeatColumn>
  );
};
