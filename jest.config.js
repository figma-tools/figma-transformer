module.exports = {
    moduleNameMapper: {
        src: "<rootDir>/src/index",
        "src/(.*)": "<rootDir>/src/$1",
    },
    modulePathIgnorePatterns: ["<rootDir>/dist/"],
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100,
        },
    },
};
