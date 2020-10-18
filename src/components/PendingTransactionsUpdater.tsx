import { useWeb3React } from "@web3-react/core"
import React, { FunctionComponent, useEffect } from "react"
import { useBlockNumber } from "../hooks/useBlockNumber"
import { useStoreActions, useStoreState } from "../state/hooks"

const SinglePendingTransactionUpdater: FunctionComponent<{ hash: string }> = ({ hash }) => {
    const { library } = useWeb3React()

    const removePendingTransaction = useStoreActions(actions => actions.removePendingTransaction)
    const blockNumber = useBlockNumber()
    useEffect(() => {
        (async () => {
            // check transaction status
            const receipt = await library.getTransactionReceipt(hash)
            if (receipt) {
                removePendingTransaction({ hash, status: receipt.status as number })
            }
        })()
    }, [hash, library, blockNumber, removePendingTransaction])
    return null
}

const PendingTransactionsUpdater = () => {
    const pendingTransactions = useStoreState(state => state.pendingTransactions)
    return <>{ Object.keys(pendingTransactions).map(hash => <SinglePendingTransactionUpdater key={hash} hash={hash} />) }</>
}

export default PendingTransactionsUpdater