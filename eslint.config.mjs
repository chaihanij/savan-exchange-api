// eslint.config.mjs
import tseslint from 'typescript-eslint';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  ...tseslint.config(
    {
      parserOptions: {
        project: ['./tsconfig.json'],
        sourceType: 'module',
      },
    },
    {
      files: ['**/*.ts'],
      rules: {
        '@typescript-eslint/no-unused-vars': [
          'warn',
          { argsIgnorePattern: '^_' },
        ],
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'warn',
      },
    },
  ),
  {
    files: ['**/*.ts'],
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      ...eslintConfigPrettier.rules,
      'prettier/prettier': ['warn'],
    },
  },
];
