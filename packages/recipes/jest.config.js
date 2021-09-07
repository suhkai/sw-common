export default {
    automock: false,
    collectCoverage: true,
    maxWorkers: "50%",
    collectCoverageFrom:[
        'src/lib/components/App.svelte',
        'src/lib/dao/LocalStorageDriver.ts',
        'src/lib/recipe2Plain.ts',
        'src/lib/Recipe.ts',
        'src/lib/Ingredient.ts'
    ],
    coveragePathIgnorePatterns: [
        'node_modules',
        '.svelte-kit',
        'build',
        'test',
        'static',
        '.vscode'
    ],
    coverageProvider: 'babel',
    //coverageProvider: 'babel', //"v8" is still experimental, but use "v8" for walk through debugging
    coverageDirectory: 'coverage',
    coverageReporters: ['json', 'lcov', 'text', 'clover'],
   // preset: 'ts-jest',
    testEnvironment: 'node',
    verbose: true,
    cacheDirectory: '.jest-cache',
    setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
    //testPathIgnorePatterns: ['/static/'],
    testRegex: [
        '/components/__test__/App.test.ts$',
        '/dao/__test__/LocalStorageDriver.test.ts$'
    ],
    transform: {
        '^.+\\.svelte$': [
            'svelte-jester',
            {
                preprocess: true
            }
        ],
        '^.+\\.ts$': 'ts-jest'
    },
    moduleFileExtensions: [
        'js',
        'ts',
        'svelte'
    ],
    moduleNameMapper: {
        '^\\$lib/(.*)$': '<rootDir>/src/lib/$1',
    }
};
