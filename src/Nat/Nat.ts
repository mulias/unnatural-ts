import {Cast} from './helpers';
import {Not, If} from './Logic';

/**
 * Natural numbers are represented as tuples with known length and arbitrary
 * contents. `[]` is `0`, `[any]` is `1`, etc. Array types such as `any[]`
 * could be thought of as representing infinity, but we deliberately exclude
 * such types for simplicity.
 */
export type Nat = Zero | NonZero;
export type Zero = [];
export type One = [any];
export type NonZero = [any, ...any[]];

// The following operations are non-recursive, //
// so the apply to both big and small Nats.    //

/**
 * Size<Zero> = 0
 * Size<NatNum<12>> = 12
 */
export type Size<N extends Nat> = N['length'];

/**
 * Predecessors<Zero> = never
 * Predecessors<NatNum<5>> = "0" | "1" | "2" | "3" | "4"
 */
export type Predecessors<N extends Nat> = Exclude<keyof N, keyof any[]>;

/**
 * Inc<Zero> = NN<1>
 * Inc<NN<5>> = NN<6>
 */
export type Inc<N extends Nat> = ((head: any, ...args: N) => any) extends ((
  ...args: infer U
) => any)
  ? U
  : N;

/**
 * Dec<Zero> = Zero
 * Inc<NN<5>> = NN<4>
 */
export type Dec<N extends Nat> = ((...t: N) => any) extends ((_: any, ...tail: infer U) => any)
  ? Cast<U, Nat>
  : Zero;

/**
 * IsZero<Zero> = true
 * IsZero<Inc<Zero>> = false
 */
export type IsZero<N extends Nat> = N extends Zero ? true : false;

/**
 * IsNonZero<Zero> = false
 * IsNonZero<Inc<Zero>> = true
 */
export type IsNonZero<N extends Nat> = Not<IsZero<N>>;

/**
 * IsEq<NN<3>, NN<3>> = true
 * IsEq<Zero, NN<6>> = false
 */
export type IsEq<X extends Nat, Y extends Nat> = Size<X> extends Size<Y>
  ? Size<Y> extends Size<X>
    ? true
    : false
  : false;

/**
 * IsGT<NN<3>, NN<3>> = false
 * IsGT<NN<80>, NN<5>> = true
 */
export type IsGT<X extends Nat, Y extends Nat> = Predecessors<Y> extends Predecessors<X>
  ? If<IsEq<X, Y>, false, true>
  : false;

/**
 * IsLT<NN<3>, NN<30>> = true
 * IsLT<NN<51>, NN<50>> = false
 */
export type IsLT<X extends Nat, Y extends Nat> = Predecessors<X> extends Predecessors<Y>
  ? If<IsEq<X, Y>, false, true>
  : false;

/**
 * IsGTE<NN<3>, NN<3>> = true
 * IsGTE<Zero>, Zero> = true
 */
export type IsGTE<X extends Nat, Y extends Nat> = Predecessors<Y> extends Predecessors<X>
  ? true
  : false;

/**
 * IsLTE<NN<3>, NN<3>> = true
 */
export type IsLTE<X extends Nat, Y extends Nat> = Predecessors<X> extends Predecessors<Y>
  ? true
  : false;

/**
 * IsSize<NN<10>, 10> = true
 */
export type IsSize<N extends Nat, Num extends number> = Size<N> extends Num ? true : false;

/**
 *
 */
export type Max<X extends Nat, Y extends Nat> = If<IsGTE<X, Y>, X, Y>;

/**
 *
 */
export type Min<X extends Nat, Y extends Nat> = If<IsLTE<X, Y>, X, Y>;

/**
 * NatToString<Zero> = "0"
 * NatToString<NN<5>> = "5"
 */
export type NatToString<N extends Nat> = Exclude<Predecessors<Inc<N>>, Predecessors<N>>;
