import {Nat, Zero} from '../Nat';
import {Size, Inc, Dec, IsZero, IsLT, IsGTE, NatToString} from '../unsafe';
import {CastNat, Or, Not, If} from '../helpers';

/**
 * Construct a Nat representation of a number literal type.
 *
 * NatNum<0> = Zero
 * NatNum<3> = [any, any, any]
 * NatNum<number> = unknown
 */
export type NatNum<N extends number> = number extends N ? unknown : NatNumRec<N, Zero>;
type NatNumRec<N extends number, T extends Nat> = {
  0: NatNumRec<N, Inc<T>>;
  1: T;
}[Size<T> extends N ? 1 : 0];

/**
 * Shorthand for NatNum
 */
export type NN<N extends number> = NatNum<N>;

/**
 * Add two Nats.
 *
 * Add<NN<4>, Zero> = NN<4>
 * Add<NN<10>, NN<4>> = NN<14>
 */
export type Add<X extends Nat, Y extends Nat> = {
  0: Add<Dec<X>, Inc<Y>>;
  1: Y;
  2: X;
}[If<IsZero<X>, 1, If<IsZero<Y>, 2, 0>>];

/**
 * Calculate `X - Y` for two Nat.
 *
 * Sub<NN<4>, Zero> = NN<4>
 * Sub<NN<10>, NN<4>> = NN<6>
 * Sub<NN<4>, NN<8>> = Zero
 */
export type Sub<X extends Nat, Y extends Nat> = {
  0: Sub<Dec<X>, Dec<Y>>;
  1: X;
}[If<Or<IsZero<X>, IsZero<Y>>, 1, 0>];

/**
 * Calculate `X * Y` for two Nat.
 *
 * Mul<NN<5>, NN<3>> = NN<15>
 * Mul<NN<1>, Zero> = Zero
 * Mul<Zero, NN<5>> = Zero
 */
export type Mul<X extends Nat, Y extends Nat> =
  If<IsGTE<X, Y>, MulRec<X, Y, Zero>, MulRec<Y, X, Zero>>;
type MulRec<X extends Nat, Y extends Nat, Z extends Nat> = {
  0: Add<X, Z> extends infer NewZ ? MulRec<X, Dec<Y>, CastNat<NewZ>> : never;
  1: Z;
}[If<IsZero<Y>, 1, 0>];

/**
 * Calculate `X / Y` for two Nat. `X / 0` is 0.
 *
 * Div<NN<5>, NN<3>> = NN<1>
 * Div<NN<5>, NN<6>> = Zero
 * Div<NN<1>, Zero> = Zero
 * Div<Zero, NN<5>> = Zero
 */
export type Div<X extends Nat, Y extends Nat> = If<IsZero<Y>, Zero, DivRec<X, Y>>;
type DivRec<X extends Nat, Y extends Nat> = {
  0: Sub<X, Y> extends infer NewX ? Inc<DivRec<CastNat<NewX>, Y>> : never;
  1: Zero;
}[If<IsLT<X, Y>, 1, 0>];

/**
 * Calculate `X % Y` for two Nat. `X % 0` is X.
 *
 * Mod<NN<5>, NN<3>> = NN<2>
 * Mod<NN<5>, NN<6>> = NN<5>
 * Mod<NN<1>, Zero> = NN<1>
 * Mod<Zero, NN<5>> = Zero
 */
export type Mod<X extends Nat, Y extends Nat> = ModRec<X, Y>;
type ModRec<X extends Nat, Y extends Nat> = Div<X, Y> extends infer D
  ? Mul<CastNat<D>, Y> extends infer M
    ? Sub<X, CastNat<M>>
    : never
  : never;

/**
 * Returns true if X is even, otherwise false.
 *
 * IsEven<NN<Zero>> = true
 * IsEven<NN<11>> = false
 */
export type IsEven<X extends Nat> = Mod<X, [any, any]> extends Zero ? true : false;

/**
 * Returns true if X is odd, otherwise false.
 *
 * IsOdd<NN<1>> = true
 * IsOdd<NN<10>> = false
 */
export type IsOdd<X extends Nat> = Not<IsEven<X>>;

/**
 * Given two Nats X and Y, construct the union type of numbers ranging from
 * Size<X> (inclusive) to Size<Y> (exclusive). If X is greater than or equal to
 * Y then no range is possible and the return is never.
 *
 * NumsInRange<NN<3>, NN<7>> = 3 | 4 | 5 | 6
 * NumsInRange<Zero, Zero> = never
 * NumsInRange<NN<5>, NN<5>> = never
 * NumsInRange<NN<8>, NN<5>> = never
 */
export type NumsInRange<X extends Nat, Y extends Nat> = NumsInRangeRec<X, Y, never>;
type NumsInRangeRec<X extends Nat, Y extends Nat, R> = {
  0: NumsInRangeRec<Inc<X>, Y, R | Size<X>>;
  1: R;
}[If<IsGTE<X, Y>, 1, 0>];

/**
 * Returns a union of all numbers that can index into the tuple T.
 *
 * Indices<['a', 12, true, 9]> = 0 | 1 | 2 |3
 * Indices<[]> = never
 */
export type Indices<T extends Nat> = NumsInRange<Zero, T>;

/**
 * Construct a type that conforms to any tuple that is the same size as N or
 * larger.
 *
 * TupleGTE<NN<3>> = [any, any, any, any, ...any[]]
 * NN<5> extends TupleGTE<NN<3>> ? true : false = true
 * NN<2> extends TupleGTE<NN<3>> ? true : false = false
 */
export type TupleGTE<N extends Nat> =
  If<IsZero<N>, Nat, Add<Dec<N>, [any, ...any[]]>>;

/**
 * Attempt to fine a Nat that corresponds to the string S. Performs a linear
 * search starting from Zero.
 *
 * StringToNat<"0"> = Zero
 * StringToNat<"4"> = NN<4>
 */
export type StringToNat<S extends string> = StringToNatRec<S, Zero>;
type StringToNatRec<S extends string, N extends Nat> = {
  0: StringToNatRec<S, Inc<N>>;
  1: N;
}[S extends NatToString<N> ? 1 : 0];
