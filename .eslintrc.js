module.exports = {
  plugins: [
    "ava"
  ],
  extends: [
    "@octetstream",
    "plugin:ava/recommended"
  ],
  rules: {
    "operator-linebreak": ["error", "after", {
      overrides: {
        "+": "ignore",
        "?": "before",
        ":": "before"
      }
    }]
  }
}
