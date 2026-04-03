import {
  type CalculateFeeParams,
  ChainId,
  CoinKey,
  StaticToken,
} from "@lifi/widget";
import { formatTokenPrice } from "./format";
import { findDefaultToken } from "@lifi/data-types";
import { useState, useEffect } from "react";

export async function calculateFee(params: CalculateFeeParams) {
  const { fromAmount } = params;

  const amountInUSD = formatTokenPrice(
    fromAmount,
    params.fromToken.priceUSD,
    params.fromToken.decimals
  );

  const sourceStablecoinTokenAddresses = getStablecoinTokenAddresses(
    params.fromToken.chainId
  );

  const destinationStablecoinTokenAddresses = getStablecoinTokenAddresses(
    params.toToken.chainId
  );

  const fromTokenAddress = params.fromToken.address.toLowerCase();
  const toTokenAddress = params.toToken.address.toLowerCase();

  const isSourceStablecoin = sourceStablecoinTokenAddresses.some(
    (token) => token.address.toLowerCase() === fromTokenAddress
  );

  const isDestinationStablecoin = destinationStablecoinTokenAddresses.some(
    (token) => token.address.toLowerCase() === toTokenAddress
  );

  if (isSourceStablecoin && isDestinationStablecoin) {
    if (amountInUSD <= 100_000) {
      return 0.001; // 0.10%
    } else if (amountInUSD <= 1_000_000) {
      return 0.0007; // 0.07%
    } else {
      return 0.0005; // 0.05%
    }
  } else {
    if (amountInUSD <= 100_000) {
      return 0.0035; // 0.35%
    } else if (amountInUSD <= 1_000_000) {
      return 0.002; // 0.20%
    } else {
      return 0.001; // 0.10%
    }
  }
}

export const getStablecoinTokenAddresses = (
  chainId: ChainId
): StaticToken[] => {
  const stablecoins = [CoinKey.USDC, CoinKey.USDT, CoinKey.DAI];
  return stablecoins
    .map((coinKey) => safeFindDefaultToken(coinKey, chainId))
    .filter((token): token is StaticToken => !!token);
};

const safeFindDefaultToken = (
  coinKey: CoinKey,
  chainId: ChainId
): StaticToken | undefined => {
  try {
    return findDefaultToken(coinKey, chainId);
  } catch {
    return undefined;
  }
};

export function useQueryParams() {
  const [queryParams, setQueryParams] = useState<URLSearchParams>(
    () => typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams()
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      setQueryParams(new URLSearchParams(window.location.search));
    }
  }, []);

  return queryParams;
}
