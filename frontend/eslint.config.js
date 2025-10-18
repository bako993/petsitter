// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
    expoConfig,
    {
        ignores: ['dist/*'],
        parser: '@typescript-eslint/parser',
        plugins: ['@typescript-eslint', 'react', 'react-hooks', 'react-native'],
        extends: [
            'eslint:recommended',
            'plugin:@typescript-eslint/recommended',
            'plugin:react/recommended',
            'plugin:react-hooks/recommended',
            'plugin:react-native/all',
            'prettier',
            'prettier/@typescript-eslint'
        ],
        rules: {
            'react/react-in-jsx-scope': 'off', // RN 0.69+
            '@typescript-eslint/no-unused-vars': ['warn'],
            'react-native/no-inline-styles': 'warn',
            'react-native/split-platform-components': 'warn',
        },
        settings: { react: { version: 'detect' } },
    },
]);
