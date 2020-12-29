import React from "react"

const NetworkPrompt = () => {
    return (
        <div className="flex flex-col space-y-8 text-gray-500">
            <span className="text-white text-2xl">Wrong network ID.</span>
            <span>Please switch to a supported network.</span>
        </div>
    )
}

export default NetworkPrompt