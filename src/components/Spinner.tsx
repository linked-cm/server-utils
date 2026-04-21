import React from 'react';

interface SpinnerProps {
  active?: boolean;
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
}

export function Spinner({
  active = true,
  size = 'medium',
  color = '#00a8b8',
  className = '',
}: SpinnerProps) {
  if (!active) {
    return null;
  }

  const sizes = {
    small: { width: 16, height: 16, borderWidth: 3 },
    medium: { width: 24, height: 24, borderWidth: 3 },
    large: { width: 32, height: 32, borderWidth: 4 },
  };

  const dimensions = sizes[size];

  return (
    <div
      className={className}
      style={{
        display: 'inline-block',
        border: `${dimensions.borderWidth}px solid transparent`,
        borderTopColor: color,
        borderRadius: '50%',
        width: dimensions.width,
        height: dimensions.height,
        animation: 'spin 1s linear infinite',
      }}
      role="progressbar"
      aria-busy="true"
    />
  );
}

// Default export for backward compatibility
export default Spinner;
