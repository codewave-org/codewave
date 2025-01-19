module.exports = {
    "extends": [
        "next",
        "prettier"
    ],
    "rules": {
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
        "react/react-in-jsx-scope": "off"
    }
} 