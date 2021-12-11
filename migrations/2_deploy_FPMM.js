const FixedProductMarketMaker = artifacts.require("FixedProductMarketMaker");

module.exports = function (deployer) {
  deployer.deploy(FixedProductMarketMaker);
};
