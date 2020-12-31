import { CurrencyAmount, JSBI } from "@uniswap/sdk"
import { useWeb3React } from "@web3-react/core"
import { parseEther } from "ethers/lib/utils"
import React, { useEffect, useState } from "react"
import { getTokenContract, useContract } from "../hooks/useContract"
import { useWeb3Result } from "../hooks/useWeb3Result"
import { useStoreActions } from "../state/hooks"
import CurrencyInput from "./CurrencyInput"
import { MaxUint256 } from "@ethersproject/constants"

const Settings = () => {

    const { account, library } = useWeb3React()

    const contract = useContract()
    const stakedCap = useWeb3Result(async ({ account, library }) => (await contract.balanceOf(account)).toString())

    const [amount, setAmount] = useState<string>()
    useEffect(() => { if (stakedCap) setAmount(CurrencyAmount.ether(stakedCap).toExact()) }, [stakedCap])

    const addPendingTransaction = useStoreActions(actions => actions.addPendingTransaction)

    const needsAllowance = useWeb3Result(async ({ account, library }) => {
        const tokenContract = getTokenContract(await contract.token(), account, library)
        const allowance = await tokenContract.allowance(account!, contract.address)
        const tokenBalance = await tokenContract.balanceOf(account!)
        return allowance.lt(tokenBalance)
    })

    const allowSpend = async () => {
        const tokenContract = getTokenContract(await contract.token(), account!, library)
        addPendingTransaction((await tokenContract.approve(contract.address, MaxUint256)).hash)
    }

    const saveStake = async () => {
        if (needsAllowance) {
            await allowSpend()
        }
        const cAmount = CurrencyAmount.ether(JSBI.BigInt(parseEther(amount!)))
        const cStakedCap = CurrencyAmount.ether(stakedCap)
        if (cAmount.greaterThan(cStakedCap)) {
            addPendingTransaction((await contract.stakeToVote(cAmount.subtract(cStakedCap).raw.toString())).hash)
        } else {
            addPendingTransaction((await contract.releaseStaked(cStakedCap.subtract(cAmount).raw.toString())).hash)
        }
    }

    return (
        <div className="flex flex-col text-gray-500 space-y-8">
            <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row items-center">
                    <h1 className="text-white text-2xl">Settings</h1>
                </div>
            </div>
            <div className="flex flex-col relative">
                <div className="absolute pattern-dots-sm text-green-500 text-opacity-50 left-0 top-0 w-8 h-8 -ml-4 -mt-1" />
                <label htmlFor="stakedCap" className="mb-2 flex flex-row justify-between">
                    <span>Staked CAP</span>
                    <span className="text-gray-800">Default: 10 CAP</span>
                </label>
                <CurrencyInput
                    className="p-2 px-4 text-white bg-green-900 bg-opacity-25 border-green-500 border-b-2"
                    name="stakedCap" type="number" value={amount || ""} onChange={setAmount} />
                <input onClick={saveStake} disabled={!stakedCap || !amount} type="button" value="Save Stake" className="mt-4 p-2 px-4 text-white hover:bg-green-500 bg-transparent border-b-2 border-green-500 transition duration-200" />
            </div>
        </div>
    )
}

export default Settings