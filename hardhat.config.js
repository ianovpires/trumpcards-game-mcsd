require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
};
require("@nomiclabs/hardhat-waffle");

const INFURA_API_KEY = "your_infura_api_key";
const PRIVATE_KEY = "your_private_key";

module.exports = {
  networks: {
    polygon: {
      url: `https://polygon-mainnet.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [PRIVATE_KEY],
    },
  },
  solidity: "0.8.0",
};
