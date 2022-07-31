module.exports = {
  extends: ['react-app'],
  rules: {
    'operator-linebreak': ['error', 'before']
  },
  globals: {
    window: true,
    document: true,
    localStorage: true
  }
};
