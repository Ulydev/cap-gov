import { Action, action } from "easy-peasy"

interface ModalContent {
    title: string
    children: React.ReactNode | null
}

export interface ModalModel {
    isOpen: boolean
    content: ModalContent | null
    show: Action<ModalModel, ModalContent>
    close: Action<ModalModel>
}

const modalModel: ModalModel = {
    isOpen: false,
    content: null,
    show: action((state, content) => { state.content = content; state.isOpen = true }),
    close: action(state => { state.isOpen = false })
}

export default modalModel