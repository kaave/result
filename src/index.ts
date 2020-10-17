/* eslint-disable no-underscore-dangle */
type ValidUnion = string | number | boolean | symbol | BigInt | ((...args: any[]) => any);
export type OkValue =
  | ValidUnion
  | ReadonlyArray<OkValue>
  | { [K in string | number | symbol]?: OkValue }
  | undefined
  | null;
export type ErrValue = ValidUnion | ReadonlyArray<ErrValue> | { [K in string | number | symbol]?: ErrValue };

export type Ok<T extends OkValue> = { readonly _type: 'ok'; readonly _value: T };
export type Err<E extends ErrValue> = { readonly _type: 'err'; readonly _error: E };

/*
 * TODO: ExtractOks が壊れる
 */
// export type Result<T extends OkValue, E extends ErrValue> = Ok<T> | Err<E>;
export type Result<T, E extends ErrValue> = Ok<T> | Err<E>;

// eslint-disable-next-line no-use-before-define
export type ExtractOk<T extends Result<O, E>, O extends OkValue, E extends ErrValue> = T extends Ok<infer P>
  ? Ok<P>
  : never;
// eslint-disable-next-line no-use-before-define
export type ExtractErr<T extends Result<O, E>, O extends OkValue, E extends ErrValue> = T extends Err<infer P>
  ? Err<P>
  : never;
export type ExtractOks<T extends ReadonlyArray<Result<OkValue, ErrValue>>> = {
  [K in keyof T]: T[K] extends Result<infer P, ErrValue> ? (P extends OkValue ? Ok<P> : never) : never;
};
export type ExtractErrs<T extends ReadonlyArray<Result<OkValue, ErrValue>>> = {
  [K in keyof T]: T[K] extends Result<OkValue, infer E> ? Err<E> : never;
};

export const ok = <T extends OkValue>(value: T): Ok<T> => ({ _type: 'ok', _value: value });
export const err = <T extends ErrValue>(error: T): Err<T> => ({ _type: 'err', _error: error });

export const isOk = <T extends OkValue, E extends ErrValue>(r: Result<T, E>): r is Ok<T> => r._type === 'ok';
export const isErr = <T extends OkValue, E extends ErrValue>(r: Result<T, E>): r is Err<E> => !isOk(r);
// eslint-disable-next-line no-use-before-define
export const isEveryOk = <T extends Result<O, E>[], O extends OkValue, E extends ErrValue>(t: T): t is ExtractOks<T> =>
  t.every((r) => isOk(r));

/**
 * @FIXME わからん
 * A type predicate's type must be assignable to its parameter's type.
 * Type 'ExtractErrs<T>' is not assignable to type 'T'.
 * 'ExtractErrs<T>' is assignable to the constraint of type 'T',
 * but 'T' could be instantiated with a different subtype of constraint 'Result<ValidValue, Error>[]'.
 * Type 'T[K] extends Result<ValidValue, infer E> ? Err<E> : never' is not assignable to type 'T[K]'.
 * Type 'Err<Error>' is not assignable to type 'T[K]'.ts(2677)
 */
// export const isEveryErr = <T extends Result<ValidValue, ResultValue>[]>(t: T): t is ExtractErrs<T> =>
//   t.every((r) => isErr(r));
// export const byErr = <E extends ResultValue, T extends Result<ValidValue, E>>(t: T): t is Err<E> => isErr(t);

export const unwrapOk = <T extends OkValue>({ _value: value }: Ok<T>): T => value;
export const unwrapErr = <E extends ErrValue>({ _error: error }: Err<E>): E => error;
export const unwrapOr = <T extends OkValue, E extends ErrValue>(r: Result<T, E>, fallback: T): T =>
  isOk(r) ? r._value : fallback;

/**
 * @deprecated unwrapOk, unwrapErr, unwrapOr のいずれかを使用するべき
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const unwrap = <T extends OkValue, E extends ErrValue>(r: Result<T, E>) => {
  if (isErr(r)) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    throw new Error(`Not Ok result. [${r._error}]`);
  }

  return r._value;
};

export const chain = <T extends OkValue, E extends ErrValue, O extends OkValue>(
  r: Result<T, E>,
  f: (t: T) => Ok<O>,
): Result<O, E> => (isOk(r) ? f(unwrapOk(r)) : r);

export const chainErr = <T extends OkValue, E extends ErrValue, F extends ErrValue>(
  r: Result<T, E>,
  f: (t: E) => Err<F>,
): Result<T, F> => (isErr(r) ? f(unwrapErr(r)) : r);

export const map = <T extends OkValue, E extends ErrValue, O extends OkValue>(
  r: Result<T, E>,
  f: (t: T) => O,
): Result<O, E> => (isOk(r) ? ok(f(unwrapOk(r))) : r);

export const mapErr = <T extends OkValue, E extends ErrValue, F extends ErrValue>(
  r: Result<T, E>,
  f: (t: E) => F,
): Result<T, F> => (isErr(r) ? err(f(unwrapErr(r))) : r);
