export type AppStackParams = {
    WelcomeScreen: undefined;
    MainTabs: {screen: keyof BottomTabParams};
    SitterScreen: { sitterId: number };
    SitterOnboardingScreen: undefined;
    SitterProfileScreen: undefined;
    OwnerProfileScreen: undefined;
    LoginScreen: undefined;
    SignupScreen: undefined;
    OfferingScreen: undefined;
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

export type User = {
    id: number;
    name: string;
    email: string;
    role?: string;
    type?: string;
    profile?: {
        id: number;
        profile_photo?: string;
        bio?: string;
        experience?: string;
        availability?: string;
        phone?: string;
    };
    created_at?: string;
    updated_at?: string;
};

export type Offering = {
    id: number;
    profile_id: number;
    offering_type: string;
    price: number;
    conditions: string[];
    duration?: number;
    created_at?: string;
    updated_at?: string;
};
