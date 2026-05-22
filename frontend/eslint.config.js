import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
  'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
  '@stylistic/brace-style': 'off',
  '@stylistic/comma-dangle': 'off',
  '@stylistic/eol-last': 'off',
  '@stylistic/jsx-wrap-multilines': 'off',
  '@stylistic/jsx-closing-tag-location': 'off',
  '@stylistic/operator-linebreak': 'off',
  '@stylistic/jsx-one-expression-per-line': 'off',
  '@stylistic/arrow-parens': 'off',
    },
  },
])
