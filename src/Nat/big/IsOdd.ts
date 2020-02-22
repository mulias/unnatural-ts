import {Nat} from '../Nat';
import {Not} from '../../Logic';
import {IsEven} from './IsEven';
import {DEFAULT_RECURSIVE_DEPTH} from './constants';

/**
 * Returns true if X is odd, otherwise false. X must be less than or equal to
 * 256 or C*32.
 *
 * IsOdd<NN<30>> = false
 * IsOdd<NN<11>> = true
 */
export type IsOdd<X extends Nat, C extends number = DEFAULT_RECURSIVE_DEPTH> =
  Not<IsEven<X, C>>;
