import React from "react"

import Identicon from "./Identicon"
import { useWeb3React } from "@web3-react/core"
import { useCapBalance } from "../hooks/useCapBalance"

import logo from "../images/logo.svg"
import { AiOutlinePlusCircle, AiOutlinePoweroff } from "react-icons/ai"
import { getTokenContract, useContract } from "../hooks/useContract"
import { useStoreActions } from "../state/hooks"
import { toast } from "react-toastify"
import { formatAccount } from "../util/formatAccount"
import { ChainId } from "@uniswap/sdk"

const Account = () => {
    const { account, deactivate, library } = useWeb3React()
    const formattedAccount = formatAccount(account)
    const capBalance = useCapBalance()

    const contract = useContract()

    const addPendingTransaction = useStoreActions(actions => actions.addPendingTransaction)

    const requestFromFaucet = async () => {
        const tokenAddress = await contract.governanceToken()
        const tokenContract = getTokenContract(tokenAddress, account!, library)
        try {
            addPendingTransaction((await tokenContract.faucetRequest()).hash)
        } catch (e) {
            toast.error("Error while requesting from faucet")
        }
    }

    return (
        <div className="flex flex-col items-start lg:items-end space-y-2">
            <div className="flex flex-row items-center">
                <div className="flex flex-row space-x-2 items-center">
                    <span className="text-white font-thin">{ formattedAccount }</span>
                    <Identicon />
                </div>
            </div>
            <div className="flex flex-row items-center space-x-2 pr-1">
                <span className="opacity-50 ml-2 lg:ml-0 text-sm">{ capBalance?.toSignificant(4) } CAP</span>
                <button
                    onClick={requestFromFaucet}
                    className="opacity-50 hover:opacity-100 transition duration-200 text-lg">
                    <AiOutlinePlusCircle />
                </button>
                <button
                    onClick={deactivate}
                    className="opacity-50 hover:opacity-100 transition duration-200 text-lg">
                    <AiOutlinePoweroff />
                </button>
            </div>
        </div> 
    )
}

const Header = () => {
    const { account } = useWeb3React()
    return <>
        <header className="flex flex-row mx-8 lg:mx-12 py-8 mb-12 text-white justify-between">
            <div className="flex flex-col space-y-1 items-start">
                <img src={logo} alt="logo" className="w-16" />
                <h1 className="text-xl font-thin">Governance</h1>
                { process.env.REACT_APP_CHAIN_ID !== ChainId.MAINNET.toString() ? <span className="text-white text-xs p-0 px-2 bg-green-900 mt-6 inline-block opacity-50">{ ChainId[parseInt(process.env.REACT_APP_CHAIN_ID!)] }</span> : null }
            </div>
            <div className="flex flex-row">
                { account ? <Account /> : null }
            </div>
        </header>
    </>
}

export default Header