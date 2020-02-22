import {Nat, Zero, One} from '../Nat';
import {If} from '../../Logic';
import {IsZero, IsLT, Inc, Dec} from '../unsafe';
import {IsMaxDepth, DecNum} from '../../helpers';
import {DEFAULT_RECURSIVE_DEPTH} from './constants';

/**
 * Calculate `X / Y` for two Nats. Both Nats must have a size less than or
 * equal to 256 or C*32. Dividing by Zero results in Zero.
 *
 * Div<NN<5>, NN<3>> = NN<15>
 * Div<NN<1>, Zero> = Zero
 * Div<Zero, NN<5>> = Zero
 * Div<
 */
export type Div<X extends Nat, Y extends Nat, C extends number = DEFAULT_RECURSIVE_DEPTH> =
  If<IsZero<Y>, Zero,
  If<IsLT<X, Y>, Zero,
  Trampoline<[X, Y, Y, One], C>>>;

/* Incremental recursion for Div.
 *
 * Prerequisites: For `X / Y`, Y must be greater than 0, X must be greater than Y.
 *
 * param Args: a tuple of Nats [X, YY, Y, Z] where:
 * - X starts as the dividend, but will be decremented during the calculation.
 * - YY is the divisor, and will not change between recursive calls.
 * - Y is the counter for the inner subtraction loop, starting at YY,
 *   decrementing to 0, then reseting.
 * - Z is the result, starting at 1 and counting up each time YY is fully
 *   subtracted from X.
 */
type Bounce<Args, C extends number> = Args extends [infer X, infer YY, infer Y, infer Z] ?
  {
    0: Bounce<[Dec<X>, YY, Dec<Y>, Z], DecNum<C>>;
    1: Bounce<[Dec<X>, YY, Dec<YY>, Inc<Z>], DecNum<C>>;
    2: {done: false; val: [X, YY, Y, Z]};
    3: {done: true; val: Z};
  }[
    If<IsLT<X, YY>, 3,
    If<IsMaxDepth<C>, 2,
    If<IsZero<Y>, 1,
    0>>>
  ] : never;

// ===== Recursive helpers =====//

type Trampoline<Args, C extends number> =
    Bounce8<{done: false; val: Args}, C> extends infer T1 ?
    Bounce8<T1, C> extends infer T2 ?
    Bounce8<T2, C> extends infer T3 ?
    Bounce8<T3, C> extends {done: infer D; val: infer V} ?
    D extends true ? V : unknown : never : never : never : never;

type Bounce8<T0, C extends number> =
    Bounce1<T0, C> extends infer T1 ?
    Bounce1<T1, C> extends infer T2 ?
    Bounce1<T2, C> extends infer T3 ?
    Bounce1<T3, C> extends infer T4 ?
    Bounce1<T4, C> extends infer T5 ?
    Bounce1<T5, C> extends infer T6 ?
    Bounce1<T6, C> extends infer T7 ?
    Bounce1<T7, C> : never : never : never : never : never : never : never;

type Bounce1<T0, C extends number> =
    T0 extends {done: infer D; val: infer V} ? D extends true ? T0 : Bounce<V, C> : never;
