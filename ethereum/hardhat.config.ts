import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";
import dotEnv from "dotenv";

dotEnv.config();

const GOERLI_URL = process.env.ALCHEMY_GOERLI_KEY || "http://localhost:8545";
const ACCOUNT_PRIVATE_KEY = process.env.ACCOUNT_PRIVATE_KEY || "";

console.log({
  GOERLI_URL,
  ACCOUNT_PRIVATE_KEY,
  apI: process.env.ETHERSCAN_API_KEY,
});

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  networks: {
    development: {
      url: "http://localhost:8545",
      chainId: 31337,
      accounts: [
        "0xde9be858da4a475276426320d5e9262ecfc3ba460bfac56360bfa6c4c28b4ee0",
        "0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e",
      ],
    },
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${GOERLI_URL}`,
      chainId: 5,
      accounts: [ACCOUNT_PRIVATE_KEY],
    },
  },
};

export default config;
