import React from 'react';

export default function ProgressiveBlur({ className, direction = 'left', blurIntensity = 5 }) {
  // define optional positioning for left or right blur overlays
  const directionStyles =
    direction === 'left'
      ? { left: 0, top: 0, bottom: 0 }
      : { right: 0, top: 0, bottom: 0 };

  return (
    <div
      className={className}
      aria-hidden="true"
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        filter: `blur(${blurIntensity}px)`,
        ...directionStyles,
      }}
    />
  );
}
