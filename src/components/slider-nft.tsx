import Slider from 'react-slick';

import { FC } from 'react';
import { Card } from './card';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const settings = {
  slidesToShow: 3,
  slidesToScroll: 3,
  responsive: [
    {
      breakpoint: 1600,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        initialSlide: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

export const SliderNFT: FC = () => {
  return (
    <Slider {...settings}>
      <Card src="/mock_img.png" alt="" />
      <Card src="/mock_img.png" alt="" />
      <Card src="/mock_img.png" alt="" />
    </Slider>
  );
};
