module.exports = {
    "root": true,
    "extends": [
        "next/core-web-vitals",
        "prettier"
    ],
    "plugins": [
        "@typescript-eslint",
        "react",
        "react-hooks",
        "prettier"
    ],
    "rules": {
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
        "react/react-in-jsx-scope": "off",
        "prettier/prettier": "error"
    },
    "ignorePatterns": ["node_modules/", ".next/", "dist/"]
} 