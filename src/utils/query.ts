import { gql } from 'graphql-request';

export const GET_TOKENS = gql`
  query MyQuery($orderBy: String, $chainId: Int) {
    tokens(
      limit: 5
      orderBy: $orderBy
      orderDirection: "desc"
      where: { chainId: $chainId }
    ) {
      items {
        id
        address
        chainId
        creator
        name
        symbol
        marketCap
        description
        logoUrl
        timestamp
      }
    }
  }
`;

export const GET_TOKEN = gql`
  query MyQuery($id: String!) {
  token(id: $id) {
    address
    creator
    description
    id
    isMigrated
    logoUrl
    lpAddress
    marketCap
    name
    symbol
  }
}
`

export const GET_TRADES = gql`query MyQuery($tokenId: String) {
  trades(
    orderBy: "timestamp"
    orderDirection: "desc"
    where: {tokenId: $tokenId}
    limit: 5
  ) {
    items {
      action
      actor
      tokenId
      id
      timestamp
      fee
      amountOut
      amountIn
    }
  }
}`
