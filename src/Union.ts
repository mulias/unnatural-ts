import {Prepend, EmptyTuple} from './Tuple';
import {IsExact} from './Compare';

/**
 * Types for operating on unions.
 */

type UnionFirst<U> = (U extends any ? (i: (u: U) => void) => void : never) extends
  (i: infer I) => void ? I extends { (e: infer E): void; } ? E : never : never;

type UnionRest<U> = Exclude<U, UnionFirst<U>>;

type UnionToIntersection<U> = (U extends any ? (i: U) => void : never) extends
    (i: infer I) => void ? I : never;

/**
 * Recursive type with depth `UnionSize<U>`.
 */
export type UnionToTuple<U> = UnionToTupleRec<U, EmptyTuple>;

type UnionToTupleRec<U, R extends Tuple> = {
  0: UnionToTupleRec<UnionTail<U>, Prepend<UnionHead<U>, R>>;
  1: R;
}[If<IsExact<U, never>, 1, 0>];

/**
 * Recursive type with depth `UnionSize<U>`.
 */
export type UnionSize<U> = Length<UnionToTuple<U>>;
