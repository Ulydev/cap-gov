import Jazzicon from "jazzicon"
import React, { FunctionComponent, useEffect, useRef } from 'react'

import { useWeb3React } from "@web3-react/core"

const Identicon: FunctionComponent<{ className?: string }> = ({ ...props }) => {
    const ref = useRef<HTMLDivElement>(null)

    const { account } = useWeb3React()

    useEffect(() => {
        if (account && ref.current) {
            ref.current.innerHTML = ''
            ref.current.appendChild(Jazzicon(24, parseInt(account.slice(2, 10), 16)))
        }
    }, [account])

    return <div className="flex items-center" ref={ref} { ...props } />
}

export default Identicon