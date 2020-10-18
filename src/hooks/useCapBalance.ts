import { useEffect, useState } from "react"

import { CurrencyAmount } from "@uniswap/sdk"
import JSBI from "jsbi"
import { useWeb3React } from "@web3-react/core"
import { useBlockNumber } from "./useBlockNumber"
import { useTokenContract } from "./useContract"
import { useGovernanceTokenAddress } from "./useGovernanceTokenAddress"

export const useCapBalance = () => {
    const { account, library, chainId } = useWeb3React()
  
    const blockNumber = useBlockNumber()

    const tokenAddress = useGovernanceTokenAddress()
    const tokenContract = useTokenContract(tokenAddress)

    const [balance, setBalance] = useState<CurrencyAmount | null | undefined>()
    useEffect(() => {
        if (!!account && !!library) {
            let stale = false
            const refreshBalance = async () => {
                try {
                    if (!tokenContract) return
                    const balance = await tokenContract.balanceOf(account)
                    const formattedBalance = CurrencyAmount.ether(JSBI.BigInt(balance.toString()))
                    if (!stale) setBalance(formattedBalance)
                } catch {
                    if (!stale) setBalance(null)
                }
            }
            refreshBalance()
            return () => {
                stale = true
                //setBalance(undefined)
            }
        }
    }, [account, library, chainId, blockNumber, tokenContract]) // ensures refresh if referential identity of library doesn't change across chainIds

    return balance
}