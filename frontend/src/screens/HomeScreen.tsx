import React from 'react';
import ScreenWrapper from '@/src/components/ScreenWrapper';
import { Theme } from '@/src/theme/theme';
import PhotoSlider from '@/src/components/PhotoSlider';
import HomeHeader from '@/src/screens/Home/HomeHeader';
import HomeButtons from '@/src/screens/Home/HomeHeader';
import HomeHighlights from '@/src/screens/Home/HomeHighlights';

const sliderImages = [
    require('@/assets/images/slider/slider1.jpg'),
    require('@/assets/images/slider/slider2.jpg'),
    require('@/assets/images/slider/slider3.jpg'),
    require('@/assets/images/slider/slider4.jpg'),
];

export default function HomeScreen() {
    return (
        <ScreenWrapper style={{ flex: 1, backgroundColor: Theme.COLORS.background }}>
            <HomeHeader />
            <PhotoSlider images={sliderImages} />
            <HomeButtons />
            <HomeHighlights />
        </ScreenWrapper>
    );
}




// import React from 'react';
// import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
// import ScreenWrapper from '@/src/components/ScreenWrapper';
// import { Theme } from '@/src/theme/theme';
// import InfoCardsBlock from '@/src/screens/Home/HomeInfoCardBlocks';
// import PhotoSlider from '@/src/components/PhotoSlider';
// import { useNavigation } from "@react-navigation/native";
// import {AppStackParams} from "@/src/types/types";
// import { NativeStackNavigationProp } from "@react-navigation/native-stack";
//
// const sliderImages = [
//     require('../../assets/images/slider/slider1.jpg'),
//     require('../../assets/images/slider/slider2.jpg'),
//     require('../../assets/images/slider/slider3.jpg'),
//     require('../../assets/images/slider/slider4.jpg'),
// ];
//
// const currentUser = {
//     id: 1,
//     type: "owner",
//     sitterProfile: null,
// };
//
// export default function HomeScreen() {
//     const navigation = useNavigation<NativeStackNavigationProp<AppStackParams>>();
//
//     const handleBecomeSitter = () => {
//         if (!currentUser) {
//             navigation.navigate("Login");
//         } else if (!currentUser.sitterProfile) {
//             navigation.navigate("SitterOnboarding");
//         } else {
//             navigation.navigate("MainTabs", { screen: "Profile" });
//         }
//     };
//
//     const handleFindSitter = () => {
//         navigation.navigate("MainTabs", { screen: "Search" });
//     }
//
//     return (
//         <ScreenWrapper style={ styles.container }>
//             {/* Header */}
//             <View style={styles.header}>
//                 <Image source={require('../../assets/images/applogo.png')} style={styles.logo} resizeMode="contain" />
//                 <Text style={styles.appTitle}>Petsitting</Text>
//                 <Text style={styles.welcomeText}>Find Perfect Care for Your Pets</Text>
//                 <Text style={styles.tagline}>Connect with trusted, local pet sitters who will love and care for your pets like their own</Text>
//             </View>
//
//             {/* Image Slider */}
//             <PhotoSlider images={sliderImages} />
//
//             {/* Buttons */}
//             <View style={styles.buttonsContainer}>
//                 <TouchableOpacity style={styles.searchButton} onPress={handleFindSitter}>
//                     <Text style={styles.searchButtonText}>Find Sitter</Text>
//                 </TouchableOpacity>
//
//                 <TouchableOpacity style={styles.becomeButton} onPress={handleBecomeSitter}>
//                     <Text style={styles.becomeButtonText}>Become a Sitter</Text>
//                 </TouchableOpacity>
//             </View>
//
//             {/* Subtitle */}
//             <Text style={styles.subtitle}>Why choose Petsitting?</Text>
//
//             {/* Info Cards */}
//             <View style={styles.cardsContainer}>
//                 <InfoCardsBlock />
//             </View>
//
//         </ScreenWrapper>
//     );
// }
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: Theme.COLORS.background
//     },
//     header: {
//         alignItems: 'center',
//         marginBottom: Theme.SPACING.section,
//     },
//     logo: {
//         width: 80,
//         height: 80,
//         marginBottom: 10,
//     },
//     appTitle: {
//         fontSize: Theme.FONTS.sizes.title,
//         fontWeight: Theme.FONTS.weights.bold,
//         color: Theme.COLORS.primary,
//         marginBottom: 8,
//     },
//     welcomeText: {
//         fontSize: Theme.FONTS.sizes.subtitle,
//         fontWeight: Theme.FONTS.weights.semiBold,
//         color: Theme.COLORS.text,
//         marginBottom: 4,
//     },
//     tagline: {
//         fontSize: Theme.FONTS.sizes.body,
//         color: Theme.COLORS.textSecondary,
//         marginBottom: Theme.SPACING.section,
//         textAlign: 'center',
//     },
//     buttonsContainer: {
//         justifyContent: 'center',
//         width: '100%',
//         marginVertical: 60,
//     },
//     searchButton: {
//         backgroundColor: Theme.COLORS.secondary,
//         paddingVertical: 14,
//         paddingHorizontal: 30,
//         borderRadius: 10,
//         marginBottom: Theme.SPACING.section,
//         alignSelf: 'stretch',
//         ...Theme.SHADOWS.default
//     },
//     searchButtonText: {
//         color: Theme.COLORS.background,
//         fontSize: Theme.FONTS.sizes.body,
//         fontWeight: Theme.FONTS.weights.bold,
//         textAlign: 'center',
//     },
//     becomeButton: {
//         backgroundColor: Theme.COLORS.background,
//         borderWidth: 1,
//         borderColor: Theme.COLORS.primary,
//         paddingVertical: 14,
//         paddingHorizontal: 30,
//         borderRadius: 10,
//         marginBottom: Theme.SPACING.section,
//         alignSelf: 'stretch',
//         ...Theme.SHADOWS.default
//     },
//     becomeButtonText: {
//         color: Theme.COLORS.primary,
//         fontSize: Theme.FONTS.sizes.body,
//         fontWeight: Theme.FONTS.weights.bold,
//         textAlign: 'center',
//     },
//     subtitle: {
//         fontSize: Theme.FONTS.sizes.subtitle,
//         fontWeight: Theme.FONTS.weights.semiBold,
//         marginBottom: Theme.SPACING.section,
//         color: Theme.COLORS.text,
//         alignSelf: 'flex-start',
//     },
//     cardsContainer: {
//         width: '100%',
//     },
// });
