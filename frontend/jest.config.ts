import type { Config } from 'jest';

const config: Config = {
    preset: 'react-native',
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    transformIgnorePatterns: [
        'node_modules/(?!(@react-native|react-native|@react-navigation|react-native-maps|expo-|@expo|expo-secure-store|@react-native-community)/)',
    ],

    testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
    },
};

export default config;
