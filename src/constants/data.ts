import { RampBondingCurveAbi } from "../abis/BondingCurveAbi";
import { tokenAbi } from "../abis/tokenAbi";

export const curveConfig = {
    abi: RampBondingCurveAbi,
    address: "0xD62BfbF2050e8fEAD90e32558329D43A6efce4C8" as `0x${string}`
}


export const tokenConfig = {
    abi: tokenAbi
}