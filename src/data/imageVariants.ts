export interface ResponsiveSource {
  type: string;
  srcSet: string;
}

export interface ImageVariantConfig {
  sources: ResponsiveSource[];
  fallback: {
    src: string;
    width: number;
    height: number;
  };
  sizes?: string;
}

interface VariantDefinition {
  src: string;
  widths: number[];
  fallbackWidth: number;
  fallbackHeight: number;
  sizes?: string;
}

const VARIANT_DEFINITIONS: VariantDefinition[] = [
  {
    src: '/lovable-uploads/80e5f731-db09-4c90-8350-01fcb1fe353d.png',
    widths: [640, 1024, 1600],
    fallbackWidth: 1200,
    fallbackHeight: 900,
    sizes: '(max-width: 1024px) 100vw, 1600px',
  },
  {
    src: '/lovable-uploads/5eea137e-7ec4-407d-8452-faeea24c872f.png',
    widths: [480, 960, 1440],
    fallbackWidth: 960,
    fallbackHeight: 720,
    sizes: '(max-width: 1024px) 100vw, 1440px',
  },
  {
    src: '/lovable-uploads/dfb36f59-24c0-44d0-8049-9677f7a3f7ba.png',
    widths: [400, 800, 1200],
    fallbackWidth: 800,
    fallbackHeight: 360,
    sizes: '(max-width: 1024px) 100vw, 800px',
  },
  {
    src: '/lovable-uploads/f33cbcfa-005e-435c-a104-9a21d080a343.png',
    widths: [320, 640, 960],
    fallbackWidth: 640,
    fallbackHeight: 1387,
    sizes: '(max-width: 768px) 80vw, 320px',
  },
  {
    src: '/lovable-uploads/116450ad-e39b-42bd-891b-c7e312d4cf91.png',
    widths: [320, 640, 960],
    fallbackWidth: 640,
    fallbackHeight: 1422,
    sizes: '(max-width: 768px) 90vw, 360px',
  },
  {
    src: '/lovable-uploads/992cf8cb-032a-4253-b9d7-45f675e69217.png',
    widths: [320, 640, 960],
    fallbackWidth: 640,
    fallbackHeight: 1422,
    sizes: '(max-width: 768px) 80vw, 360px',
  },
  {
    src: '/lovable-uploads/8d1be6f1-c743-47df-8d3e-f1ab6230f326.png',
    widths: [240, 360, 540],
    fallbackWidth: 360,
    fallbackHeight: 210,
    sizes: '(max-width: 640px) 70vw, 280px',
  },
  {
    src: '/lovable-uploads/5984413e-46ac-4f11-ac75-953d93235faa.png',
    widths: [360, 540, 720],
    fallbackWidth: 720,
    fallbackHeight: 1600,
    sizes: '(max-width: 768px) 80vw, 540px',
  },
  {
    src: '/lovable-uploads/7b53e2bb-e419-483c-b48c-ea2d1f5c139e.png',
    widths: [640, 960, 1440],
    fallbackWidth: 1200,
    fallbackHeight: 540,
    sizes: '(max-width: 1024px) 100vw, 1440px',
  },
  {
    src: '/lovable-uploads/b583ddb3-be15-4d62-b3fe-1d5a4ed4cd2a.png',
    widths: [360, 540, 720],
    fallbackWidth: 720,
    fallbackHeight: 960,
    sizes: '(max-width: 768px) 80vw, 540px',
  },
  {
    src: '/lovable-uploads/e1922069-2f8f-4a3e-988e-a8631602ed44.png',
    widths: [640, 960, 1440],
    fallbackWidth: 1200,
    fallbackHeight: 900,
    sizes: '(max-width: 1024px) 100vw, 1440px',
  },
];

const replaceExtension = (src: string, extension: string) => {
  const lastDotIndex = src.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return `${src}.${extension}`;
  }
  return `${src.slice(0, lastDotIndex)}.${extension}`;
};

const buildSrcSet = (src: string, widths: number[], extension: string) => {
  const base = replaceExtension(src, extension);
  const withoutWidth = base.slice(0, base.lastIndexOf('.'));
  return widths
    .map((width) => `${withoutWidth}-${width}.${extension} ${width}w`)
    .join(', ');
};

export const imageVariants: Record<string, ImageVariantConfig> = VARIANT_DEFINITIONS.reduce(
  (acc, definition) => {
    const { src, widths, fallbackWidth, fallbackHeight, sizes } = definition;
    const baseWithoutExtension = src.slice(0, src.lastIndexOf('.'));

    acc[src] = {
      sources: [
        {
          type: 'image/avif',
          srcSet: buildSrcSet(src, widths, 'avif'),
        },
        {
          type: 'image/webp',
          srcSet: buildSrcSet(src, widths, 'webp'),
        },
      ],
      fallback: {
        src: `${baseWithoutExtension}-${fallbackWidth}.jpg`,
        width: fallbackWidth,
        height: fallbackHeight,
      },
      sizes,
    };

    return acc;
  },
  {}
);
