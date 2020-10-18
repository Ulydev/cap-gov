import classnames from "classnames"
import React, { CSSProperties, FunctionComponent } from "react"

const Container: FunctionComponent<{ className?: string, style?: CSSProperties }> = ({ className, ...props }) => (
    <div className={classnames(
        className,
        "max-w-3xl mx-auto px-8"
    )} {...props} />
)

export default Container