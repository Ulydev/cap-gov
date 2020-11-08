import { BigNumber } from "ethers"

const AVERAGE_BLOCK_OFFSET = 500

export const getOrEstimateBlockTimestamp = async (blockNumber: BigNumber, library: any) => {
    try {
        return (await library.getBlock(blockNumber.toHexString())).timestamp
    } catch (e) {
        return await estimateBlockTimestamp(blockNumber.toNumber(), library)
    }
}

export const estimateBlockTimestamp = async (blockNumber: number, library: any) => {
    const nowBlockNumber = await library.getBlockNumber()
    const block = await library.getBlock(nowBlockNumber)
    const pastBlock = await library.getBlock(nowBlockNumber - AVERAGE_BLOCK_OFFSET)
    const averageBlockTime = (block.timestamp - pastBlock.timestamp) / AVERAGE_BLOCK_OFFSET
    return block.timestamp + averageBlockTime * (blockNumber - nowBlockNumber)
}