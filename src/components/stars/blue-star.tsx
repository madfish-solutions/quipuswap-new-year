import React, { FC } from 'react';

interface BlueStarProps {
  top: number;
  left: number;
  size: number;
}

export const BlueStar: FC<BlueStarProps> = ({ top, left, size }) => {
  return (
    <svg
      style={{ position: 'absolute', zIndex: -1, top, left }}
      width={size}
      height={size}
      viewBox="0 0 10 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.04077 0.392456L5.93054 2.35744L9.42285 2.4828L7.45787 5.37257L7.33251 8.86488L4.44274 6.8999L0.950428 6.77453L2.91541 3.88476L3.04077 0.392456Z"
        fill="url(#paint0_linear_32_14251)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_32_14251"
          x1="3.04077"
          y1="0.392456"
          x2="9.85038"
          y2="3.73436"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#5C1EE0" />
          <stop offset="1" stopColor="#1373E4" />
        </linearGradient>
      </defs>
    </svg>
  );
};
