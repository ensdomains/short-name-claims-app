declare module 'dns-packet' {
  export declare interface Name {
    encode(str: string, buf?: Buffer, offset?: number): Buffer;
  }

  let name: Name;

  let RECURSION_DESIRED: number;

  export declare interface Question {
    name: string;
    type: string;
    class: string;
  }

  export declare interface RA {
    name: string;
    type: "A";
    class: string;
    ttl: string;
    data: string;
  }

  export declare interface RTXT {
    name: string;
    type: "TXT";
    class: string;
    ttl: string;
    data: Array<Buffer>;
  }

  export declare type RR = RA | RTXT;

  export declare interface Packet {
    id: number;
    type: string;
    flags?: number;
    flag_qr?: boolean;
    opcode?: string;
    flag_aa?: boolean;
    flag_tc?: boolean;
    flag_rd?: boolean;
    flag_ra?: boolean;
    flag_z?: boolean;
    flag_ad?: boolean;
    flag_cd?: boolean;
    rcode?: string;
    questions: Array<Question>;
    answers: Array<RR>;
    authorities: Array<RR>;
    additionals: Array<RR>;
  }

  export declare function encode(result: Packet, buf?: Buffer, offset?: number): Buffer;
  export declare function decode(buf: Buffer, offset?: number): Packet;
}
