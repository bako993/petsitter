import React from 'react';
import { View, Image, Dimensions, StyleSheet } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import Animated from 'react-native-reanimated';
import { PhotoSliderProps } from '@/src/types/types';

const { width } = Dimensions.get('window');

export default function PhotoSlider({ images }: PhotoSliderProps) {
  return (
    <View style={styles.container}>
      <Carousel
        width={width - 40}
        height={220}
        autoPlay={true}
        loop={true}
        data={images}
        scrollAnimationDuration={800}
        snapEnabled={true}
        pagingEnabled={true}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 40,
        }}
        renderItem={({ item }) => (
          <Animated.View style={styles.carouselItem}>
            <Image source={item} style={styles.image} />
          </Animated.View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    alignItems: 'center',
  },
  carouselItem: {
    width: '100%',
    height: 220,
    borderRadius: 15,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
});
