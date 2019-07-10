import { ethers } from 'ethers';
import React from 'react';

interface Ethereum extends ethers.providers.AsyncSendable {
  enable: () => Promise<string|null|undefined>;
}

declare global {
  interface Window {
    ethereum?: Ethereum;
  }
}

export class ProviderInfo {
  provider: ethers.providers.BaseProvider;

  constructor(provider: ethers.providers.BaseProvider) {
    this.provider = provider;
  }

  async account() {
    if(!window.ethereum) return null;
    const accounts = await window.ethereum.enable();
    if(accounts === undefined || accounts === null) {
      return null;
    }
    return accounts[0];
  }
}

export const defaultContext = new ProviderInfo(window.ethereum?new ethers.providers.Web3Provider(window.ethereum):ethers.getDefaultProvider('homestead'));

export const ProviderContext = React.createContext(defaultContext);
