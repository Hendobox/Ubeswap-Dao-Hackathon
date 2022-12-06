import { ethers } from "hardhat";
import dotenv  from "dotenv";
dotenv.config();

async function main() {

  const DAOMilestones = await ethers.getContractFactory("DAOMilestones");
  const dAOMilestones = await DAOMilestones.deploy(process.env.PUBLIC_KEY);

  await dAOMilestones.deployed();

  console.log(`DAOMilestones deployed to ${dAOMilestones.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
