const ConditionalTokens = artifacts.require("ConditionalTokens");
const CTHelpers = artifacts.require("CTHelpers");
const CollateralToken = artifacts.require("CollateralToken");

const name = "Ftoken";
const symbol = "Ft";

module.exports = function (deployer) {
  deployer.deploy(ConditionalTokens);
  deployer.deploy(CTHelpers);
  deployer.deploy(CollateralToken, name, symbol);
};
