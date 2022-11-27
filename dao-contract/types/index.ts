import { BigNumber } from 'ethers';

export interface MileStone {
  closed: boolean;
  approved: boolean;
  timestamp: number;
  amount: BigNumber;
}

export interface Project {
  hasStarted: boolean;
  isRevoked: boolean;
  milestones: MileStone[];
  totalAmount: BigNumber;
  totalPayout: number;
  totalMissout: number;
}
