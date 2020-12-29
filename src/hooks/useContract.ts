import { useWeb3React } from "@web3-react/core"
import { Contract } from "ethers"
import { useMemo } from "react"

import capGovernance from "../CapGovernance.json"
import capToken from "../CapToken.json"
import { contractAddresses } from "../constants"

export const useContract = () => {
    const { account, library, chainId } = useWeb3React()
    return useMemo(() => {
        const signer = library.getSigner(account).connectUnchecked()
        return new Contract(contractAddresses[chainId!], capGovernance.result, signer)
    }, [account, library, chainId])
}

export const useTokenContract = (address?: string | null) => {
    const { account, library } = useWeb3React()
    return useMemo(() => {
        if (!address) return null
        return getTokenContract(address, account!, library)
    }, [account, address, library])
}

export const getTokenContract = (address: string, account: string, library: any) => {
    const signer = library.getSigner(account).connectUnchecked()
    return new Contract(address, capToken.result, signer)
}