const ConditionalTokens = artifacts.require("ConditionalTokens");
const CTHelpers = artifacts.require("CTHelpers");
const CollateralToken = artifacts.require("CollateralToken");
const FixedProductMarketMakerFactory = artifacts.require("FixedProductMarketMakerFactory");
const ConstructedCloneFactory = artifacts.require("ConstructedCloneFactory");

const name = "Ftoken";
const symbol = "Ft";

module.exports = function (deployer) {
  deployer.deploy(ConditionalTokens);
  deployer.deploy(CTHelpers);
  deployer.deploy(FixedProductMarketMakerFactory);
  deployer.deploy(ConstructedCloneFactory);
  deployer.deploy(CollateralToken, name, symbol);
};
