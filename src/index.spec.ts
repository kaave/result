/* eslint-disable no-underscore-dangle */
import { err, isErr, isEveryOk, isOk, ok, unwrapErr, unwrapOk, unwrapOr } from '.';
import type { ErrValue, OkValue, Result } from '.';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
async function example() {
  const resultGenerator = <T extends OkValue, E extends ErrValue>({
    ok: okValue,
    err: errValue,
  }: {
    ok: T;
    err: E;
  }): Promise<Result<T, E>> => new Promise((resolve) => resolve(Math.random() >= 0.5 ? ok(okValue) : err(errValue)));

  const result = await resultGenerator({ ok: 42, err: { errorCode: 404, message: 'Not found' } as const });

  // User-defined type guard が機能する
  if (isOk(result)) {
    console.log(unwrapOk(result)); // 42
    // console.log(unwrapErr(result)); // Error!
  } else {
    // console.log(unwrapOk(result)); // Error!
    const { errorCode, message } = unwrapErr(result);
    console.log(errorCode, message); // 404, 'Not found'
  }

  if (!isErr(result)) {
    console.log(unwrapOk(result)); // 42
    // console.log(unwrapErr(result)); // Error!
  }

  // ありそうなユースケースとして、非同期をまとめた際にもうまくいく
  const results = await Promise.all([
    await resultGenerator({ ok: 42, err: { errorCode: 404, message: 'Not found' } }),
    await resultGenerator({ ok: 1, err: { errorCode: 500, message: 'Server error' } }),
  ]);

  if (isEveryOk(results)) {
    // const [fortyTwo, one] = results.map((r) => unwrapOk(r)); // これをやると 42 | 1 の intersection type になっちゃう
    const [wrappingFortyTwo, wrappingOne] = results;
    const fortyTwo = unwrapOk(wrappingFortyTwo); // 42
    const one = unwrapOk(wrappingOne); // 1
    console.log(fortyTwo, one);
    return;
  }

  // ここから下はひとつひとつ見ていってエラー処理
  const [resultFortyTwo, resultOne] = results;
  if (isErr(resultFortyTwo)) {
    // エラー処理
    console.error(resultFortyTwo._error);
  }

  if (isErr(resultOne)) {
    // エラー処理
    console.error(resultOne._error);
  }
}

describe('Result', () => {
  describe('unwrapOr', () => {
    it('Ok の際は Ok の値が返る', () => {
      const value = 42;
      expect(unwrapOr(ok(value), 0)).toBe(value);
    });
    it('Err の際は第2引数が返る', () => {
      const fallback = 42;
      expect(unwrapOr(err(0), fallback)).toBe(fallback);
    });
  });
});
