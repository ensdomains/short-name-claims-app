declare module 'dns-packet' {
  export declare interface Name {
    encode(str: string, buf?: Buffer, offset?: number): Buffer;
  }

  let name: Name;
}
