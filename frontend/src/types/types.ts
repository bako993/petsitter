export type AppStackParams = {
    WelcomeScreen: undefined;
    MainTabs: {screen: keyof BottomTabParams};
    SitterScreen: { sitterId: number };
    SitterOnboardingScreen: undefined;
    SitterProfileScreen: undefined;
    OwnerProfileScreen: undefined;
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