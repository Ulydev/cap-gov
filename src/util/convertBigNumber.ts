import { CurrencyAmount, JSBI } from "@uniswap/sdk"
import { BigNumber } from "ethers"

export const convertBigNumber = (n: BigNumber) => CurrencyAmount.ether(JSBI.BigInt(n.toString()))