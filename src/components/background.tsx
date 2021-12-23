import React, { FC, useEffect, useRef, useState } from 'react';

import { Container } from './container';
import { BlueStar } from './stars/blue-star';
import { OrangeStar } from './stars/orange-star';

const random = (minimum: number, maximum: number) => {
  return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
};

const fixNumber = (value: number) => ~~value;

const getStar = (top: number, left: number, size: number) => {
  if (fixNumber(left) % 2 === 0) {
    return <BlueStar key={`${top}_${left}`} top={top.toString()} left={left.toString()} size={size} />;
  } else {
    return <OrangeStar key={`${top}_${left}`} top={top.toString()} left={left.toString()} size={size} />;
  }
};

const generateStars = (size: number, width: number, height: number) => {
  const verticalQuantity = Math.ceil(height / size);
  const horizontalQuantity = Math.floor(width / size);
  const headerHeight = 64;
  const arrayOfStars = [];

  for (let i = 0; i < verticalQuantity; i++) {
    for (let j = 0; j < horizontalQuantity; j++) {
      const minimumTop = (i + 0.1) * size + headerHeight;
      const maximumTop = (i + 0.9) * size + headerHeight;
      const minimumLeft = (j + 0.1) * size;
      const maximumLeft = (j + 0.9) * size;

      const top = random(minimumTop, maximumTop);
      const left = random(minimumLeft, maximumLeft);
      const starSize = random(4, 12);

      arrayOfStars.push(getStar(top, left, starSize));
    }
  }

  return arrayOfStars;
};

export const Background: FC = ({ children }) => {
  const background = useRef<HTMLDivElement>(null);
  const [stars, setStars] = useState<JSX.Element[]>([]);
  useEffect(() => {
    setTimeout(() => {
      if (stars.length) {
        return;
      }
      const Stars =
        background.current?.offsetWidth && background.current?.offsetHeight
          ? generateStars(70, background.current?.offsetWidth, background.current?.offsetHeight)
          : [];
      setStars(Stars);
    }, 100);
  }, [stars.length]);

  return (
    <div ref={background} className="background">
      {stars}
      <Container>{children}</Container>
    </div>
  );
};
