import { FC } from 'react';

import Slider from 'react-slick';

import { Card, NftCardProps } from './card';
import { NftSliderSettings } from './nft-slider-data';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { NftToken } from 'interfaces/NftToken';

interface SliderNFTProps {
  nftDataList: Array<NftToken>;
}

const NftData = {
  name: 'Distribution stars',
  rarity: '14%',
  quantity: '100'
};

export const SliderNFT: FC<SliderNFTProps> = ({ nftDataList }) => {
  if (!nftDataList) {
    nftDataList = ['', '', ''] as any as Array<NftToken>;
  } // TODO remove

  const preparedDataList: Array<NftCardProps> = nftDataList.map(NftData => {
    const { thumbnailUri, name, description, rarity, quantity } = NftData;

    // return {
    //   src: thumbnailUri!,
    //   alt: name!,
    //   description: description!,
    //   nftData: {
    //     name: name!,
    //     rarity: rarity!,
    //     quantity: quantity!
    //   }
    // }

    return {
      // TODO remove
      src: '/mock_img.png',
      alt: '',
      description: 'it`s some nft discription!',
      nftData: {
        name: 'Distribution stars',
        rarity: '14%',
        quantity: '100'
      }
    };
  });
  return (
    <Slider {...NftSliderSettings}>
      {preparedDataList.map(data => {
        const { src, alt, description, nftData } = data;
        return <Card src={src} alt={alt} description={description} nftData={nftData} />;
      })}
    </Slider>
  );
};
