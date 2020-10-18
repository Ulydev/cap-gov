import { BigNumber } from "ethers"
import React from "react"
import { useProposalCount } from "../../hooks/useProposal"
import Proposal from "./Proposal"
import ProposalsHeader from "./ProposalsHeader"

const OldestProposals = () => {

    const proposalCount = useProposalCount() || BigNumber.from(0)

    return (
        <div className="flex flex-col text-gray-500 space-y-8">
            <ProposalsHeader />
            <div className="grid lg:grid-cols-2 gap-4">
                { Array.from({ length: proposalCount.toNumber() }, (_, i) => i + 1).map((id => <Proposal key={id} id={id} />)) }
            </div>
        </div>
    )
}

export default OldestProposals