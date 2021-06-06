module.exports = {
  extensions: ["ts"],
  require: ["dotenv/config", "ts-node/register"],
  files: ["lib/**/*.test.ts"],
}
