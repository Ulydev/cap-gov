import React, { FunctionComponent, useMemo } from "react"
import { AiOutlineLoading } from "react-icons/ai"
import { Proposal as ProposalType, ProposalState, useProposal } from "../../hooks/useProposal"
import { useWeb3Result } from "../../hooks/useWeb3Result"
import { convertBigNumber } from "../../util/convertBigNumber"
import { getOrEstimateBlockTimestamp } from "../../util/blockTimestamp"
import { formatAccount } from "../../util/formatAccount"
import { MaxUint256 } from "@ethersproject/constants"

import { IoIosCheckmarkCircleOutline, IoIosCloseCircleOutline } from "react-icons/io"
import { AiOutlineClockCircle } from "react-icons/ai"
import { IconType } from "react-icons"

import classnames from "classnames"
import { useStoreActions } from "../../state/hooks"
import { getTokenContract, useContract } from "../../hooks/useContract"
import { useWeb3React } from "@web3-react/core"

const VoteButton: FunctionComponent<{ proposal: ProposalType }> = ({ proposal }) => {

    const { account, library } = useWeb3React()

    const addPendingTransaction = useStoreActions(actions => actions.addPendingTransaction)
    const contract = useContract()
    const castVote = async (support: boolean) => {
        addPendingTransaction((await contract.castVote(proposal.id.toNumber(), support)).hash)
    }

    const needsAllowance = useWeb3Result(async ({ account, library }) => {
        const tokenContract = getTokenContract(await contract.governanceToken(), account, library)
        const allowance = await tokenContract.allowance(account!, contract.address)
        const tokenBalance = await tokenContract.balanceOf(account!)
        return allowance.lt(tokenBalance)
    })

    const allowSpend = async () => {
        const tokenContract = getTokenContract(await contract.governanceToken(), account!, library)
        addPendingTransaction((await tokenContract.approve(contract.address, MaxUint256)).hash)
    }

    return (
        <div
            className={classnames(
                "flex flex-row w-full text-2xl font-bold justify-between space-x-2"
            )}>
            <span className="border-b-2 border-gray-500 flex-1 text-left">Voting</span>
            { needsAllowance ? (
                <button onClick={allowSpend} className="text-gray-500 border-b-2 px-4 border-gray-500 hover:text-white hover:bg-gray-500 transition duration-500">Approve CAP</button>
            ) : <>
                <button onClick={() => castVote(true)} className="text-green-500 border-b-2 w-20 border-green-500 hover:text-white hover:bg-green-500 transition duration-500">Yes</button>
                <button onClick={() => castVote(false)} className="text-red-500 border-b-2 w-20 border-red-500 hover:text-white hover:bg-red-500 transition duration-500">No</button>
            </> }
        </div>
    )
}

const StatusButton: FunctionComponent<{ label: string, onClick: (() => any) | null, icon: IconType, color: string }> = ({ label, onClick, icon: Icon, color }) => {
    return (
        <button
            onClick={onClick || undefined}
            disabled={!onClick}
            className={classnames(
                "flex flex-row w-full border-b-2 text-2xl font-bold items-center justify-between",
                color || "text-gray-500 border-gray-500"
            )}>
            <span>{ label }</span><Icon />
        </button>
    )
}

