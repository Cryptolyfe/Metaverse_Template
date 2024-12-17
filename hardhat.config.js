require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    compilers: [
      { version: "0.8.20" },  // Existing version
      { version: "0.8.28" }   // Add this to match Lock.sol
    ]
  }
};
