export const ChalkFilter = (props: { id: string; grain: number }) => {
  const gain = -3.2 * props.grain;
  const offset = 1 + 1.55 * props.grain;
  return (
    <filter
      id={props.id}
      x="-10%"
      y="-30%"
      width="120%"
      height="160%"
      colorInterpolationFilters="sRGB"
    >
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.55"
        numOctaves={2}
        seed={4}
        result="grain"
      />
      <feColorMatrix
        in="grain"
        type="matrix"
        values={`0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  ${gain} 0 0 0 ${offset}`}
        result="holes"
      />
      <feComposite in="SourceGraphic" in2="holes" operator="in" result="dusty" />
      <feDisplacementMap
        in="dusty"
        in2="grain"
        scale={3 + 3 * props.grain}
        xChannelSelector="R"
        yChannelSelector="G"
        result="chalk"
      />
      <feGaussianBlur in="SourceAlpha" stdDeviation={5} result="blur" />
      <feOffset in="blur" dy={4} result="drop" />
      <feFlood floodColor="#000000" floodOpacity={0.32} />
      <feComposite in2="drop" operator="in" result="shadow" />
      <feMerge>
        <feMergeNode in="shadow" />
        <feMergeNode in="chalk" />
      </feMerge>
    </filter>
  );
};
