import React from "react"
import { useStoreState } from "../state/hooks"

import { CgSpinner } from "react-icons/cg"

const PendingTransactionsCount = () => {
    const pendingTransactions = useStoreState(state => state.pendingTransactions)
    const count = Object.keys(pendingTransactions).length
    return (count > 0) ? (
        <div className="fixed z-40 top-0 left-0 right-0 mx-auto w-64 mt-4 text-xs bg-green-500 text-white flex flex-row items-center justify-between p-2 shadow-lg">
            <CgSpinner className="animate-spin mr-1" size="1.2rem" />
            <div className="flex flex-1 flex-row justify-center items-center">{ count } pending transaction{ count > 1 ? "s" : null }</div>
        </div>
    ) : null
}

export default PendingTransactionsCount