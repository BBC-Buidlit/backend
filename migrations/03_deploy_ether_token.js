const CollateralToken = artifacts.require("CollateralToken");

module.exports = function (deployer) {
  deployer.deploy(CollateralToken,"Respect","F");
};
