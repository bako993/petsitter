export type AppStackParams = {
    MainTabs: {screen: keyof BottomTabParams};
    SitterProfile: { sitterId: number };
    SitterOnboarding: undefined;
    Login: undefined;
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