import { useWeb3React } from "@web3-react/core"
import { useEffect, useState } from "react"
import { useBlockNumber } from "./useBlockNumber"
import { useContract } from "./useContract"

export const useWeb3Result = <T>(f: (props: { account: any, library: any }) => Promise<T>) => {
    const contract = useContract()
    const { account, library, chainId } = useWeb3React()
  
    const blockNumber = useBlockNumber()

    const [value, set] = useState<T | null | undefined>()
    useEffect(() => {
        if (!!account && !!library) {
            let stale = false
            const refresh = async () => {
                try {
                    const value = await f({ account, library })
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
    }, [account, library, chainId, blockNumber, contract]) //eslint-disable-line react-hooks/exhaustive-deps

    return value
}