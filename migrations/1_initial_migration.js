const ConditionalTokens = artifacts.require("ConditionalTokens");

module.exports = function (deployer) {
  deployer.deploy(ConditionalTokens);
};
