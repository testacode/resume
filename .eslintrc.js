module.exports = {
  extends: ['react-app'],
  parser: 'babel-eslint',
  rules: {
    'operator-linebreak': ['error', 'before']
  },
  globals: {
    window: true,
    document: true,
    localStorage: true
  }
};
