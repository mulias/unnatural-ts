import {UnionToTuple} from './Union';
import {If, Or, Not} from './Logic';
import {IsExtension, IsExact} from './Compare';
import {Tuple, NonEmptyTuple, EmptyTuple, Head, Tail, TupleKeys, IsEmpty, Prepend} from './Tuple';
import {Cast} from './helpers';

/**
 * Types for operating on indexable/mappable objects, including records,
 * tuples, and arrays.
 */

/**
 * Valid types for an object key.
 */
export type Key = string | number | symbol;

/**
 * An object with any keys and values of type `V`.
 */
export type Dict<V = any> = Record<Key, V>;

/**
 * An object that can't have any values.
 */
export type EmptyObject = Dict<never>;

/**
 * Similar to `keyof T`, but without some confusing behavior.
 */
export type Indices<T> =
  T extends Tuple ? TupleKeys<T>
  : T extends any[] ? number
  : keyof T;

/**
 * Return a tuple containing all the members of `keyof T` in an unspecified
 * order. Recursive type with depth `UnionSize<keyof T>`.
 */
export type KeysTuple<T> = UnionToTuple<keyof T>;

/**
 * Returns a union of the types of the props of `T`.
 */
export type Values<T> = T[Cast<Indices<T>, keyof T>];

/**
 * Return the prop type for the key `K` in `T`.
 */
export type Prop<K extends keyof T, T> = T[K];

/**
 * Return the prop type for the key `K` in `T`, if at least one
 * possible variant of `T` is an object with `K`. If no variants of
 * `T` contain `K` return never.
 */
export type MaybeProp<K extends Key, T> = Extract<T, Record<K, any>>[K];

/**
 * Apply `Exclude` to each prop of `T`.
 */
export type MapExclude<E, T> = {[K in keyof T]: Exclude<T[K], E>};

/**
 * Apply `Extract` to each prop of `T`.
 */
export type MapExtract<E, T> = {[K in keyof T]: Extract<T[K], E>};

/**
 * If `T` has a prop with key `P`, change the prop type to `E`. If `T` does not
 * yet have a prop with key `P`, add it with type `E`.
 */
export type SetProp<P extends Key, E, T> = {[K in P | keyof T]:
  K extends P ? E :
  K extends keyof T ? T[K] :
  never
};

/**
 * Set all prop types in `T` to `E`.
 */
export type SetAll<E, T> = {[k in keyof T]: E};

/**
 * Merge the objects `T` and `U`. If a key appears in both, the value of `U`
 * overrides the value of `T`.
 */
export type Merge<T, U> = { [K in keyof T | keyof U]:
  K extends keyof U ? U[K] :
  K extends keyof T ? T[K] :
  never
};

/**
 * Merge the objects in the tuple `T` together from left to right. Recursive
 * type with depth `Length<T>`.
 */
export type MergeAll<T extends NonEmptyTuple> = MergeAllRec<Tail<T>, Head<T>>;

type MergeAllRec<T extends Tuple, R> = {
  0: MergeAllRec<Tail<T>, Merge<R, Head<T>>>;
  1: R;
}[If<IsEmpty<T>, 1, 0>];

/**
 * Returns true if `E` extends at least one prop in `T`.
 */
export type AnyExtend<E, T> = IsExtension<E, Values<T>>;

/**
 * Returns true if `E` extends all prop in `T`.
 */
export type AllExtend<E, T> = IsExact<E, Values<T>>;

/**
 * Returns true if `E` does not extend any of the prop in `T`.
 */
export type NoneExtend<E, T> = Not<AnyExtend<E, T>>;

/**
 * Return keys of `T` which correspond to props that `E` extends.
 */
export type KeysExtending<E, T> = {[K in keyof T]: E extends T[K] ? K : never}[keyof T];

/**
 * Given an object `T` with values that are valid keys, return the inverted
 * object where the values and keys are switched.
 *
 * ```
 * type T0 = {
 *   a: 'c' | 'd';
 *   b: 'd' | 'e';
 * }
 * type T1 = Invert<T0>
 * // {
 * //   c: 'a';
 * //   d: 'a' | 'b';
 * //   e: 'b';
 * // }
 *
 * type T2 = {[x: string]: number}
 * type T3 = Invert<T2> // {[x: number]: string}
 * ```
 */
export type Invert<T extends Record<Key, Key>> =
    T extends Record<any, infer V> ?
    {[VK in (V extends Key ? V : never)]: KeysExtending<VK, T>}
    : never;

/**
 * Return a tuple containing
 * Recursive type with depth `UnionSize<keyof T>`.
 */
export type ToPairs<T> =
  KeysTuple<T> extends infer KeysT
  ? ToPairsRec<T, Cast<KeysT, Tuple<keyof T>>, EmptyTuple>
  : never;

type ToPairsRec<T, KeysT extends Tuple<keyof T>, R extends Tuple> = {
  0: ToPairsRec<T, Tail<KeysT>, Prepend<[Head<KeysT>, T[Cast<Head<KeysT>, keyof T>]], R>>;
  1: R;
}[If<IsEmpty<KeysT>, 1, 0>];

/**
 * Return the type of the prop found at the end of `Path`. If the path does not
 * exist in `T`, returns never. The path is considered traversable if it exists
 * in all variants of `T`. Recursive type with depth `Length<Path>`.
 */
export type StrictTraversal<Path extends Tuple<Key>, T> = {
  0: Head<Path> extends infer H ? H extends keyof T ?
    StrictTraversal<Tail<Path>, T[H]> : never : never;
  1: T;
}[If<IsEmpty<Path>, 1, 0>];

/**
 * Return the type of the prop found at the end of the given path. If the path
 * does not exist in `T`, returns never. The path is considered traversable if
 * it exists in at least one variant of `T`. Recursive type with depth
 * `Length<Path>`.
 */
export type Traversal<Path extends Tuple<Key>, T> = {
  0: Traversal<Tail<Path>, MaybeProp<Cast<Head<Path>, Key>, T>>;
  1: T;
}[If<Or<IsExact<T, never>, IsEmpty<Path>>, 1, 0>];

/**
 * Recursive type with depth `Length<Path>`.
 */
export type ObjectWithStrictPath<Path extends Tuple<Key>> = {
  0: {[k in Cast<Head<Path>, Key>]: ObjectWithStrictPath<Tail<Path>>};
  1: any;
}[If<IsEmpty<Path>, 1, 0>];
