import React from "react"
import { useStoreActions, useStoreState } from "../state/hooks"
import ContainerModal from "./ContainerModal"

const GlobalModal = () => {

    const modalOpen = useStoreState(store => store.modal.isOpen)
    const modalContent = useStoreState(store => store.modal.content)
    const closeModal = useStoreActions(store => store.modal.close)

    return modalOpen ? (
        <ContainerModal
            isOpen={modalOpen}
            onRequestClose={() => closeModal()}
            title={modalContent?.title}
            overlayClassName="z-50">
            { modalContent?.children }
        </ContainerModal>
    ) : null
}

export default GlobalModal