import type { Config } from 'jest';

const config: Config = {
    preset: 'react-native',
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    // transformIgnorePatterns: [
    //     'node_modules/(?!(@react-native|react-native|@react-navigation|react-native-maps|expo-|@expo|expo-secure-store|@react-native-community)/)',
    // ],
    transformIgnorePatterns: [
        "node_modules/(?!(react-native|@react-native|react-navigation|@react-navigation|react-native-maps|expo|@expo|react-native-reanimated|react-native-reanimated-carousel|react-native-worklets)/)"
    ],

    // testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
    },

    reporters: [
        'default',
        [
            'jest-html-reporter',
            {
                pageTitle: 'Petsitting App Test Report',
                outputPath: 'test-report.html',
                includeFailureMsg: true,
                includeConsoleLog: true
            }
        ]
    ],
};

export default config;
