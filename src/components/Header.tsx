import React from "react"

import Identicon from "./Identicon"
import { useWeb3React } from "@web3-react/core"
import { useCapBalance } from "../hooks/useCapBalance"

import logo from "../images/logo.svg"
import { AiOutlinePlusCircle, AiOutlinePoweroff, AiOutlineSetting } from "react-icons/ai"
import { getTokenContract, useContract } from "../hooks/useContract"
import { useStoreActions } from "../state/hooks"
import { toast } from "react-toastify"
import { formatAccount } from "../util/formatAccount"
import { ChainId } from "@uniswap/sdk"
import { NavLink } from "react-router-dom"

const Account = () => {
    const { account, deactivate, library, chainId } = useWeb3React()
    const formattedAccount = formatAccount(account)
    const capBalance = useCapBalance()

    const contract = useContract()

    const addPendingTransaction = useStoreActions(actions => actions.addPendingTransaction)

    const requestFromFaucet = async () => {
        const tokenAddress = await contract.token()
        const tokenContract = getTokenContract(tokenAddress, account!, library)
        try {
            addPendingTransaction((await tokenContract.faucetRequest()).hash)
        } catch (e) {
            toast.error("Error while requesting from faucet")
        }
    }

    return (
        <div className="flex flex-col items-end space-y-2">
            <div className="flex flex-row items-center">
                <div className="flex flex-row space-x-2 items-center">
                    <span className="text-white font-thin">{ formattedAccount }</span>
                    <Identicon />
                </div>
            </div>
            <div className="flex flex-row items-center space-x-2 pr-1">
                <span className="opacity-50 text-sm">{ capBalance?.toSignificant(4) } CAP</span>
                { chainId !== ChainId.MAINNET ?
                    <button
                        onClick={requestFromFaucet}
                        className="opacity-50 hover:opacity-100 transition duration-200 text-lg">
                        <AiOutlinePlusCircle />
                    </button>
                : null }
                <NavLink
                    to="/settings"
                    className="opacity-50 hover:opacity-100 transition duration-200 text-lg">
                    <AiOutlineSetting />
                </NavLink>
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
    const { account, chainId } = useWeb3React()
    return <>
        <header className="flex flex-row mx-8 lg:mx-12 py-8 mb-12 lg:mb-0 text-white justify-between">
            <div className="flex flex-col space-y-1 items-start">
                <img src={logo} alt="logo" className="w-16" />
                <NavLink to="/" className="text-xl font-thin hover:text-green-500 transition duration-200">Governance</NavLink>
                <span className="text-white text-xs p-0 px-2 bg-green-900 mt-6 inline-block opacity-50">{ chainId ? ChainId[chainId] : "" }</span>
            </div>
            <div className="flex flex-row">
                { account ? <Account /> : null }
            </div>
        </header>
    </>
}

export default Header