import { useWeb3React } from "@web3-react/core"
import { useStoreState } from "../state/hooks"

export function useBlockNumber(): number | undefined {
    const { chainId } = useWeb3React()
    const blockNumber = useStoreState(store => store.blockNumber)
    return blockNumber[chainId!]
}