const ProposalView: FunctionComponent<{ proposal: ProposalType }> = ({ proposal }) => {

    const hasVotes = useMemo(() => !proposal.forVotes.add(proposal.againstVotes).isZero(), [proposal])
    const percentageVoted = useMemo(() => {
        try {
            return Math.round(proposal.forVotes.mul(100).div(proposal.forVotes.add(proposal.againstVotes)).toNumber())
        } catch (e) {
            return 0
        }
    }, [proposal])

    const startTimestamp = useWeb3Result(async ({ account, library }) => await getOrEstimateBlockTimestamp(proposal.startBlock, library))
    const endTimestamp = useWeb3Result(async ({ account, library }) => await getOrEstimateBlockTimestamp(proposal.endBlock, library))
    const expirationTimestamp = useWeb3Result(async ({ account, library }) => await getOrEstimateBlockTimestamp(proposal.expirationBlock, library))

    const Status = proposal.state === ProposalState.Active ? (
        <VoteButton proposal={proposal} />
    ) : (() => {
        const [label, icon, color, onClick] = (() => {
            switch (proposal.state) {
                case ProposalState.Executable: return ["Executable", AiOutlineClockCircle, "text-green-500 border-green-500", null]
                case ProposalState.Expired: return ["Expired", IoIosCloseCircleOutline, "text-red-900 border-red-900", null]
                case ProposalState.Executed: return ["Executed", IoIosCheckmarkCircleOutline, "text-green-900 border-green-900", null]
                case ProposalState.Canceled: return ["Canceled", IoIosCloseCircleOutline, "text-red-900 border-red-900", null]
                case ProposalState.Rejected: return ["Rejected", IoIosCloseCircleOutline, "text-red-900 border-red-900", null]
                case ProposalState.Pending: return ["Pending", AiOutlineClockCircle, "text-gray-500 border-gray-500", null]
            }
        })() as [string, IconType, string, () => any]
        return <StatusButton label={label} icon={icon} color={color} onClick={onClick} />
    })()

    return (
        <div className="flex flex-col">
            <div className="flex flex-col">
                <div className="flex flex-row justify-between space-x-2">
                    <h1 className="flex-1 font-bold text-white" style={{ minHeight: "4rem" }}>{ proposal.description }</h1>
                    <span className="text-gray-800">#{ proposal.id.toNumber() }</span>
                </div>
                <div className="flex flex-row justify-between text-sm mt-8">
                    <span className="text-gray-800">Proposed by</span>
                    <span className="text-gray-500">{ formatAccount(proposal.proposer) }</span>
                </div>
                <div className="flex flex-col mt-2">
                    <div className="flex flex-row justify-between text-sm">
                        <span className="text-gray-800">Vote start</span>
                        <span className="text-gray-500">{ startTimestamp ? (new Date(startTimestamp * 1000).toLocaleString()) : null }</span>
                    </div>
                    <div className="flex flex-row justify-between text-sm">
                        <span className="text-gray-800">Vote end</span>
                        <span className="text-gray-500">{ endTimestamp ? (new Date(endTimestamp * 1000).toLocaleString()) : null }</span>
                    </div>
                </div>
                <div className="flex flex-row justify-between text-sm mt-2">
                    <span className="text-gray-800">Expires</span>
                    <span className="text-gray-500">{ expirationTimestamp ? (new Date(expirationTimestamp * 1000).toLocaleString()) : null }</span>
                </div>
            </div>
            <div className="flex flex-col w-full mt-8">
                <div className="flex flex-row w-full justify-between">
                    <span className="text-green-900">{ convertBigNumber(proposal.forVotes).toSignificant(4) }{ hasVotes ? ` (${ percentageVoted }%)` : null }</span>
                    <span className="text-red-900">{ convertBigNumber(proposal.againstVotes).toSignificant(4) }{ hasVotes ? ` (${ 100 - percentageVoted }%)` : null }</span>
                </div>
                <div className="flex flex-row w-full bg-red-900 items-center" style={{ height: "0.125rem" }}>
                    <div className="bg-green-900 h-full" style={{ width: `${percentageVoted}%` }} />
                </div>
            </div>
            <div className="flex flex-row mt-8">
                { Status }
            </div>
        </div>
    )
}

const Proposal: FunctionComponent<{ id: number }> = ({ id }) => {
    const proposal = useProposal(id)
    return (
        <div className={classnames("flex flex-col p-4 shadow-lg bg-gray-900 bg-opacity-25 border-b-2 border-green-900", !proposal && "items-center justify-center")}>
            { proposal ? <ProposalView proposal={proposal} /> : <AiOutlineLoading className="animate-spin mx-auto text-2xl text-green-500" /> }
        </div>
    )
}

export default Proposal