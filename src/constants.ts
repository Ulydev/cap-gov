import { ChainId } from "@uniswap/sdk";

export const contractAddresses = {
    [ChainId.MAINNET]:  "0x16F8637360e88a8C2fDA90dAD68a3dE816eF0162",
    [ChainId.ROPSTEN]:  "0x5a037422532492e8a69b5afbffc21c68a9c4031e",
} as { [chainId: number]: string }