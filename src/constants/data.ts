import { RampBondingCurveAbi } from "../abis/BondingCurveAbi";
import { tokenAbi } from "../abis/tokenAbi";

export const curveConfig = {
    abi: RampBondingCurveAbi,
    address: "0xFA598e9Bd1970E0cB42b1e23549A6d5436680b51" as `0x${string}`
}


export const tokenConfig = {
    abi: tokenAbi
}