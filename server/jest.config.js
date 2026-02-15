export default {
    testEnvironment: 'node',
    verbose: true,
    testMatch: ['**/tests/**/*.test.js'],
    setupFilesAfterEnv: ['./tests/setup.js'],
};
