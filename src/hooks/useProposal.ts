import { BigNumber } from "ethers"
import { useContract } from "./useContract"
import { useWeb3Result } from "./useWeb3Result"

export enum ProposalState {
    Pending,
    Active,
    Canceled,
    Rejected,
    Executable,
    Executed,
    Expired
}

export type Proposal = {
    id: BigNumber
    proposer: string
    startBlock: BigNumber
    endBlock: BigNumber
    expirationBlock: BigNumber
    forVotes: BigNumber
    againstVotes: BigNumber
    canceled: boolean
    executed: boolean
    state: ProposalState
    description: string
}

export const useProposalCount = () => {
    const contract = useContract()
    return useWeb3Result<BigNumber>(async ({ account, library }) => (await contract.proposalCount()) as BigNumber)
}

export const useProposal = (id: number) => {
    const contract = useContract()
    return useWeb3Result<Proposal>(async ({ account, library }) => {
        const proposal = await contract.proposals(id)
        const state = await contract.proposalState(id)
        
        const event = (await library.getLogs({
            address: contract.address,
            topics: ["0xbaab6dcd2ae57433cc1372e25bc5139c3bd664075695546fde8821591a226e38"],
            fromBlock: 0,
            toBlock: "latest"
        }))
            .map((log: any) => contract.interface.decodeEventLog("ProposalCreated", log.data))
            .filter((event: any, id: number) => (event.proposer === proposal.proposer) && (id === proposal.id.toNumber() - 1))
            .map((event: any) => event)[0]

        return {
            id: proposal.id,
            proposer: proposal.proposer,
            startBlock: proposal.startBlock,
            endBlock: proposal.endBlock,
            expirationBlock: proposal.expirationBlock,
            forVotes: proposal.forVotes,
            againstVotes: proposal.againstVotes,
            canceled: proposal.canceled,
            executed: proposal.executed,
            state: state,
            description: event.description
        }
    })
}