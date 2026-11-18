import { statSync } from 'node:fs';
import { Glob } from 'bun';
import { parseSync } from 'oxc-parser';

type CommentRange = {
  start: number;
  end: number;
  text: string;
  line: number;
};

const ALLOWED = [
  /^\/\/\s*biome-ignore\b/,
  /^\/\*\s*biome-ignore\b/,
  /^\/\/\s*@ts-(expect-error|ignore|nocheck|check)\b/,
  /^\/\/\s*eslint-(disable|enable)\b/,
  /^\/\/\/\s*<reference\b/,
  /^\/\/\s*prettier-ignore\b/,
  /^\/\*!\s/,
];

const isAllowed = (text: string): boolean => ALLOWED.some((pattern) => pattern.test(text));

const lineOf = (source: string, position: number): number =>
  source.slice(0, position).split('\n').length;

const collectComments = (file: string, source: string): CommentRange[] => {
  const { comments, errors } = parseSync(file, source);
  const [error] = errors;
  if (error !== undefined) {
    throw new Error(`${file}: ${error.message}`);
  }
  return comments.map((comment) => ({
    start: comment.start,
    end: comment.end,
    text: source.slice(comment.start, comment.end),
    line: lineOf(source, comment.start),
  }));
};

const stripFrom = (source: string, disallowed: CommentRange[]): string => {
  let output = source;
  for (const comment of [...disallowed].sort((a, b) => b.start - a.start)) {
    output = output.slice(0, comment.start) + output.slice(comment.end);
  }
  return output
    .split('\n')
    .filter((line, index, lines) => {
      const blank = line.trim().length === 0;
      const prevBlank = (lines[index - 1] ?? 'x').trim().length === 0;
      return !(blank && prevBlank);
    })
    .join('\n');
};

const isScannable = (file: string): boolean =>
  !(file.includes('node_modules') || file.endsWith('.gen.ts') || file.endsWith('.d.ts'));

const scanGlob = async (pattern: string): Promise<string[]> => {
  const glob = new Glob(pattern);
  const files: string[] = [];
  for await (const file of glob.scan({ dot: false })) {
    files.push(file);
  }
  return files;
};

const DEFAULT_PATTERNS = ['*.ts', '{src,tests,e2e,scripts}/**/*.{ts,tsx}'];

const resolveFiles = async (args: string[]): Promise<string[]> => {
  const explicit = args.filter((arg) => !arg.startsWith('--'));
  const resolved = await Promise.all(
    explicit.length === 0
      ? DEFAULT_PATTERNS.map(scanGlob)
      : explicit.map((entry) =>
          statSync(entry).isDirectory()
            ? scanGlob(`${entry}/**/*.{ts,tsx}`)
            : Promise.resolve([entry]),
        ),
  );
  return resolved.flat().filter(isScannable);
};

const main = async (): Promise<void> => {
  const args = Bun.argv.slice(2);
  const checkOnly = args.includes('--check');
  const files = await resolveFiles(args);
  const violations: string[] = [];
  const writes: Promise<unknown>[] = [];

  const scanned = await Promise.all(
    files.map(async (file) => {
      const source = await Bun.file(file).text();
      const disallowed = collectComments(file, source).filter(
        (comment) => !isAllowed(comment.text),
      );
      return { file, source, disallowed };
    }),
  );

  for (const { file, source, disallowed } of scanned) {
    if (disallowed.length === 0) {
      continue;
    }
    if (checkOnly) {
      for (const comment of disallowed) {
        violations.push(`${file}:${comment.line}  ${comment.text.split('\n')[0]?.trim() ?? ''}`);
      }
    } else {
      writes.push(Bun.write(file, stripFrom(source, disallowed)));
    }
  }
  await Promise.all(writes);

  if (checkOnly && violations.length > 0) {
    console.error(`Found ${violations.length} disallowed comment(s):`);
    for (const violation of violations) {
      console.error(`  ${violation}`);
    }
    process.exit(1);
  }
};

await main();
