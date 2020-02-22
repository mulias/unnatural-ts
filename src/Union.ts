import {Tuple, Length, Prepend, EmptyTuple} from './Tuple';
import {If} from './Logic';
import {IsExact} from './Compare';
import {Cast} from './helpers';

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
  0: UnionToTupleRec<UnionRest<U>, Prepend<UnionFirst<U>, R>>;
  1: R;
}[If<IsExact<U, never>, 1, 0>];

/**
 * Recursive type with depth `UnionSize<U>`.
 */
export type UnionSize<U> = UnionToTuple<U> extends infer T ? Length<Cast<T, Tuple>> : never;
