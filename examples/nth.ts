import {NN, Indices, TupleGTE} from '../src/unnatural-big';

type T = NN<4>

// /**
//  * `nth` is a ramda function that takes a number `n: N` and an array `a: T[]`,
//  * and returns `a[n]: T | undefined`. We can enhance the types of this function
//  * to better handle tuples.
//  * - For tuples, we want to restrict `n` to values less than the size of the
//  *   tuple, and return the type specific to the tuple index.
//  * - Since this function comes from ramda, we should also support curried
//  *   forms. If the user provides some arbitrary number as the first argument of
//  *   the curried function then the second argument should be a tuple containing
//  *   that index.
//  */

// type AnyTuple = [] | [any, ...any[]];

// // N is constrained to the indices of T
// function nth<N extends Indices<T>, T extends AnyTuple>(n: N, list: T): T[N];

// // non-tuple form
// function nth<T>(n: number, list: ReadonlyArray<T>): T | undefined;

// function nth<N extends number>(n: N): {
//   (list: []): undefined;
//   // T is constrained to tuples of size N or larger
//   <T extends TupleWithIndex<NN<N>>>(list: T): T[N];
//   // non-tuple form
//   <T>(list: ReadonlyArray<T>): T | undefined;
// };

// function nth(n: number, a: any[]) {
//   return a[n];
// }

// const a = nth(2, ['a', 1, true]); // boolean
// const b = nth(5, ['a', 1, true]); // undefined
// const c = nth(0, []); // undefined
// const d = nth(60, [1,2,3,4,5,6] as number[]); // number | undefined

// const e = nth(2)(['a', 1, true]); // boolean
// const f = nth(5)(['a', 1, true]); // undefined

