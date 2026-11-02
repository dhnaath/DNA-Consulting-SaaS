import React from 'react';

interface CircularProgressProps {
  progress: number; // 0 to 100+
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  showText?: boolean;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  progress,
  size = 20,
  strokeWidth = 2.5,
  color,
  backgroundColor = '#E5E7EB',
  showText = false,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;

  // Dynamic stroke color if not explicitly provided
  let strokeColor = color;
  if (!strokeColor) {
    if (progress > 100) {
      strokeColor = '#EF4444'; // Red for over budget
    } else if (progress >= 80) {
      strokeColor = '#F59E0B'; // Amber
    } else {
      strokeColor = '#10B981'; // Green
    }
  }

  return (
    <div className="relative inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress fill */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-300 ease-out"
        />
      </svg>
      {showText && (
        <span className="absolute text-[9px] font-mono font-medium text-neutral-600">
          {Math.round(progress)}%
        </span>
      )}
    </div>
  );
};
