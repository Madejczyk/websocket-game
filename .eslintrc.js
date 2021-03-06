module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['jest', '@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:jest/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
  ],
  rules: {
    'jest/expect-expect': 0,
    'jest/no-test-callback': 0,
  },
}
