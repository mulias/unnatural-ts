import {Cast} from './helpers';
import {If, Not, And, Or} from './Logic';

export type RemoveUndefined<T> = { [t in keyof T]: Exclude<T[t], undefined> };

export type Tuple<T = any> = EmptyTuple | MaybeEmptyTuple<T> | NonEmptyTuple<T>;
export type EmptyTuple = [];
export type MaybeEmptyTuple<T = any> = [T?, ...T[]];
export type NonEmptyTuple<T = any> = [T, ...T[]];

/**
 * True if `T` is the tuple `[]`, otherwise false.
 */
export type IsEmpty<T extends Tuple> = IsLength<T, 0>;

/**
 * True if `T` has a non-zero length, otherwise false.
 */
export type IsNonEmpty<T extends Tuple> = Not<IsEmpty<T>>;

/**
 * True if `T` is a tuple, otherwise false.
 */
export type IsTuple<T> = T extends Tuple ? true : false;

/**
 * Returns only the specific positional keys "0", "1", "2", etc.
 * `TupleKeys<[]>` returns never.
 */
export type TupleKeys<T extends Tuple> = Exclude<keyof T, keyof any[]>;

/**
 * Returns the tuple length as a number literal, 0, 1, 2, ect.
 */
export type Length<T extends Tuple> = T['length'];

/**
 * Make all values of `T` required, while keeping the resulting type a tuple.
 */
export type RequiredTuple<T extends Tuple> = Cast<Required<T>, Tuple>;

/**
 * Make all values of `T` optional, while keeping the resulting type a tuple.
 */
export type PartialTuple<T extends Tuple> = Cast<Partial<T>, Tuple>;

/**
 * True if the tuples `T` and U have the same length, otherwise false.
 */
export type IsLengthEq<T extends Tuple, U extends Tuple> = Length<T> extends Length<U>
  ? Length<U> extends Length<T> ? true : false
  : false;

/**
 * True if the length of `T` is strictly greater than the length of `U`.
 */
export type IsLengthGT<T extends Tuple, U extends Tuple> = TupleKeys<U> extends TupleKeys<T>
  ? If<IsLengthEq<T, U>, false, true>
  : false;

/**
 * True if the length of `T` is strictly less than the length of `U`.
 */
export type IsLengthLT<T extends Tuple, U extends Tuple> = TupleKeys<T> extends TupleKeys<U>
  ? If<IsLengthEq<T, U>, false, true>
  : false;

/**
 * True if the length of `T` is greater than or equal to the length of `U`.
 */
export type IsLengthGTE<T extends Tuple, U extends Tuple> = TupleKeys<U> extends TupleKeys<T>
  ? true : false;

/**
 * True if the length of `T` is less than or equal to the length of `U`.
 */
export type IsLengthLTE<T extends Tuple, U extends Tuple> = TupleKeys<T> extends TupleKeys<U>
  ? true : false;

/**
 * True if `Length<T>` is equal to the number literal `N`.
 */
export type IsLength<T extends Tuple, N extends number> = Length<T> extends N ? true : false;

/**
 * If `T` is non-empty return the first element, otherwise return undefined.
 */
export type Head<T extends Tuple> = T[0];

/**
 * If `T` is non-empty return the remaining tuple without the head. If `T` is empty
 * return the empty tuple.
 */
export type Tail<T extends Tuple> =
  ((...t: T) => void) extends (x: any, ...t: infer R) => void ? R extends Tuple ? R : never : never;

/**
 * True if the tuple contains an element which can be returned by `Head<T>`.
 */
export type HasHead<T extends Tuple> = IsNonEmpty<T>;

/**
 * True if the tuple contains an element which can be returned by `Tail<T>`.
 */
export type HasTail<T extends Tuple> = Length<T> extends 0 | 1 ? false : true;

/**
 * If `T` is non-empty return the last element, otherwise return undefined.
 */
export type Last<T extends Tuple> = T[Length<Tail<T>>];

/**
 * If `T` is non-empty return the remaining tuple without the last element. If `T`
 * is empty return the empty tuple. Recursive type with depth `Length<T>`.
 */
export type Init<T extends Tuple> =
  Reverse<T> extends infer R ? R extends Tuple ? Reverse<Tail<R>> : never : never;

/**
 * True if the tuple contains an element which can be returned by `Last<T>`.
 */
export type HasLast<T extends Tuple> = HasHead<T>;

/**
 * True if the tuple contains an element which can be returned by `Init<T>`.
 */
export type HasInit<T extends Tuple> = HasTail<T>;

