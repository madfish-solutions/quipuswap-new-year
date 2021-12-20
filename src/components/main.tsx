import React from 'react';

import { Card } from './card';
import { Rules } from './rules';
import { YouStacked } from './you-staked';

const first =
  'https://tableforchange.com/wp-content/uploads/2020/06/%D0%9E%D0%B1%D0%BE%D0%B8-%D0%B4%D0%BB%D1%8F-%D0%B4%D0%B5%D0%B2%D0%BE%D1%87%D0%B5%D0%BA-%D0%BD%D0%B0-%D1%82%D0%B5%D0%BB%D0%B5%D1%84%D0%BE%D0%BD-12-%D0%BB%D0%B5%D1%82-%D0%BA%D1%80%D0%B0%D1%81%D0%B8%D0%B2%D1%8B%D0%B5-%D0%BA%D0%B0%D1%80%D1%82%D0%B8%D0%BD%D0%BA%D0%B8-16.jpg';

const second = 'https://klike.net/uploads/posts/2019-06/1560664251_3.jpg';

const eg = 'https://s00.yaplakal.com/pics/pics_original/8/9/1/15595198.jpg';

export const Main = () => {
  return (
    <main>
      <Card gridRow="1/3" gridColumn="1/2" src={first} alt="" />
      <Card gridRow="1/3" gridColumn="2/3" src={second} alt="" />
      <Card gridRow="1/3" gridColumn="3/4" src={eg} alt="" />

      <Rules />
      <YouStacked />
    </main>
  );
};
