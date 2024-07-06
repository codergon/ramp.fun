import { Address } from "viem";
import { client } from "../utils/graphql";
import { useState, useEffect } from "react";
import { GET_TOPBAR_TRADES, GET_TRADES } from "../utils/query";

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
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrades = async (tokenId: String, orderBy: string) => {
    setLoading(true);
    setError(null);
    if (tokenId == "") {
      setLoading(false);
      return;
    }
    try {
      const data = await client.request<TradesData>(GET_TRADES, {
        orderBy,
        tokenId,
      });
      setTrades(data.trades.items);
    } catch (err) {
      console.log(err);
      setError("An Error occured while fetching tokens...");
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    await fetchTrades(tokenId, orderBy);
  };

  useEffect(() => {
    fetchTrades(tokenId, orderBy);
  }, [tokenId, orderBy, limit]);

  return { trades: trades, loading, error, refresh };
};

export const useTopbarTrades = (limit: number, chainId: number) => {
  const [trades, setTrades] = useState<TopBarTrade[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrades = async (limit: number, chainId: number) => {
    setLoading(true);
    setError(null);

    try {
      const data = await client.request<TopBarTradesData>(GET_TOPBAR_TRADES, {
        limit,
        chainId,
      });
      setTrades(data.trades.items);
    } catch (err) {
      console.log(err);
      setError("An Error occured while fetching tokens...");
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    await fetchTrades(limit, chainId);
  };

  useEffect(() => {
    fetchTrades(limit, chainId);
  }, [limit, chainId]);

  return { trades: trades, loading, error, refresh };
};
