import { getEvmNetwork } from './networks/evm_network';
import type {
  PrefixedHexString,
  GsnTransactionDetails,
  MetaTxMethod,
} from './gsnClient/utils';

import {
  AmoyNetworkConfig,
  LocalNetworkConfig,
  PolygonNetworkConfig,
  TestNetworkConfig,
  NetworkConfig,
} from './network_config/network_config';
import { BaseSepoliaNetworkConfig } from './network_config/network_config_base_sepolia';
import { BaseNetworkConfig } from './network_config/network_config_base';
import type { TokenConfig } from './transactions/supported_tokens';


export interface Network {
  networkConfig: NetworkConfig;
  getBalance: (tokenAddress?: PrefixedHexString) => Promise<number>;
  getDisplayBalance: (tokenAddress?: PrefixedHexString) => Promise<number>;
  getExactBalance: (tokenAddress?: PrefixedHexString) => Promise<string>;
  transfer: (
    destinationAddress: string,
    amount: number,
    tokenAddress?: PrefixedHexString,
    metaTxMethod?: MetaTxMethod
  ) => Promise<string>;
  transferExact: (
    destinationAddress: string,
    amount: string,
    tokenAddress?: PrefixedHexString,
    metaTxMethod?: MetaTxMethod,
    tokenConfig?: TokenConfig
  ) => Promise<string>;
  claimRly: () => Promise<string>;
  //Deprecated please use claimRly instead
  registerAccount: () => Promise<string>;
  relay?: (tx: GsnTransactionDetails) => Promise<string>;
  setApiKey: (apiKey: string) => void;
}

export const RlyAmoyNetwork: Network = getEvmNetwork(AmoyNetworkConfig);
export const RlyBaseSepoliaNetwork: Network = getEvmNetwork(
  BaseSepoliaNetworkConfig
);
export const RlyBaseNetwork: Network = getEvmNetwork(BaseNetworkConfig);
export const RlyLocalNetwork: Network = getEvmNetwork(LocalNetworkConfig);
export const RlyTestNetwork: Network = getEvmNetwork(TestNetworkConfig);
export const RlyPolygonNetwork: Network = getEvmNetwork(PolygonNetworkConfig);
export * from './networks/dummy_network';
