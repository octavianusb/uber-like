// https://docs.expo.dev/guides/using-eslint/

module.exports = {
    extends: ["expo", "prettier"],
    plugins: ["prettier"],
    rules: {
        "prettier/prettier": [
            "error",
            {
                tabWidth: 4,
                singleQuote: false,
            },
        ],
    },
    ignorePatterns: ["/dist/*"],
};