/**
 * Add a new element `E` to the front of the tuple `T`.
 */
export type Prepend<E, T extends Tuple> =
  ((head: E, ...args: T) => any) extends ((...args: infer U) => any) ? U extends Tuple ? U : never : never;

/**
 * Add a new element `E` to the end of the tuple `T`. Recursive type with depth
 * `Length<T> + 1`.
 */
export type Append<E, T extends Tuple> =
  Reverse<T> extends infer R ? R extends Tuple ? Reverse<Prepend<E, R>> : never : never;

/**
 * Reverse all elements in the tuple `T`. Recursive type with depth
 * `Length<T>`.
 */
export type Reverse<T extends Tuple> = ReverseRec<T, EmptyTuple>;

type ReverseRec<T extends Tuple, R extends Tuple> = {
  0: ReverseRec<Tail<T>, Prepend<Head<T>, R>>;
  1: R;
}[If<IsEmpty<T>, 1, 0>];

/**
 * Construct a tuple with all the elements of `T`, then all the elements of
 * `U`. Recursive type with depth `Length<T>`.
 */
export type Concat<T extends Tuple, U extends Tuple> =
  Reverse<T> extends infer T1 ? T1 extends Tuple ?
  ConcatRec<T1, U> extends infer T2 ? T2 extends Tuple ? T2
  : never : never : never : never;

type ConcatRec<T extends Tuple, U extends Tuple> = {
  0: ConcatRec<Tail<T>, Prepend<Head<T>, U>>;
  1: U;
}[If<IsEmpty<T>, 1, 0>];

/**
 * Return a tuple with all of the required elements from the start of `T`.
 * Recursive type with depth `Length<T>`.
 */
export type RequiredInit<T extends Tuple> =
  RequiredInitRec<T, EmptyTuple> extends infer T1 ? T1 extends Tuple ? Reverse<T1> : never : never;

type RequiredInitRec<T extends Tuple, R extends Tuple> = {
  0: RequiredInitRec<Tail<T>, Prepend<Head<T>, R>>;
  1: R;
}[T extends [any, ...any[]] ? 0 : 1];

/**
 * Return a tuple with all of the optional elements from the end of the tuple.
 * Recursive type with max depth `Length<T>`.
 */
export type OptionalTail<T extends Tuple> = PartialTuple<OptionalTailRec<T>>;

type OptionalTailRec<T extends Tuple> = {
  0: OptionalTailRec<Tail<T>>;
  1: T;
}[T extends [any, ...any[]] ? 0 : 1];

/**
 * A union of number literals ranging from 0 to `Length<T>` exclusive.
 * `Indices<[]>` returns never. Recursive type with depth `Length<T>`.
 */
export type Indices<T extends Tuple> = IndicesRec<T, never>;

type IndicesRec<T extends Tuple, I extends number> = {
  0: IndicesRec<Tail<T>, Length<Tail<T>> | I>;
  1: I;
}[If<IsEmpty<T>, 1, 0>];

/**
 * A union of number literals ranging from 0 to `Length<T>` inclusive.
 * `UpToLength<[]>` returns 0. Recursive type with depth `Length<T>`.
 */
export type UpToLength<T extends Tuple> = Indices<T> | Length<T>;

/**
 * Construct a tuple containing the first `N` elements of `T`. Recursive type with
 * depth `N`.
 */
export type Take<N extends UpToLength<T>, T extends Tuple> =
  TakeRec<N, T, EmptyTuple> extends infer T1 ? T1 extends Tuple ? Reverse<T1> : never : never;

type TakeRec<N extends number, T extends Tuple, R extends Tuple> = {
  0: TakeRec<N, Tail<T>, Prepend<Head<T>, R>>;
  1: R;
}[If<Or<IsEmpty<T>, IsLength<R, N>>, 1, 0>];

/**
 * Construct a tuple containing the last `N` elements of `T`. Recursive type with
 * depth `N`.
 */
export type TakeLast<N extends UpToLength<T>, T extends Tuple> =
  Reverse<T> extends infer T1 ? T1 extends Tuple ? TakeLastRec<N, T1, EmptyTuple> : never : never;

type TakeLastRec<N extends number, T extends Tuple, R extends Tuple> = {
  0: TakeLastRec<N, Tail<T>, Prepend<Head<T>, R>>;
  1: R;
}[If<Or<IsEmpty<T>, IsLength<R, N>>, 1, 0>];

/**
 * Recursive type with depth `N`.
 */
