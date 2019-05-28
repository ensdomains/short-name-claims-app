import { ethers } from 'ethers';
import React from 'react';

interface Ethereum extends ethers.providers.AsyncSendable {
  enable: () => Promise<string|null|undefined>;
}

declare var ethereum: Ethereum;

export class ProviderInfo {
  provider: ethers.providers.JsonRpcProvider;

  constructor(provider: ethers.providers.JsonRpcProvider) {
    this.provider = provider;
  }

  async account() {
    const accounts = await ethereum.enable();
    if(accounts === undefined || accounts === null) {
      return accounts;
    }
    return accounts[0];
  }
}

export const defaultContext = new ProviderInfo(new ethers.providers.Web3Provider(ethereum));

export const ProviderContext = React.createContext(defaultContext);
