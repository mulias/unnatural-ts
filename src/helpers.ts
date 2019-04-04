import {Nat} from './Nat';

export type Cast<X, Y> = X extends Y ? X : Y;

export type CastNat<X> = X extends Nat ? X : Nat;

export type And<X, Y> = X extends true ? (Y extends true ? true : false) : false;

export type Or<X, Y> = X extends true ? true : Y extends true ? true : false;

export type Not<X extends boolean> = X extends true ? false : true;

export type If<Test extends boolean, Then, Else> = Test extends true ? Then : Else;

export type IsMaxDepth<N extends number> = N extends 0 ? true : false;

export type DecNum<N extends number> = Countdown[N];

type Countdown = [
  0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
  31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
  41, 42, 43, 44, 45, 46, 47, 48, 49, 50
];
