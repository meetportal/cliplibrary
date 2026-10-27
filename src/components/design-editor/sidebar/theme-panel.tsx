'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  cssFontFamily,
  FONT_FAMILIES,
  fontRoles,
  replaceFont,
  setSwatchColor,
  type TextElement,
} from '@/design';
import { loadFontFamily } from '../font-loader';
import { ColorInput } from '../panels/fields';
import type { DesignEditorState } from '../use-design-editor';

const Heading = ({ title, hint }: { title: string; hint: string }) => (
  <div className="flex flex-col gap-0.5">
    <h3 className="font-medium text-[13px]">{title}</h3>
    <p className="text-[11px] text-muted-foreground">{hint}</p>
  </div>
);

export const PaletteControls = ({ editor }: { editor: DesignEditorState }) => {
  const { palette } = editor.design;
  if (palette.length === 0) {
    return <p className="text-muted-foreground text-xs">This design has no colour roles.</p>;
  }
  return (
    <div className="flex flex-col gap-3" data-testid="palette-controls">
      {palette.map((swatch) => (
        <div key={swatch.id} className="flex flex-col gap-1">
          <span className="text-[11px] text-muted-foreground">
            {swatch.label}
            {swatch.shades.length > 0 ? ` · ${swatch.shades.length + 1} shades` : ''}
          </span>
          <ColorInput
            label={`${swatch.label} colour`}
            value={swatch.color}
            onChange={(color, live) =>
              editor.transform((current) => setSwatchColor(current, swatch.id, color), live)
            }
            onCommit={editor.seal}
          />
        </div>
      ))}
    </div>
  );
};

const FontControls = ({ editor }: { editor: DesignEditorState }) => {
  const roles = fontRoles(editor.design.elements);
  return (
    <div className="flex flex-col gap-3">
      {roles.map((role) => (
        <div key={role.family} className="flex flex-col gap-1">
          <span className="text-[11px] text-muted-foreground">
            {role.label} · {role.count} {role.count === 1 ? 'text' : 'texts'}
          </span>
          <Select
            value={role.family}
            onValueChange={(family) => {
              loadFontFamily(family).catch(() => undefined);
              editor.transform((current) => replaceFont(current, role.family, family));
            }}
          >
            <SelectTrigger className="h-8 w-full" aria-label={`${role.label} font`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              {FONT_FAMILIES.map((font) => (
                <SelectItem
                  key={font.family}
                  value={font.family}
                  onMouseEnter={() => loadFontFamily(font.family).catch(() => undefined)}
                >
                  <span style={{ fontFamily: cssFontFamily(font.family) }}>{font.family}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
};

const isVisibleText = (element: { type: string; hidden: boolean }): element is TextElement =>
  element.type === 'text' && !element.hidden;

const CopyControls = ({ editor }: { editor: DesignEditorState }) => {
  const texts = editor.design.elements.filter(isVisibleText).sort((a, b) => a.y - b.y || a.x - b.x);
  return (
    <div className="flex flex-col gap-2">
      {texts.map((element) => (
        <Textarea
          key={element.id}
          aria-label={`Text: ${element.name}`}
          rows={1}
          value={element.text}
          onFocus={() => editor.focusElement(element.id)}
          onChange={(event) => editor.replaceElement({ ...element, text: event.target.value })}
          className="min-h-9 py-1.5"
        />
      ))}
    </div>
  );
};

export const ThemePanel = ({ editor }: { editor: DesignEditorState }) => (
  <div className="flex flex-col gap-6" data-testid="theme-panel">
    <section className="flex flex-col gap-3">
      <Heading title="Colours" hint="Each role recolours every element and shade that uses it." />
      <PaletteControls editor={editor} />
    </section>
    <section className="flex flex-col gap-3">
      <Heading title="Fonts" hint="Swap a typeface everywhere it is used." />
      <FontControls editor={editor} />
    </section>
    <section className="flex flex-col gap-3">
      <Heading title="Text" hint="Edit every line of copy in one place." />
      <CopyControls editor={editor} />
    </section>
  </div>
);
