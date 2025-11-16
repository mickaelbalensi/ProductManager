declare module 'bcrypt' {
  export function hash(data: string | Buffer, saltOrRounds: string | number): Promise<string>;
  export function compare(data: string | Buffer, encrypted: string): Promise<boolean>;
}

declare module 'jsonwebtoken' {
  export interface SignOptions {
    expiresIn?: string | number;
    algorithm?: string;
  }
  
  export function sign(
    payload: string | object | Buffer,
    secretOrPrivateKey: string,
    options?: SignOptions
  ): string;
  
  export function verify(
    token: string,
    secretOrPublicKey: string
  ): any;
}
