import { useWeb3React } from "@web3-react/core"
import React from "react"
import { injected } from "../web3/connectors"

import metamask from "../images/metamask.svg"

const ActivatePrompt = () => {
    const { activate } = useWeb3React()
    return (
        <div className="flex flex-col text-gray-500 space-y-8 items-start">
            <span className="text-white text-2xl">Welcome to Cap Governance.</span>
            <span>This interface allows you to browse and vote on proposals for Cap.</span>
            <button className="flex flex-row p-2 px-4 text-white border-b-2 hover:bg-green-500 transition duration-200 border-green-500 items-center space-x-2" onClick={() => activate(injected)}><span>Connect with MetaMask</span><img src={metamask} alt="metamask" className="w-6" /></button>
        </div>
    )
}

export default ActivatePrompt