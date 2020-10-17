declare type ValidUnion = string | number | boolean | symbol | BigInt | ((...args: any[]) => any);
export declare type OkValue = ValidUnion | ReadonlyArray<OkValue> | {
    [K in string | number | symbol]?: OkValue;
} | undefined | null;
export declare type ErrValue = ValidUnion | ReadonlyArray<ErrValue> | {
    [K in string | number | symbol]?: ErrValue;
};
export declare type Ok<T extends OkValue> = {
    readonly _type: 'ok';
    readonly _value: T;
};
export declare type Err<E extends ErrValue> = {
    readonly _type: 'err';
    readonly _error: E;
};
export declare type Result<T, E extends ErrValue> = Ok<T> | Err<E>;
export declare type ExtractOk<T extends Result<O, E>, O extends OkValue, E extends ErrValue> = T extends Ok<infer P> ? Ok<P> : never;
export declare type ExtractErr<T extends Result<O, E>, O extends OkValue, E extends ErrValue> = T extends Err<infer P> ? Err<P> : never;
export declare type ExtractOks<T extends ReadonlyArray<Result<OkValue, ErrValue>>> = {
    [K in keyof T]: T[K] extends Result<infer P, ErrValue> ? (P extends OkValue ? Ok<P> : never) : never;
};
export declare type ExtractErrs<T extends ReadonlyArray<Result<OkValue, ErrValue>>> = {
    [K in keyof T]: T[K] extends Result<OkValue, infer E> ? Err<E> : never;
};
export declare const ok: <T extends OkValue>(value: T) => Ok<T>;
export declare const err: <T extends ErrValue>(error: T) => Err<T>;
export declare const isOk: <T extends OkValue, E extends ErrValue>(r: Result<T, E>) => r is Ok<T>;
export declare const isErr: <T extends OkValue, E extends ErrValue>(r: Result<T, E>) => r is Err<E>;
export declare const isEveryOk: <T extends Result<O, E>[], O extends OkValue, E extends ErrValue>(t: T) => t is ExtractOks<T>;
export declare const unwrapOk: <T extends OkValue>({ _value: value }: Ok<T>) => T;
export declare const unwrapErr: <E extends ErrValue>({ _error: error }: Err<E>) => E;
export declare const unwrapOr: <T extends OkValue, E extends ErrValue>(r: Result<T, E>, fallback: T) => T;
export declare const unwrap: <T extends OkValue, E extends ErrValue>(r: Result<T, E>) => T;
export declare const chain: <T extends OkValue, E extends ErrValue, O extends OkValue>(r: Result<T, E>, f: (t: T) => Ok<O>) => Result<O, E>;
export declare const chainErr: <T extends OkValue, E extends ErrValue, F extends ErrValue>(r: Result<T, E>, f: (t: E) => Err<F>) => Result<T, F>;
export declare const map: <T extends OkValue, E extends ErrValue, O extends OkValue>(r: Result<T, E>, f: (t: T) => O) => Result<O, E>;
export declare const mapErr: <T extends OkValue, E extends ErrValue, F extends ErrValue>(r: Result<T, E>, f: (t: E) => F) => Result<T, F>;
export {};
