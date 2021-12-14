const FixedProductMarketMaker = artifacts.require("OldFixedProductMarketMaker");


const FixedProductMarketMakerFactory = artifacts.require(
  "FixedProductMarketMakerFactory"
);
const FPMMDeterministicFactoryV2 = artifacts.require(
  "FPMMDeterministicFactoryV2"
);

module.exports = function (deployer) {
  deployer.deploy(FixedProductMarketMakerFactory);
  deployer.deploy(FixedProductMarketMaker);

  deployer.deploy(FPMMDeterministicFactoryV2);
};
