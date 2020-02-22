import {Nat, Zero} from '../Nat';
import {Mod} from './Mod';
import {DEFAULT_RECURSIVE_DEPTH} from './constants';

/**
 * Returns true if X is even, otherwise false. X must be less than or equal to
 * 256 or C*32.
 *
 * IsEven<Zero> = true
 * IsEven<NN<11>> = false
 */
export type IsEven<X extends Nat, C extends number = DEFAULT_RECURSIVE_DEPTH> =
  Mod<X, [any, any], C> extends Zero ? true : false;
