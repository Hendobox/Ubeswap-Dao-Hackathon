import { BigNumber } from "ethers";

export interface DAOIPFSModel {
  beneficiaryName: string;
  projectName: string;
  title: string;
  email: string;
  beneficiaryWalletAddress: string;
}

export interface MileStoneModel {
  amount: BigNumber;
  timestamp: number;
  closed?: boolean;
  approved?: boolean;
}
