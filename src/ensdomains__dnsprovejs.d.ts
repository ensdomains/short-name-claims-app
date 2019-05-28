declare module '@ensdomains/dnsprovejs' {
  interface Provider {

  }

  interface TransactionRequest {
    to?: string;
    from?: string;
    nonce?: number;
    gasLimit?: number;
    gasPrice?: number;
  }

  export declare interface Proof {
    name: string;
    type: string;
    sig: string;
    inception: number;
    sigwire: string;
    rrdata: string;
  }

  export declare interface TXT {
    type: string;
    class: "TXT";
    name: string;
    ttl: number;
    data: Array<string>;
  }

  export declare type RR = TXT;

  export declare interface SignedSet {
    name: string;
    sig: string;
    rrs: Array<RR>;
  }

  export declare interface Result {
    found: boolean;
    nsec: boolean;
    results: Array<SignedSet>;
    proofs: Array<Proof>;
    lastProof?: string;
  }

  export declare interface OracleProof {
    inception: number;
    inserted: number;
    hash: string;
    hashToProve: string;
    validInception: boolean;
    matched: boolean;
  }

  export interface Oracle {
    knownProof(proof: Proof): Promise<OracleProof>;
    submitProof(proof: Proof, prevProof: Proof, params: TransactionRequest): Promise<boolean>;
    deleteProof(type: string, name: string, proof: OracleProof, prevProof: OracleProof, params: TransactionRequest): Promise<void>;
    toProve(proof: OracleProof): string;
    getAllProofs(result: dns.Result): Promise<[string, string]>;
    submitAll(result: dns.Result, params: TransactionRequest): Promise<void>;
    allProven(result: dns.Result): Promise<boolean>;
    getProven(result: dns.Result): Promise<number>;
  }

  export default class DnsProver {
    constructor(provider: Provider);
    lookup(type: string, query: string): Promise<dns.Result>;
    getOracle(address: string): Oracle;
  }
}
