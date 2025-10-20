import React from 'react';
import ScreenWrapper from '@/src/components/ScreenWrapper';
import PhotoSlider from '@/src/components/PhotoSlider';
import HomeHeader from '@/src/components/Home/HomeHeader';
import HomeButtons from '@/src/components/Home/HomeButtons';
import HomeHighlights from '@/src/components/Home/HomeHighlights';

const sliderImages = [
  require('@/assets/images/slider/slider1.jpg'),
  require('@/assets/images/slider/slider2.jpg'),
  require('@/assets/images/slider/slider3.jpg'),
  require('@/assets/images/slider/slider4.jpg'),
];

export default function HomeScreen() {
  return (
    <ScreenWrapper>
      <HomeHeader />
      <PhotoSlider images={sliderImages} />
      <HomeButtons />
      <HomeHighlights />
    </ScreenWrapper>
  );
}
