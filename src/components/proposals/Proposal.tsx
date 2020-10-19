import React, { FunctionComponent, useEffect, useMemo, useReducer } from "react"
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

import { RiExternalLinkLine } from "react-icons/ri"

const useCountdown = (targetTimestamp: number) => {

    const [, forceUpdate] = useReducer(x => x + 1, 0)
    useEffect(() => {
        const timer = setTimeout(() => forceUpdate(), 1000)
        return () => clearTimeout(timer)
    })

    if (!targetTimestamp) return null

    const calculateTimeLeft = () => {
        const difference = targetTimestamp * 1000 - +Date.now()
        const remaining: { h?: number, m?: number, s?: number } = {}
        if (difference > 0) {
            remaining.h = Math.floor((difference / (1000 * 60 * 60)))
            remaining.m = Math.floor((difference / (1000 * 60)) % 60)
            remaining.s = Math.floor((difference / 1000) % 60)
        }
        return [difference, remaining]
    }
    const [difference, remaining] = calculateTimeLeft()

    return difference > 0 ? Object.entries(remaining).filter(([key, value]) => value > 0).map(([key, value]) => `${ value }${ key }`).join(" ") : "0s"
}

const VoteButton: FunctionComponent<{ proposal: ProposalType, endTimestamp: number }> = ({ proposal, endTimestamp }) => {

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
                "flex flex-row w-full text-2xl font-bold justify-between space-x-2 items-end"
            )}>
            <div className="flex flex-col flex-1 border-b-2 border-gray-500 flex-1 text-left pb-1">
                <span>Voting</span>
                <span className="text-xs text-gray-800 font-normal">ends in { useCountdown(endTimestamp) }</span>
            </div>
            { needsAllowance ? (
                <button onClick={allowSpend} className="text-gray-500 border-b-2 px-4 border-gray-500 hover:text-white hover:bg-gray-500 transition duration-500">Approve CAP</button>
            ) : <>
                <button onClick={() => castVote(true)} className="text-green-500 border-b-2 w-20 border-green-500 hover:text-white hover:bg-green-500 transition duration-500 pt-1">Yes</button>
                <button onClick={() => castVote(false)} className="text-red-500 border-b-2 w-20 border-red-500 hover:text-white hover:bg-red-500 transition duration-500 pt-1">No</button>
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
        <VoteButton proposal={proposal} endTimestamp={endTimestamp} />
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
                    <a className="text-gray-500 flex flex-row items-center space-x-1 hover:text-green-500" href={`https://ropsten.etherscan.io/address/${proposal.proposer}`} target="_blank" rel="noreferrer noopener">
                        <span>{ formatAccount(proposal.proposer) }</span><RiExternalLinkLine className="text-gray-800" />
                    </a>
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
            <div className="flex flex-row mt-8 h-16 items-end">
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