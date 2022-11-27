import { BigNumber, ethers } from "ethers";
import { parseEther } from "ethers/lib/utils";

export interface Milestone {
  closed: boolean;
  approved: boolean;
  timestamp: number;
  amount: BigNumber;
}

export interface Project {
  hasStarted: boolean;
  isRevoked: boolean;
  milestones: Milestone[];
  totalAmount: BigNumber;
  totalPayout: number;
  totalMissout: number;
  name: string;
}

export const Milestones: Milestone[] = [
  {
    closed: false,
    approved: false,
    timestamp: new Date().getTime() + 86400,
    amount: ethers.BigNumber.from(parseEther("10")).div(4),
  },
  {
    closed: false,
    approved: false,
    timestamp: new Date().getTime() + 2 * 86400,
    amount: ethers.BigNumber.from(parseEther("12")).div(4),
  },
  {
    closed: false,
    approved: false,
    timestamp: new Date().getTime() + 3 * 86400,
    amount: ethers.BigNumber.from(parseEther("12")).div(4),
  },
  {
    closed: false,
    approved: false,
    timestamp: new Date().getTime() + 2 * 86400,
    amount: ethers.BigNumber.from(parseEther("10")).div(4),
  },
];

export const Projects: Project[] = [
  {
    name: "DAO 142 Fund",
    hasStarted: false,
    isRevoked: false,
    milestones: [...Milestones],
    totalAmount: [...Milestones].reduce(
      (acc, { amount }) => amount.add(acc),
      BigNumber.from(0)
    ),
    totalMissout: 0,
    totalPayout: 0,
  },
  {
    name: "DAO 150 Fund",
    hasStarted: false,
    isRevoked: false,
    milestones: [...Milestones.splice(0, 2)],
    totalAmount: [...Milestones.splice(0, 2)].reduce(
      (acc, { amount }) => amount.add(acc),
      BigNumber.from(0)
    ),
    totalMissout: 0,
    totalPayout: 0,
  },
];
