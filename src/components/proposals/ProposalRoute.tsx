import React from "react"
import { useParams } from "react-router-dom"
import Proposal from "./Proposal"

const ProposalRoute = () => {
    const { id } = useParams() as any
    return <Proposal id={id} full />
}

export default ProposalRoute