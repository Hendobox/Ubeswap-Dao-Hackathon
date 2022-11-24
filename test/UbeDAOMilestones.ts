import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Lock", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {
    const amount = ethers.utils.parseEther("10");

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const DAOMilestones = await ethers.getContractFactory("DAOMilestones");
    const contract = await DAOMilestones.deploy("UBE NFT", "UBENFT", owner.address);

    return { contract, amount, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set project correctly", async function () {
      const { contract, amount, owner, otherAccount } = await loadFixture(deployFixture);

      let milestones = [
        {
          closed: false,
          approved: false,
          timestamp: new Date().getTime() + 86400,
          amount: ethers.BigNumber.from(amount).div(4) 
        },
        {
          closed: false,
          approved: false,
          timestamp: new Date().getTime() + (2 * 86400),
          amount: ethers.BigNumber.from(amount).div(4) 
        },
        {
          closed: false,
          approved: false,
          timestamp: new Date().getTime() + (3 * 86400),
          amount: ethers.BigNumber.from(amount).div(4) 
        },
        {
          closed: false,
          approved: false,
          timestamp: new Date().getTime() + (2 * 86400),
          amount: ethers.BigNumber.from(amount).div(4) 
        }
    ]
      await expect(
        contract.connect(otherAccount).setProject(otherAccount.address, milestones, "www.hi.com")
        ).to.rejectedWith("Ownable: caller is not the owner"
      );

      await expect(
        contract.setProject(otherAccount.address, milestones, "www.hi.com")
        ).to.rejectedWith("INVALID_TIMESTAMP_PASSED"
      );

      milestones[3].timestamp = new Date().getTime() + (4 * 86400);
      
      await contract.setProject(otherAccount.address, milestones, "www.hi.com")
      const val = await contract.getProject(1);

      expect((await contract.totalSupply()).toString()).to.equal("1");
      expect(await contract.ownerOf(1)).to.equal(otherAccount.address);
      expect(val[3].toString()).to.equal(amount.toString());
      expect((await contract.tokenURI(1)).toString()).to.equal("www.hi.com");

      await contract.deposit(1, { value: val[3]})

      const bal: number = await ethers.provider.getBalance(contract.address);
      expect(bal.toString()).to.equal(amount.toString());

      await expect(contract.deposit(1, {value: val[3]})).to.revertedWith("PROJECT_ALREADY_SET")



    })
  })
});
