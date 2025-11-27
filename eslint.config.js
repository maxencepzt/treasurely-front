import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { globalIgnores } from 'eslint/config';
import eslintJs from '@eslint/js';
import eslintReact from '@eslint-react/eslint-plugin';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default tseslint.config([
    globalIgnores(['dist']),
    {
        files: ['**/*.{ts,tsx}'],
        extends: [
            js.configs.recommended,
            tseslint.configs.recommended,
            reactHooks.configs['recommended-latest'],
            reactRefresh.configs.vite,
            eslintJs.configs.recommended,
            tseslint.configs.recommended,
            eslintReact.configs['recommended-typescript'],
        ],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parser: tseslint.parser,
            parserOptions: {
                project: ['./tsconfig.app.json', './tsconfig.node.json'],
                tsconfigRootDir: import.meta.dirname,
            },
        },
        plugins: {
            'simple-import-sort': simpleImportSort,
        },
        rules: {
            '@eslint-react/no-missing-key': 'warn',

            'simple-import-sort/imports': [
                'warn',
                {
                    groups: [['^react', '^@?\\w'], ['^@?\\w'], ['^\\.']],
                },
            ],
            'simple-import-sort/exports': 'warn',
        },
    },
]);