export type TakeUntil<N extends Indices<T>, T extends Tuple> =
  TakeUntilRec<N, T, EmptyTuple> extends infer T1 ? T1 extends Tuple ? Reverse<T1> : never : never;

type TakeUntilRec<N extends number, T extends Tuple, R extends Tuple> = {
  0: TakeUntilRec<N, Tail<T>, Prepend<Head<T>, R>>;
  1: R;
}[If<IsLength<R, N>, 1, 0>];

/**
 * Recursive type with depth `N`.
 */
export type TakeFrom<N extends Indices<T>, T extends Tuple> = TakeFromRec<N, T, EmptyTuple>;

type TakeFromRec<N extends number, T extends Tuple, R extends Tuple> = {
  0: TakeFromRec<N, Tail<T>, Prepend<Head<T>, R>>;
  1: T;
}[If<IsLength<R, N>, 1, 0>];

/**
 *
 * Recursive type with depth `N`.
 */
export type SplitAt<N extends Indices<T>, T extends Tuple> =
  TakeUntil<N, T> extends infer T1 ?
  TakeFrom<N, T> extends infer T2 ?
  T1 extends Tuple ? T2 extends Tuple ?
  [T1, T2] : never : never : never : never;

/**
 *
 * Recursive type with depth `N`.
 */
export type PartialFrom<N extends Indices<T>, T extends Tuple> =
  SplitAt<N, T> extends [infer T1, infer T2] ?
  T1 extends Tuple ? T2 extends Tuple ?
  Concat<RequiredTuple<T1>, PartialTuple<T2>>
  : never : never : never;

/**
 *
 */
export type Nth<N extends Indices<T>, T extends Tuple> = T[N];

/**
 *
 * Recursive type with depth `Length<T>`.
 */
export type SetAt<N extends Indices<T>, U, T extends Tuple> =
  SetAtRec<N, U, T, EmptyTuple> extends infer T1 ? T1 extends Tuple ? Reverse<T1> : never : never;

type SetAtRec<N extends number, U, T extends Tuple, R extends Tuple> = {
  0: SetAtRec<N, U, Tail<T>, Prepend<Head<T>, R>>;
  1: SetAtRec<N, U, Tail<T>, Prepend<U, R>>;
  2: R;
}[
  If<IsEmpty<T>, 2,
  If<IsLength<R, N>, 1,
  0>>
];

/**
 *
 * Recursive type with depth `Length<T>`.
 */
export type InsertAt<N extends Indices<T>, U, T extends Tuple> =
  InsertAtRec<N, U, T, EmptyTuple> extends infer T1 ? T1 extends Tuple ? Reverse<T1> : never : never;

type InsertAtRec<N extends number, U, T extends Tuple, R extends Tuple> = {
  0: InsertAtRec<N, U, Tail<T>, Prepend<Head<T>, R>>;
  1: InsertAtRec<N, U, T, Prepend<U, R>>;
  2: R;
}[
  If<IsEmpty<T>, 2,
  If<IsLength<R, N>, 1,
  0>>
];

/**
 * Insert all the elements of `U` into `T`, starting with the first element of
 * `U` at index `N` of `T`. Recursive type with depth `Length<T> + Length<U>`.
 */
export type InsertAllAt<N extends Indices<T>, U extends Tuple, T extends Tuple> =
  Reverse<U> extends infer U1 ? U1 extends Tuple ?
  Reverse<T> extends infer T1 ? T1 extends Tuple ?
  InsertAllAtRec<N, U1, T1, EmptyTuple> : never : never : never : never;

type InsertAllAtRec<N extends number, U extends Tuple, T extends Tuple, R extends Tuple> = {
  0: InsertAllAtRec<N, U, Tail<T>, Prepend<Head<T>, R>>;
  1: InsertAllAtRec<N, Tail<U>, T, Prepend<Head<U>, R>>;
  2: R;
}[
  If<IsEmpty<T>, 2,
  If<And<IsNonEmpty<U>, IsLength<T, N>>, 1,
  0>>
];

/**
 *
 * Recursive type with depth `Length<T>`.
 */
export type DropAt<N extends Indices<T>, T extends Tuple> =
  DropAtRec<N, false, T, EmptyTuple> extends infer T1 ? T1 extends Tuple ? Reverse<T1> : never : never;

type DropAtRec<N extends number, Dropped extends boolean, T extends Tuple, R extends Tuple> = {
  0: DropAtRec<N, Dropped, Tail<T>, Prepend<Head<T>, R>>;
  1: DropAtRec<N, true, Tail<T>, R>;
  2: R;
}[
  If<Or<IsEmpty<T>, And<IsLength<T, 1>, IsLength<R, N>>>, 2,
  If<And<IsLength<R, N>, Not<Dropped>>, 1,
  0>>
];

