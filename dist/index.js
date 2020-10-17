"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapErr = exports.map = exports.chainErr = exports.chain = exports.unwrap = exports.unwrapOr = exports.unwrapErr = exports.unwrapOk = exports.isEveryOk = exports.isErr = exports.isOk = exports.err = exports.ok = void 0;
exports.ok = (value) => ({ _type: 'ok', _value: value });
exports.err = (error) => ({ _type: 'err', _error: error });
exports.isOk = (r) => r._type === 'ok';
exports.isErr = (r) => !exports.isOk(r);
exports.isEveryOk = (t) => t.every((r) => exports.isOk(r));
exports.unwrapOk = ({ _value: value }) => value;
exports.unwrapErr = ({ _error: error }) => error;
exports.unwrapOr = (r, fallback) => exports.isOk(r) ? r._value : fallback;
exports.unwrap = (r) => {
    if (exports.isErr(r)) {
        throw new Error(`Not Ok result. [${r._error}]`);
    }
    return r._value;
};
exports.chain = (r, f) => (exports.isOk(r) ? f(exports.unwrapOk(r)) : r);
exports.chainErr = (r, f) => (exports.isErr(r) ? f(exports.unwrapErr(r)) : r);
exports.map = (r, f) => (exports.isOk(r) ? exports.ok(f(exports.unwrapOk(r))) : r);
exports.mapErr = (r, f) => (exports.isErr(r) ? exports.err(f(exports.unwrapErr(r))) : r);
