import { useWeb3React } from '@web3-react/core'
import { useCallback, useEffect, useState } from 'react'
import useDebounce from '../hooks/useDebounce'
import useIsWindowVisible from '../hooks/useIsWindowVisible'
import { useStoreActions } from '../state/hooks'

// https://github.com/Uniswap/uniswap-interface/blob/f7a1a2ab58ff67b341291f7573675d12ae4f9b66/src/state/application/updater.ts
const BlockNumberUpdater = () => {
    const { library, chainId } = useWeb3React()

    const windowVisible = useIsWindowVisible()

    const [state, setState] = useState<{ chainId: number | undefined; blockNumber: number | null }>({
        chainId,
        blockNumber: null
    })

    const blockNumberCallback = useCallback(
        (blockNumber: number) => {
        setState(state => {
            if (chainId === state.chainId) {
                if (typeof state.blockNumber !== 'number')
                    return { chainId, blockNumber }
                return { chainId, blockNumber: Math.max(blockNumber, state.blockNumber) }
            }
            return state
        })
        },
        [chainId, setState]
    )

    // attach/detach listeners
    useEffect(() => {
        if (!library || !chainId || !windowVisible) return undefined

        setState({ chainId, blockNumber: null })

        library
            .getBlockNumber()
            .then(blockNumberCallback)
            .catch((error: any) => console.error(`Failed to get block number for chainId: ${chainId}`, error))

        library.on('block', blockNumberCallback)
        return () => { library.removeListener('block', blockNumberCallback) }
    }, [chainId, library, blockNumberCallback, windowVisible])

    const debouncedState = useDebounce(state, 100)

    const setBlockNumber = useStoreActions(store => store.setBlockNumber)

    useEffect(() => {
        if (!debouncedState.chainId || !debouncedState.blockNumber || !windowVisible) return
        setBlockNumber({ chainId: debouncedState.chainId, blockNumber: debouncedState.blockNumber })
    }, [windowVisible, debouncedState.blockNumber, debouncedState.chainId]) // eslint-disable-line react-hooks/exhaustive-deps

    return null
}

export default BlockNumberUpdater