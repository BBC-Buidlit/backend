const CollateralTokens = artifacts.require("CollateralTokens");

module.exports = function (deployer) {
  deployer.deploy(CollateralTokens);
};
