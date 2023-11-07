process.env.NODE_ENV = 'development';
require('dotenv').config({path:'./config/dev.env'});

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    setupFilesAfterEnv: ['./src/test/movie.test.ts'],
    setupFiles: ['./types/express/index.d.ts'],
    globals: {
        'ts-jest': {
            diagnostics: false,
        }
    }
};
