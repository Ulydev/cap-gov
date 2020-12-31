import { useWeb3React } from "@web3-react/core"
import { useEffect, useState } from "react"
import { useBlockNumber } from "./useBlockNumber"
import { useContract } from "./useContract"

export const useGovernanceTokenAddress = () => {
    const contract = useContract()
    const { account, library, chainId } = useWeb3React()
  
    const blockNumber = useBlockNumber()

    const [value, set] = useState<string | null | undefined>()
    useEffect(() => {
        if (!!account && !!library) {
            let stale = false
            const refresh = async () => {
                try {
                    const value = await contract.token()
                    if (!stale) set(value)
                } catch (e) {
                    console.error(e)
                    if (!stale) set(null)
                }
            }
            refresh()
            return () => {
                stale = true
            }
        }
    }, [account, library, chainId, blockNumber, contract])

    return value
}