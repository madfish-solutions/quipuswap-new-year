import React, { FC } from 'react';

interface OrangeStarProps {
  top: string;
  left: string;
  size: number;
}

export const OrangeStar: FC<OrangeStarProps> = ({ top, left, size }) => {
  return (
    <svg
      className="star"
      style={{ position: 'absolute', display: 'block', zIndex: -1, top: `${top}px`, left: `${left}px` }}
      width={size}
      height={size}
      viewBox="0 0 9 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.00452 0.738083L4.75629 2.60923L8.08183 2.72861L6.21069 5.48038L6.09131 8.80593L3.33953 6.93478L0.0139921 6.8154L1.88514 4.06362L2.00452 0.738083Z"
        fill="url(#paint0_linear_32_14138)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_32_14138"
          x1="2.00452"
          y1="0.738083"
          x2="8.48894"
          y2="3.9204"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF6B00" />
          <stop offset="1" stopColor="#F9A605" />
        </linearGradient>
      </defs>
    </svg>
  );
};
