import { time, loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { BigNumber } from 'ethers';
import { MileStone } from '../types';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { DAOMilestones } from '../typechain-types';

describe('DAO Milestones ', function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {
    const amount_ = ethers.utils.parseEther('10');

    // Contracts are deployed using the first signer/account by default
    const [owner_, otherAccount_] = await ethers.getSigners();

    const DAOMilestones = await ethers.getContractFactory('DAOMilestones');
    const contract_ = await DAOMilestones.deploy(
      'UBE NFT',
      'UBENFT',
      owner_.address
    );
    const addr0_ = '0x0000000000000000000000000000000000000000';

    return { contract_, amount_, owner_, otherAccount_, addr0_ };
  }

  describe('Deployment', function () {
    let contract: DAOMilestones,
      amount: BigNumber,
      owner: SignerWithAddress,
      otherAccount: SignerWithAddress,
      addr0: string,
      milestones: MileStone[];

    before(async function () {
      const { contract_, amount_, owner_, otherAccount_, addr0_ } =
        await loadFixture(deployFixture);

      contract = contract_;
      amount = amount_;
      owner = owner_;
      otherAccount = otherAccount_;
      addr0 = addr0_;

      milestones = [
        {
          closed: false,
          approved: false,
          timestamp: new Date().getTime() + 86400,
          amount: ethers.BigNumber.from(amount).div(4)
        },
        {
          closed: false,
          approved: false,
          timestamp: new Date().getTime() + 2 * 86400,
          amount: ethers.BigNumber.from(amount).div(4)
        },
        {
          closed: false,
          approved: false,
          timestamp: new Date().getTime() + 3 * 86400,
          amount: ethers.BigNumber.from(amount).div(4)
        },
        {
          closed: false,
          approved: false,
          timestamp: new Date().getTime() + 2 * 86400,
          amount: ethers.BigNumber.from(amount).div(4)
        }
      ];
    });

    it('Should set project correctly', async function () {
      await expect(
        contract
          .connect(otherAccount)
          .setProject(otherAccount.address, milestones, 'www.hi.com')
      ).to.rejectedWith('Ownable: caller is not the owner');

      await expect(
        contract.setProject(otherAccount.address, milestones, 'www.hi.com')
      ).to.rejectedWith('INVALID_TIMESTAMP_PASSED');

      milestones[3].timestamp = new Date().getTime() + 4 * 86400;

      await contract.setProject(otherAccount.address, milestones, 'www.hi.com');

      const val = await contract.getProject(1);

      expect((await contract.totalSupply()).toString()).to.equal('1');
      expect(await contract.ownerOf(1)).to.equal(otherAccount.address);
      expect(val[3].toString()).to.equal(amount.toString());
      expect((await contract.tokenURI(1)).toString()).to.equal('www.hi.com');
    });

    it('Should properly deposit and start project', async function () {
      await expect(contract.revokeProject(1, addr0)).to.revertedWithCustomError(
        contract,
        'PROJECT_NOT_SET'
      );

      const val = await contract.getProject(1);

      await expect(contract.deposit(1, { value: 1000000 })).to.rejectedWith(
        'INVALID_AMOUNT_PASSED'
      );

      await expect(
        contract.resolveMilestone(1, 2, true, owner.address)
      ).to.rejectedWith('PROJECT_NOT_SET');

      await contract.deposit(1, { value: val[3] });

      const bal = await ethers.provider.getBalance(contract.address);

      expect(bal.toString()).to.equal(amount.toString());

      await expect(
        contract.deposit(1, { value: val[3] })
      ).to.revertedWithCustomError(contract, 'PROJECT_ALREADY_SET');
    });

    it('Should properly resolve milestones', async function () {
      await expect(
        contract.resolveMilestone(1, 0, true, owner.address)
      ).to.revertedWithCustomError(contract, 'MILESTONE_NOT_REACHED');

      await expect(
        contract.resolveMilestone(1, 0, false, addr0)
      ).to.revertedWith('NULL_ADDRESS');

      await contract.resolveMilestone(1, 0, false, owner.address);

      const bal: BigNumber = await ethers.provider.getBalance(contract.address);

      expect(bal.toString()).to.equal(
        ethers.BigNumber.from(amount)
          .sub(ethers.BigNumber.from(amount).div(4))
          .toString()
      );

      await expect(
        contract.resolveMilestone(1, 0, true, owner.address)
      ).to.revertedWithCustomError(contract, 'MILESTONE_ALREADY_CLOSE');

      // increment time
      time.increase(milestones[1].timestamp);

      const bal1 = await ethers.provider.getBalance(otherAccount.address);

      await contract.resolveMilestone(1, 1, true, owner.address);

      const bal2 = await ethers.provider.getBalance(otherAccount.address);

      expect(
        ethers.BigNumber.from(bal1).add(ethers.BigNumber.from(amount).div(4))
      ).to.equal(bal2);
    });

    it('Should properly revoke projects', async function () {
      await expect(contract.revokeProject(1, addr0)).to.revertedWith(
        'NULL_ADDRESS'
      );

      const bal1 = await ethers.provider.getBalance(owner.address);

      await contract.revokeProject(1, owner.address);

      const bal2 = await ethers.provider.getBalance(owner.address);

      expect(Number(bal2)).to.be.greaterThan(Number(bal1));

      await expect(contract.revokeProject(1, addr0)).to.revertedWithCustomError(
        contract,
        'MILESTONE_ALREADY_REVOKED'
      );

      const val = await contract.getProject(1);

      expect(val[4].toString()).to.equal(ethers.BigNumber.from(amount).div(4));
      expect(val[5].toString()).to.equal(
        ethers.BigNumber.from(amount).sub(ethers.BigNumber.from(amount).div(4))
      );
    });
  });
});
