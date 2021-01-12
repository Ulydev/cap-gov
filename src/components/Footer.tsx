import React from "react"
import Container from "./Container"

const Footer = () => (
    <Container className="flex flex-col pb-8 text-sm">
        <span className="text-gray-600 mx-auto">Made by <a href="https://uly.dev" className="text-green-500 hover:text-green-900" target="_blank" rel="noreferrer noopener">ulydev</a>. Enjoying it? Buy me a coffee at</span>
        <span className="text-gray-500 mx-auto">0xffd91D21aada737a54902E5C09f4af5A8E52252D</span>
    </Container>
)

export default Footer