import { HardhatUserConfig } from "hardhat/config";
// import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";
import "hardhat-celo";
// import 'solidity-coverage';
import dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    mumbai: {
      url: process.env.MUMBAI_URL,
      accounts: [process.env.PRIVATE_KEY || ""],
    },

    alfajores: {
      url: "https://alfajores-forno.celo-testnet.org",
      accounts: [process.env.PRIVATE_KEY || ""]
    }
  },

  etherscan: {
    apiKey: {
      polygonMumbai: process.env.POLYGONSCAN_API_KEY || "",
      alfajores: process.env.CELO_API_KEY as string,
    },
  },

  
};

export default config;






