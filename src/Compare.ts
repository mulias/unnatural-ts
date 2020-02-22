import {If, And, Or} from './Logic';

/**
 * Utilities for handling type comparisons.
 * Some types based on https://github.com/dsherret/conditional-type-checks
 */

/**
 * Checks if `T` is possibly null or undefined. True when the type or union
 * includes null, undefined, or any.
 */
export type IsNullable<T> =
  Or<IsAny<T>, Extract<T, null | undefined> extends never ? false : true>;

/**
 * Check if `T` extends `U`. This type exactly matches the behavior of
 * `extends`, which is not always intuitive.
 * - `X extends X` is true for all X, including when X is any
 * - Otherwise `any extends X` is `true | false`, since any contains all types,
 *   including both types that do and do not extend X.
 * - `never extends X` is always true, since never is the bottom type
 */
export type IsExtension<T, U> =
  Or<IsNever<T>, T extends U ? true : false>;

/**
 * Check if `T` and `U` are loosely equal. Returns true when the two types are
 * the same, or one of the types is any. Returns false when one of the types is
 * a strict subset of the other, or the two types are completely unrelated.
 */
export type IsEquivalent<T, U> = [T] extends [U] ? [U] extends [T] ? true : false : false;

/**
 * Check if the type `T` exactly matches type `U`. Returns true when the two
 * types are the same. Returns false when one of the types is any or a strict
 * subset of the other type, or when the two types are unrelated.
 */
export type IsExact<T, U> =
  If<And<IsAny<T>, IsAny<U>>, true,
  If<Or<IsAny<T>, IsAny<U>>, false,
  IsEquivalent<T, U>>>;

/**
 * Check if `T` is exactly the `any` type.
 */
export type IsAny<T> =
    If<IsNever<T>, false,
    And<IsExtension<unknown, T>, IsEquivalent<string, T>>>;

/**
 * Returns true if `T` is exactly the `never` type.
 */
export type IsNever<T> = IsEquivalent<T, never>;

/**
 * Returns true if `T` is exactly the `unknown` type.
 */
export type IsUnknown<T> =
  If<IsNever<T>, false,
  If<IsEquivalent<T, string>, false,
  IsEquivalent<T, unknown>>>;
