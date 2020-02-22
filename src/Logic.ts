import {Tuple, Find} from './Tuple';
import {AllExtend, AnyExtend} from './Object';

/**
 * Types for operating on the `true`/`false` boolean literal values.
 */

/**
 * Calculate `X && Y`.
 */
export type And<X extends boolean, Y extends boolean> = X extends true ? (Y extends true ? true : false) : false;

/**
 * Calculate `X || Y`.
 */
export type Or<X extends boolean, Y extends boolean> = X extends true ? true : Y extends true ? true : false;

/**
 * Calculate `!X`.
 */
export type Not<X extends boolean> = X extends true ? false : true;

/**
 * Given a boolean `Test`, return the `Then` case when `Test` is true, and
 * return the `Else` case when `Test` is false. If `Test` is the boolean type
 * then we return unknown to signal a malformed test.
 */
export type If<Test extends boolean, Then, Else> =
  Test extends true ? Then
  : Test extends false ? Else
  : unknown;

/**
 * Given a tuple `T` of `[Test, Consequent]` pairs, return the first
 * `Consequent` that has a `Test` value that is true. Recursive type with max
 * depth `Length<T>`.
 */
export type Cond<T extends Tuple<[boolean, any]>> =
  Find<[true, any], T> extends [true, infer R] ? R : undefined;

/**
 * Given a tuple `T` of booleans, return true if all are true, otherwise return
 * false.
 */
export type AllPass<T extends Tuple<boolean>> = AllExtend<true, T>;

/**
 * Given a tuple `T` of booleans, return true if at least one is true,
 * otherwise return false.
 */
export type AnyPass<T extends Tuple<boolean>> = AnyExtend<true, T>;
