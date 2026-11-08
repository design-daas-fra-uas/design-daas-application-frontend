import js from '@eslint/js';
import eslintReact from '@eslint-react/eslint-plugin';
import reactHooks from 'eslint-plugin-react-hooks';
import testingLibrary from 'eslint-plugin-testing-library';
import globals from 'globals';

export default [
  { ignores: ['build', 'coverage', 'node_modules'] },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    ...eslintReact.configs.recommended,
    languageOptions: {
      ...eslintReact.configs.recommended.languageOptions,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  reactHooks.configs.flat.recommended,
  {
    rules: {
      // Hook rules come from the official react-hooks plugin above.
      '@eslint-react/exhaustive-deps': 'off',
      '@eslint-react/purity': 'off',
      '@eslint-react/rules-of-hooks': 'off',
      '@eslint-react/set-state-in-effect': 'off',
      // Flags acronym casing such as `[vmID, setVMID]`.
      '@eslint-react/use-state': 'off',
      'no-console': 'warn',
      'no-unused-vars': ['warn', { ignoreRestSiblings: true }],
    },
  },
  { files: ['src/utils/logger.js'], rules: { 'no-console': 'off' } },
  { files: ['*.config.js'], languageOptions: { globals: globals.node } },
  {
    files: ['src/**/*.test.{js,jsx}', 'src/setupTests.js'],
    ...testingLibrary.configs['flat/react'],
    languageOptions: { globals: { ...globals.browser, ...globals.vitest } },
  },
];
