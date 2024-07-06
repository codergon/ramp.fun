import { Address } from "viem";
import { client } from "../utils/graphql";
import { useState, useEffect } from "react";
import { GET_TOPBAR_TRADES, GET_TRADES } from "../utils/query";
import { useQuery } from "@tanstack/react-query";

export interface Trade {
  id: string;
  actor: Address;
  action: string;
  tokenId: Address;
  timestamp: string;
  fee: string;
  amountOut: string;
  amountIn: string;
}

export interface TopBarTrade {
  id: string;
  actor: Address;
  action: string;
  token: {
    address: Address;
    symbol: string;
  };
  timestamp: string;
  fee: string;
  amountOut: string;
  amountIn: string;
}

interface TradesData {
  trades: {
    items: Trade[];
  };
}

interface TopBarTradesData {
  trades: {
    items: TopBarTrade[];
  };
}

export const useTrades = (tokenId: string, orderBy: string, limit: number) => {
  const fetchTrades = async (
    tokenId: string,
    orderBy: string,
    limit: number,
  ) => {
    if (tokenId === "") {
      return [];
    }
    const { trades } = await client.request<TradesData>(GET_TRADES, {
      orderBy,
      tokenId,
      limit,
    });
    return trades.items;
  };

  return useQuery<Trade[], Error>({
    queryKey: ["trades", tokenId, orderBy, limit],
    queryFn: () => fetchTrades(tokenId, orderBy, limit),
    enabled: tokenId !== "",
  });
};

export const useTopbarTrades = (limit: number, chainId: number) => {
  const fetchTopbarTrades = async (limit: number, chainId: number) => {
    const { trades } = await client.request<TopBarTradesData>(
      GET_TOPBAR_TRADES,
      {
        limit,
        chainId,
      },
    );
    return trades.items;
  };

  return useQuery<TopBarTrade[], Error>({
    queryKey: ["topbarTrades", limit, chainId],
    queryFn: () => fetchTopbarTrades(limit, chainId),
  });
};
