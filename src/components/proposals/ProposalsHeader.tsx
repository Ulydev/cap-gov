import React from "react"
import { FiPlus } from "react-icons/fi"
import { NavLink } from "react-router-dom"
import { useProposalCount } from "../../hooks/useProposal"

const ProposalsHeader = () => {
    const proposalCount = useProposalCount()
    return (
        <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row items-center">
                <h1 className="text-white text-2xl">Proposals ({ proposalCount ? proposalCount!.toNumber() : "..." })</h1>
                <NavLink to="/new" className="border-b-2 border-green-500 ml-2 flex flex-row items-center p-2 px-4 text-white hover:bg-green-500 transition duration-200" activeClassName="bg-green-500">
                    New<FiPlus className="ml-1" size="0.95rem" />
                </NavLink>
            </div>
            <div className="flex flex-row border-b-2 border-green-500">
                <NavLink to="/newest" className="p-2 px-4 text-white hover:bg-green-500 transition duration-200" activeClassName="bg-green-500">
                    Newest
                </NavLink>
                <NavLink to="/oldest" className="p-2 px-4 text-white hover:bg-green-500 transition duration-200" activeClassName="bg-green-500">
                    Oldest
                </NavLink>
            </div>
        </div>
    )
}

export default ProposalsHeader