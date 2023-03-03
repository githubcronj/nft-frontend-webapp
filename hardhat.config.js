require("@nomicfoundation/hardhat-toolbox");
// /9f05826d301db05a81be89e411ca25ee493ff448885225ff4ddec489e8c32101
/** @type import('hardhat/config').HardhatUserConfig */
// module.exports = {
//   solidity: "0.8.17",
// };
const ALCHEMY_API_KEY = "5nUo5YmuBU8FQYxNiXKqWWlxxXmUXHex";

// Replace this private key with your Goerli account private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Beware: NEVER put real Ether into testing accounts
const GOERLI_PRIVATE_KEY = "9f05826d301db05a81be89e411ca25ee493ff448885225ff4ddec489e8c32101";

module.exports = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [GOERLI_PRIVATE_KEY]
    }
  }
};
