const Migrations = artifacts.require("Land");

module.exports = function (deployer) {

    const NAME = "KRBYLAND UNIVERSITY"
    const SYMBOL = "KUNI"
    const COST = web3.utils.toWei('1','ether')

  await deployer.deploy(Land, NAME, SYMBOL, COST);
};