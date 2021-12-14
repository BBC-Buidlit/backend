<!-- @format -->

## CONTRACT DEPLOYMENT

Configure compilation and migration

##### truffle-config.js

### Fetch dependencies

Configure dependencies from package.json

`npm i`

### locally run

Instantiate a local chain using ganache (previously testrpc)
use `ganache-cli` or Download Ganache app image

### Compile and Deploy contracts

TIP: Enable optimiser

`truffle migrate --network (networkName)`

networks : develop,mainnet,ropsten...

### TEST

Run tests

`truffle test`
