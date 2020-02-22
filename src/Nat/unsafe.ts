import * as Nat from './Nat';
import {Cast, CastNat} from '../helpers';

/* Due to extensive use of `infer` to save temporary type variables, there are
 * many situations where type information about a type variable is lost in a
 * recursive type. Because the types we're dealing with in these contexts are
 * quite simple -- almost always Nat, sometimes number -- it's easier to alias
 * the utilities we need instead of littering the code with `Inc<Cast<X, Nat>>`
 * every times.
 */
export type Size<N> = Nat.Size<CastNat<N>>;
export type Predecessors<N> = Nat.Predecessors<CastNat<N>>;
export type Inc<N> = Nat.Inc<CastNat<N>>;
export type Dec<N> = Nat.Dec<CastNat<N>>;
export type IsZero<N> = Nat.IsZero<CastNat<N>>;
export type IsNonZero<N> = Nat.IsNonZero<CastNat<N>>;
export type IsEq<X, Y> = Nat.IsEq<CastNat<X>, CastNat<Y>>;
export type IsGT<X, Y> = Nat.IsGT<CastNat<X>, CastNat<Y>>;
export type IsLT<X, Y> = Nat.IsLT<CastNat<X>, CastNat<Y>>;
export type IsGTE<X, Y> = Nat.IsGTE<CastNat<X>, CastNat<Y>>;
export type IsLTE<X, Y> = Nat.IsLTE<CastNat<X>, CastNat<Y>>;
export type IsSize<N, Num> = Nat.IsSize<CastNat<N>, Cast<Num, number>>;
export type NatToString<N> = Nat.NatToString<CastNat<N>>;
