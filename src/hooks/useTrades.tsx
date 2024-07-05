import { useState, useEffect } from 'react';
import { client } from '../utils/graphql';
import { GET_TRADES } from '../utils/query';
import { Address } from 'viem';

export interface Trade {
  id: string;
  actor: Address;
  action: String;
  tokenId: Address;
  timestamp: string;
  fee: String;
  amountOut: String;
  amountIn: String
}

interface TradesData {
  trades: {
    items: Trade[];
  };
}

export const useTrades = (tokenId: String, orderBy: string, limit: number) => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrades = async (tokenId: String, orderBy: string) => {
    setLoading(true);
    setError(null);
    if (tokenId == "") {
        setLoading(false);
        return
    }
    try {
      const data = await client.request<TradesData>(GET_TRADES, { orderBy, tokenId });
      setTrades(data.trades.items);
    } catch (err) {
        console.log(err);
      setError('An Error occured while fetching tokens...');
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    await fetchTrades(tokenId, orderBy);
  }

  useEffect(() => {
    fetchTrades(tokenId, orderBy);
  }, [tokenId, orderBy, limit]);

  return { trades: trades, loading, error, refresh };
};