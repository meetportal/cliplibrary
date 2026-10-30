export type FootageStill = {
  name: string;
  model: string;
  prompt: string;
  aspectRatio: string;
  from?: string;
  publishWidth?: number;
};

export type FootageShot = {
  name: string;
  model: string;
  prompt: string;
  providerOptions?: Record<string, { parameters: Record<string, unknown> }>;
  seconds: number;
  firstFrame: string;
  lastFrame?: string;
};

export type PlateSegment = {
  shot: string;
  from: number;
  to: number;
  step?: number;
};

export type FootageSpec = {
  id: string;
  aspectRatio: '9:16' | '16:9';
  resolution: '720p' | '1080p';
  width: number;
  height: number;
  fps: number;
  stills: FootageStill[];
  shots: FootageShot[];
  plate: PlateSegment[];
};
