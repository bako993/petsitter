export type AppStackParams = {
    MainTabs: {screen: keyof BottomTabParams};
    SitterScreen: { sitterId: number };
    SitterOnboardingScreen: undefined;
    LoginScreen: undefined;
    SignupScreen: undefined;
};

export type BottomTabParams = {
    Home: undefined;
    Search: undefined;
    Map: undefined;
    Profile: undefined;
};

export type BackButtonProps = {
    color?: string;
    size?: number;
};

export type PhotoSliderProps = {
    images: number[];
};