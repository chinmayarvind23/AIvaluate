module.exports = {
    setupFiles: ['<rootDir>/jest.setup.js'],
    transform: {
      '^.+\\.[t|j]sx?$': 'babel-jest',
    },
    transformIgnorePatterns: [
      '/node_modules/',
    ],
  };