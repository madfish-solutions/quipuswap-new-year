import React, { FC } from 'react';
import { Container } from './container';

export const Background: FC = ({ children }) => {
  return (
    <div className="background">
      <Container>{children}</Container>
    </div>
  );
};
