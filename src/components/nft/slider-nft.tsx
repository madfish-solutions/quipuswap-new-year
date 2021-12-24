import { FC } from 'react';

import Slider from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { NftToken } from '../../interfaces/NftToken';
import { Card } from './card';
import { NftSliderSettings } from './nft-slider-data';

interface SliderNFTProps {
  nftTokens: NftToken[] | null;
}

export const SliderNFT: FC<SliderNFTProps> = ({ nftTokens }) => {
  return <Slider {...NftSliderSettings}>{nftTokens && nftTokens.map(token => <Card token={token} />)}</Slider>;
};
