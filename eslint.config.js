import tseslint from 'typescript-eslint';
export default tseslint.config(
  ...tseslint.configs.recommended,
  { files: ['src/beautiful/**/*.{ts,tsx}'], linterOptions: { noInlineConfig: true }, rules: { '@typescript-eslint/no-unused-expressions': 'off' } },
);
