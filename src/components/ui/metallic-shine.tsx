import { useEffect, useRef } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';

/**
 * Metallic Shine Animation Component
 * Uses Lottie for smooth metallic shimmer effect
 */
export const MetallicShine = ({ className }: { className?: string }) => {
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  // Inline Lottie animation data for metallic shine effect
  const animationData = {
    v: "5.7.4",
    fr: 30,
    ip: 0,
    op: 60,
    w: 200,
    h: 200,
    nm: "Metallic Shine",
    ddd: 0,
    assets: [],
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: "Shine",
        sr: 1,
        ks: {
          o: { a: 0, k: 80 },
          r: { a: 0, k: -30 },
          p: {
            a: 1,
            k: [
              { t: 0, s: [-50, 100], e: [250, 100] },
              { t: 60, s: [250, 100] }
            ]
          },
          a: { a: 0, k: [0, 0] },
          s: { a: 0, k: [100, 100] }
        },
        ao: 0,
        shapes: [
          {
            ty: "rc",
            d: 1,
            s: { a: 0, k: [60, 300] },
            p: { a: 0, k: [0, 0] },
            r: { a: 0, k: 0 },
            nm: "Rectangle"
          },
          {
            ty: "gf",
            o: { a: 0, k: 100 },
            g: {
              p: 3,
              k: {
                a: 0,
                k: [
                  0, 1, 1, 1, 0,
                  0.5, 1, 1, 1, 1,
                  1, 1, 1, 1, 0
                ]
              }
            },
            s: { a: 0, k: [-30, 0] },
            e: { a: 0, k: [30, 0] },
            t: 1,
            nm: "Gradient Fill"
          }
        ],
        ip: 0,
        op: 60,
        st: 0,
        bm: 0
      }
    ]
  };

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(0.8);
    }
  }, []);

  return (
    <div className={className} style={{ pointerEvents: 'none' }}>
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData}
        loop={true}
        autoplay={true}
      />
    </div>
  );
};
