import { Address } from "viem";
import { client } from "../utils/graphql";
import { useQuery } from "@tanstack/react-query";
import { GET_TOKENS, GET_TOKEN } from "../utils/query";

interface Token {
  id: string;
  address: Address;
  chainId: number;
  creator: Address;
  name: string;
  symbol: string;
  marketCap: string;
  description: string;
  logoUrl: string;
  timestamp: string;
}

interface TokensData {
  tokens: {
    items: Token[];
  };
}

interface TokenDetail extends Token {
  isMigrated: boolean;
  lpAddress: String | null;
}

interface TokenWithPrices extends TokenDetail {
  prices: {
    items: {
      id: number;
      open: string;
      high: string;
      low: string;
      close: string;
      average: string;
      count: string;
    }[];
  };
}

interface TokenData {
  token: TokenWithPrices;
}

export const useTokens = (chainId: number, orderBy: string, limit: number) => {
  const fetchTokens = async (
    chainId: number,
    orderBy: string,
    limit: number,
  ) => {
    const { tokens } = await client.request<TokensData>(GET_TOKENS, {
      orderBy,
      chainId,
      limit,
    });
    return tokens.items;
  };

  return useQuery<Token[], Error>({
    queryKey: ["tokens", chainId, orderBy, limit],
    queryFn: () => fetchTokens(chainId, orderBy, limit),
  });
};

export const useToken = (id: string) => {
  const fetchToken = async (id: string): Promise<TokenWithPrices | null> => {
    if (id === "") {
      return null;
    }
    const { token } = await client.request<TokenData>(GET_TOKEN, { id });
    return token;
  };

  return useQuery<TokenWithPrices | null, Error>({
    queryKey: ["token", id],
    queryFn: () => fetchToken(id),
    enabled: id !== "", // Only run the query if id is not an empty string
  });
};
