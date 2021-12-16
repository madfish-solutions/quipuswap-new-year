import React, { FC } from 'react';

interface BoxProps {
  gridRow: string;
  gridColumn: string;
}

export const Box: FC<BoxProps> = ({ children, gridRow, gridColumn }) => {
  return (
    <div className="box" style={{ gridRow, gridColumn }}>
      {children}
    </div>
  );
};
