require("chai/register-should");
require("mocha-steps");
const HDWalletProvider = require("truffle-hdwallet-provider");
require("dotenv").config();

const config = {
  networks: {
    mainnet: {
      host: "localhost",
      port: 8545,
      network_id: "1",
    },
    ropsten: {
      host: "localhost",
      port: 8545,
      network_id: "3",
    },
    kovan: {
      host: "localhost",
      port: 8545,
      network_id: "42",
    },
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(
          process.env.mnemonic,
          `https://rinkeby.infura.io/v3/${process.env.infuraId}`
        );
      },
      network_id: "4",
    },
    sokol: {
      provider: function () {
        return new HDWalletProvider(
          process.env.mnemonic,
          `https://sokol.poa.network`
        );
      },
      network_id: "77",
    },
    goerli: {
      host: "localhost",
      port: 8545,
      network_id: "5",
    },
    develop: {
      host: "localhost",
      port: 8545,
      network_id: "*",
    }
  },
  mocha: {
    enableTimeouts: false,
    grep: process.env.TEST_GREP,
    reporter: "eth-gas-reporter",
    reporterOptions: {
      currency: "USD",
      excludeContracts: ["Migrations"],
    },
  },
  compilers: {
    solc: {
      version: "0.5.10",
      settings: {
        optimizer: {
          enabled: true,
          runs: 50
        },
      },
    },
  },
};

const _ = require("lodash");

try {
  _.merge(config, require("./truffle-local"));
} catch (e) {
  if (e.code === "MODULE_NOT_FOUND") {
    // eslint-disable-next-line no-console
    console.log("No local truffle config found. Using all defaults...");
  } else {
    // eslint-disable-next-line no-console
    console.warn("Tried processing local config but got error:", e);
  }
}

module.exports = config;
