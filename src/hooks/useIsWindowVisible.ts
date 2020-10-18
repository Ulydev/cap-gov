import { useCallback, useEffect, useState } from 'react'

const VISIBILITY_STATE_SUPPORTED = 'visibilityState' in document

const isWindowVisible = () => {
    return !VISIBILITY_STATE_SUPPORTED || document.visibilityState !== 'hidden'
}

export default () => {
    const [focused, setFocused] = useState<boolean>(isWindowVisible())
    const listener = useCallback(() => {
        setFocused(isWindowVisible())
    }, [setFocused])

    useEffect(() => {
        if (!VISIBILITY_STATE_SUPPORTED) return undefined
        document.addEventListener('visibilitychange', listener)
        return () => { document.removeEventListener('visibilitychange', listener) }
    }, [listener])

    return focused
}