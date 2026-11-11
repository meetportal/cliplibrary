import { alpha } from './color';
import { NAME_FACE } from './fonts';
import type { WordmarkLayout } from './layout';

export const Wordmark = ({
  layout,
  color,
  tracking,
}: {
  layout: WordmarkLayout;
  color: string;
  tracking: number;
}) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      width: 1080,
      top: layout.top,
      textAlign: 'center',
      fontFamily: NAME_FACE.family,
      fontWeight: NAME_FACE.weight,
      fontSize: layout.size,
      lineHeight: `${layout.lineHeight}px`,
      letterSpacing: `${tracking}em`,
      color,
      textShadow: `0 0 ${Math.round(layout.size * 0.35)}px ${alpha(color, 0.55)}`,
      whiteSpace: 'nowrap',
    }}
  >
    {layout.lines.map((line) => (
      <div key={line} style={{ marginRight: `-${tracking}em` }}>
        {line}
      </div>
    ))}
  </div>
);
