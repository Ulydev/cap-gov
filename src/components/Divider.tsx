import classnames from "classnames"
import React, { FunctionComponent } from "react"

const Divider: FunctionComponent<{ direction?: "horizontal" | "vertical" | "auto", margin?: boolean }> = ({ direction = "auto", margin = true }) => (
    <hr className={classnames(
        "border-gray-200",

        direction === "horizontal" && "border-t",
        direction === "vertical" && "h-auto border-0 border-l my-0",
        direction === "auto" && "border-t my-4 lg:h-auto lg:border-0 lg:border-l lg:my-0 lg:mx-4",

        (direction === "horizontal" && margin) && "my-4",
        (direction === "vertical" && margin) && "mx-4",
        (direction === "auto" && margin) && "my-4 lg:my-0 lg:mx-4"
    )} />
)

export default Divider