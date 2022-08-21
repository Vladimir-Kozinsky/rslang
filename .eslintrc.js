module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
    ],

    parserOptions: {
        tsconfigRootDir: __dirname,
        project: './tsconfig.json',
    },

    extends: [
        'airbnb-base',
        'airbnb-typescript/base',
        'prettier'
    ],

    rules: {
        'no-console': 'warn',
        '@typescript-eslint/no-explicit-any': 'error',
      },
};