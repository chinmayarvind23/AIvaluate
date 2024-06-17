module.exports = {
    testEnvironment: "jest-environment-jsdom",
    testEnvironmentOptions: {
      resources: "usable"
    },
    setupFilesAfterEnv: [
      "<rootDir>/src/setupTests.js"
    ],
    transform: {
      "^.+\\.(js|jsx)$": "babel-jest"
    },
    moduleNameMapper: {
      "\\.(css|less)$": "identity-obj-proxy"
    }
  };
