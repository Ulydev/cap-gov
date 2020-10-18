import { action, Action, persist } from "easy-peasy"
import modalModel, { ModalModel } from "./ModalModel"
import { toast } from "react-toastify"
import { formatAccount } from "../../util/formatAccount"

export interface StoreModel {
    firstLaunch: boolean
    launch: Action<StoreModel>

    modal: ModalModel

    blockNumber: { [chainId: number]: number }
    setBlockNumber: Action<StoreModel, { chainId: number, blockNumber: number }>

    pendingTransactions: { [hash: string]: string }
    addPendingTransaction: Action<StoreModel, string>
    removePendingTransaction: Action<StoreModel, { hash: string, status: number }>
}

const storeModel: StoreModel = {
    firstLaunch: true,
    launch: action((state) => { state.firstLaunch = false }),

    modal: modalModel,

    blockNumber: {},
    setBlockNumber: action((state, { chainId, blockNumber }) => {
        if (typeof state.blockNumber[chainId] !== 'number') {
            state.blockNumber[chainId] = blockNumber
        } else {
            state.blockNumber[chainId] = Math.max(blockNumber, state.blockNumber[chainId])
        }
    }),

    pendingTransactions: {},
    addPendingTransaction: action((state, hash) => {
        toast.info(`Transaction ${formatAccount(hash)} sent`)
        state.pendingTransactions[hash] = hash
    }),
    removePendingTransaction: action((state, { hash, status }) => {
        switch (status) {
            case 0: toast.error(`Transaction ${formatAccount(hash)} failed`); break;
            case 1: toast.success(`Transaction ${formatAccount(hash)} succeeded`); break;
            default: break;
        }
        delete state.pendingTransactions[hash]
    })
}

export default persist(storeModel, { blacklist: ["modal"] })