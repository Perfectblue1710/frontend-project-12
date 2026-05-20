import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import stylistic from '@stylistic/eslint-plugin';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    plugins: {
      react,
      '@stylistic': stylistic,
    },

    settings: {
      react: {
        version: 'detect',
      },
    },

    rules: {
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      
      '@stylistic/brace-style': 'off',
      '@stylistic/arrow-parens': 'off',
      '@stylistic/comma-dangle': 'off',
      '@stylistic/jsx-one-expression-per-line': 'off',
      '@stylistic/jsx-wrap-multilines': 'off',
      '@stylistic/operator-linebreak': 'off',
      '@stylistic/no-multiple-empty-lines': 'off',
    },
  },
]
