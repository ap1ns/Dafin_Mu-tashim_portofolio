import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';

const LottieAnimation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const animation = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '/lottie/animation.json',
    });

    return () => animation.destroy();
  }, []);

  return <div id="lottie-container" ref={containerRef} className="lottie-responsive reveal" />;
};

export default LottieAnimation;