/**
 *
 * Recursive type with depth `Length<T>`.
 */
export type FillToLength<N extends number, Fill, T extends Tuple> =
  number extends N ? unknown :
  FillToLengthRec<N, Fill, T, EmptyTuple> extends infer R ?
  R extends Tuple ?
  If<IsLengthGT<T, R>, T, R>
  : never : never;

type FillToLengthRec<N extends number, Fill, T extends Tuple, R extends Tuple> = {
  0: If<IsEmpty<T>,
  FillToLengthRec<N, Fill, T, Prepend<Fill, R>>,
  FillToLengthRec<N, Fill, Tail<T>, Prepend<Head<T>, R >>>;
  1: R;
}[If<IsLength<R, N>, 1, 0>];

/**
 *
 * Recursive type with depth `Length<T>`.
 */
export type TupleN<N extends number, Fill = any> =
  number extends N ? unknown : FillToLength<N, Fill, EmptyTuple>;

/**
 *
 * Recursive type with depth `Length<T>`.
 */
export type TupleLengthGTE<T extends Tuple> =
  Concat<TupleLengthEq<Tail<T>>, [any, ...any[]]>;

/**
 *
 * Recursive type with depth `Length<T>`.
 */
export type TupleLengthLTE<T extends Tuple> = TupleLengthLTERec<TupleLengthEq<T>, TupleLengthEq<T>>;
type TupleLengthLTERec<T extends Tuple, R extends Tuple> = {
  0: TupleLengthLTERec<Tail<T>, Tail<T> | R>;
  1: R;
}[If<IsEmpty<T>, 1, 0>];

/**
 *
 */
export type SetAll<U, T extends Tuple> = Cast<{ [t in keyof T]: U }, Tuple>;

/**
 *
 */
export type TupleLengthEq<T extends Tuple> = SetAll<any, T>;

/**
 *
 * Recursive type with depth `Length<T>`.
 */
export type TupleRepeat<N extends number, Fill extends NonEmptyTuple> =
  number extends N ? Array<Fill[number]> :
  ToupleRepeatRec<N, EmptyTuple, Fill, Fill> extends infer T ?
  T extends Tuple ?
  Reverse<T>
  : never : never;

type ToupleRepeatRec<N extends number, T extends Tuple, Fill extends NonEmptyTuple, F extends Tuple> = {
  0: If<IsEmpty<F>,
  ToupleRepeatRec<N, Prepend<Head<Fill>, T>, Fill, Tail<Fill>>,
  ToupleRepeatRec<N, Prepend<Head<F>, T>, Fill, Tail<F>>>;
  1: T;
}[If<IsLength<T, N>, 1, 0>];

/**
 *
 * Recursive type with depth `Length<T>`.
 */
export type ZipTuples<T extends Tuple, U extends Tuple, Fill = any> =
  ZipTuplesRec<T, U, Fill, EmptyTuple> extends infer R ? R extends Tuple ? Reverse<R> : never : never;

type ZipTuplesRec<T extends Tuple, U extends Tuple, Fill, R extends Tuple> = {
  0: ZipTuplesRec<
  Tail<T>,
  Tail<U>,
  Fill,
  Prepend<[If<HasHead<T>, Head<T>, Fill>, If<HasHead<U>, Head<U>, Fill>], R>
  >;
  1: R;
}[If<And<IsEmpty<T>, IsEmpty<U>>, 1, 0>];

/**
 * Recursive type with depth `Length<T>`.
 */
export type Find<U, T extends Tuple, Default = undefined> = FindRec<U, T, Default>;

type FindRec<U, T extends Tuple, Default> = {
  0: Head<T> extends U ? Head<T> : FindRec<U, Tail<T>, Default>;
  1: Default;
}[If<IsEmpty<T>, 1, 0>];

/**
 * Recursive type with depth `Length<T>`.
 */
type FromPairs<T extends NonEmptyTuple<[Key, any]>> =
  FromPairs<Tail<T>, Record<Head<T>[0], Head<T>[1]>>;

type FromPairsRec<T extends Tuple<[Key, any]>, R extends Record<Key, any>> = {
  0: FromPairsRec<Tail<T>, SetProp<Head<T>[0], Head<T>[1], R>>;
  1: U;
}[If<IsEmpty<T>, 1, 0>];
