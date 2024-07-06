import { Config } from "wagmi";
import { multicall } from "@wagmi/core";
import { Address, formatEther } from "viem";
import { curveConfig } from "../constants/data";
import { useQuery } from "@tanstack/react-query";

interface TokenPool {
  token: Address;
  lastPrice: bigint;
  migrated: boolean;
}

interface PoolAndThresholdData {
  pool: TokenPool;
  bondingPercentage: string;
}

const fetchPoolAndMigrationThreshold = async (
  addr: Address,
  config: Config,
): Promise<PoolAndThresholdData> => {
  const [{ result: tokenPoolResult }, { result: threshHold }] = await multicall(
    config,
    {
      contracts: [
        {
          ...curveConfig,
          functionName: "tokenPool",
          args: [addr],
        },
        {
          ...curveConfig,
          functionName: "migrationThreshold",
        },
      ],
    },
  );

  if (!tokenPoolResult || !threshHold) {
    throw new Error("Failed to fetch pool data or migration threshold");
  }

  const pool: TokenPool = {
    token: tokenPoolResult[0],
    lastPrice: tokenPoolResult[5],
    migrated: tokenPoolResult[10],
  };

  const curveProgress =
    (Number(formatEther(tokenPoolResult[3])) /
      Number(formatEther(threshHold))) *
    100;
  const bondingPercentage = parseFloat(curveProgress.toString()).toFixed(2);

  return { pool, bondingPercentage };
};

export const usePoolAndMigrationThreshold = (addr: Address, config: Config) => {
  return useQuery<PoolAndThresholdData, Error>({
    queryKey: ["poolAndMigrationThreshold", addr],
    queryFn: () => fetchPoolAndMigrationThreshold(addr, config),
  });
};
