# Ubeswap-Dao-Hackathon

This D'app will fulfill milestone payments for grants funded by the Ubeswap DAO. It is properly optimised to save gas upon execution. It is recommended that you use a tool like [Openzeppelin Defender](https://defender.openzeppelin.com/) to make multisig calls to this contract as multisig functionalities weren't added to the contract with the assumption that a multisig wallet already exists for the project.

When the DAO desides to fund a grant/project, the DAO admin will need to carry out the following functionalities:

- Create the IPFS hash for the grant through the provided UI, carrying the name of the grant and the name of the beneficiary.

- When the IPFS hash is generated, the admin needs to create new project in the smart contract, which accepts the **wallet address** of the beneficiary, array of **milestones** which contain the different **timestamps** and **amounts**, and the created **IPFS hash** as given below:

```
function setProject(
    address payable beneficiary,
    Milestone[] memory milestones,
    string memory uri)

struct Milestone {
    bool closed;
    bool approved;
    uint256 timestamp;
    uint256 amount;
}
```

| Syntax      | type        | description                                                                 |
| ----------- | ----------- | --------------------------------------------------------------------------- |
| beneficiary | address     | wallet address to receive milestone funds                                   |
| milestones  | Milestone[] | array of Milestone structs with **closed** and **approved** values as false |
| uri         | string      | token URI from IPFS                                                         |

When the admin makes the above call, the smart contract generates and sends an NFT (UBE-NFT) to the beneficiary wallet. The holder of this NFT will always be the beneficiary of this particular grant/project. This minted NFT will have a token URI pointing to an IPFS metadata.

**NOTE** timestamps must not be lower than previous milestone of the same grant/project.

- After this is done, the public method **count()** will be incremented. And the current value will point to the newly created grant/project.

- The DAO admin will need to call the **deposit(uint256 id)** method at this point, sending the total amount to the smart contract in **CELO**.

- The DAO admin will need to approve a particular milestone when it reached. The admin can also disapprove a milestone before/after the period is reached. When approved, the holder of the associated NFT received the payout for that milestone. If disapproved, the funds for that milestone gets sent to the wallet passed by the caller (DAO admin). Find the method below:

```
function resolveMilestone(
    uint256 idP,
    uint256 idM,
    bool approve,
    address payable daoWallet)
```

| Syntax    | type    | description                                                          |
| --------- | ------- | -------------------------------------------------------------------- |
| idP       | uint256 | the ID of the grant/project to be resolved                           |
| idM       | uint256 | the index of the milestone array in the grant/project to be resolved |
| approve   | bool    | true or false if approved or not                                     |
| daoWallet | address | wallet address to receive milestone funds if disapproved             |

- In the event when the DAO admin needs to cancel an entire grant, the method below should be called to close the grant and recover all funds with associated with it.

```
function revokeProject(uint256 id, address payable daoWallet)
```

| Syntax    | type    | description                               |
| --------- | ------- | ----------------------------------------- |
| id        | uint256 | the ID of the grant/project to be revoked |
| daoWallet | address | wallet address to receive grant funds     |

- To see the full information of individual grants, you need to make the following call:

```
function getProject(uint256 id) external view returns (Project memory)

struct Project {
    bool hasStarted;
    bool isRevoked;
    Milestone[] milestones;
    uint256 totalAmount;
    uint256 totalPayout;
    uint256 totalMissout;
}
```

| Syntax       | type        | description                                                                                                                                                                                     |
| ------------ | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id           | uint256     | the ID of the grant/project to be checked                                                                                                                                                       |
| hasStarted   | bool        | true or false if grant has started. This value becomes true when the DAO admin deposits the total amount of CELO for that grant into the smart contract with the **deposit(uint256 id)** method |
| isRevoked    | bool        | true or false if grant/project is revoked or not                                                                                                                                                |
| milestones   | Milestone[] | array of Milestone structs associated with given project/grant                                                                                                                                  |
| totalAmount  | uint256     | total amount of CELO calculated by adding the **amount** on all the created milestones for that project/grant                                                                                   |
| totalPayout  | uint256     | total amount of CELO paid out to the beneficiary                                                                                                                                                |
| totalMissout | uint256     | total amount of CELO witheld from the beneficiary when a milestone is disapproved or when a grant is revoked                                                                                    |

## Installation

This project comes with a contract, a test for that contract, a and deployment script. You need to install the following:

- Solidity
- Hardhat

Next, you need to clone this repository and install the remaining dependencies by running the following in the project directory.

```
npm install
```

Then try running the following tasks:

```
npx hardhat compile
npx hardhat test
npx hardhat run scripts/deploy.ts
```

We have provided a frontend to enable you pin files to IPFS and recover the hash for the NFT token URI. This frontend also helps you easily arrange the **milestones** parameter for the smart contract call.

**NOTE** the frontend does not let you make metamask transactions. This is because we expect you to use an admin management tool like [Openzeppelin Defender](https://defender.openzeppelin.com/). The frontend will however, provide you with the necessary parameters to use in the smart contract's grant creation call.

Here is a [sample contract](https://mumbai.polygonscan.com/address/0x3Cd3D3E524d366Ffe6e5e7740F5A7162E970BBb6#code) deployed on Mumbai testnet.
