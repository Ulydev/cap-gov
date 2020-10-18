import classnames from 'classnames'
import React, { FunctionComponent } from 'react'
import { FiX } from "react-icons/fi"
import Modal, { Props } from 'react-modal'

import Container from './Container'

const ContainerModal: FunctionComponent<Props & {
    title?: string
    padding?: boolean
}> = ({ onRequestClose, title, padding = true, children, ...props }) => (
    <Modal
        { ...props }
        overlayClassName={classnames(
            "fixed inset-0",
            "flex items-center justify-center",
            "bg-black bg-opacity-25",
            props.overlayClassName
        )}
        className={classnames("outline-none", props.className)}
        shouldFocusAfterRender={false}
        shouldCloseOnEsc={true}
        shouldCloseOnOverlayClick={true}
        onRequestClose={onRequestClose}>
        <Container>
            <div className={classnames(
                "flex flex-row w-full",
                "items-center",
                "px-4", title ? "py-4" : "pt-4 -mb-4",
                title && "bg-gray-200",
                "rounded-xl",
                "z-50"
            )}>
                {title ? <h2>{ title }</h2> : null}
                <button className="ml-auto" onClick={onRequestClose}><FiX /></button>
            </div>
            <div className={classnames(
                padding && "p-8"
            )}>
                { children }
            </div>
        </Container>
    </Modal>
)

export default ContainerModal