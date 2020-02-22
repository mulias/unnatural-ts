import {Assert} from '../src/Assert';
import {IsExtension, IsExact} from '../src/Compare';
import {
  Reverse, Init, RequiredInit, OptionalTail, Concat, TakeLast, SetAt, TakeUntil,
  TakeFrom, PartialFrom, FillToLength, TupleN, TupleLengthGTE, TupleRepeat, Tail,
  ZipTuples, TupleLengthEq, SetAll, TupleLengthLTE, InsertAt, InsertAllAt, DropAt
} from '../src/Tuple';

// IsEmpty
// IsNonEmpty
// IsTuple
// TupleKeys
// Length
// RequiredTuple
// PartialTuple
// IsLengthEq
// IsLengthGT
// IsLengthLT
// IsLengthGTE
// IsLengthLTE
// IsLength
// Head
// Tail
type T18 = Assert<IsExact<Tail<[]>, []>, true>;
// HasHead
// HasTail
// Last
// Init
type T01 = Assert<IsExact<Init<[1, 2, 3]>, [1, 2]>, true>;
// HasLast
// HasInit
// Prepend
// Append
// Reverse
type T00 = Assert<IsExact<Reverse<[1, 2, 3?]>, [3 | undefined, 2, 1]>, true>;
// Concat
type T04 = Assert<IsExact<Concat<[1, 2, 3], [4, 5, 6]>, [1, 2, 3, 4, 5, 6]>, true>;
// RequiredInit
type T02 = Assert<IsExact<RequiredInit<[string, boolean, number?, string?]>, [string, boolean]>, true>;
// OptionalTail
type T03 = Assert<IsExact<OptionalTail<[string, number?, string?]>, [number?, string?]>, true>;
// Indices
// UpToLength
// Take
// TakeLast
type T07 = Assert<IsExact<TakeLast<2, [1, 2, 3]>, [2, 3]>, true>;
// TakeUntil
type T09 = Assert<IsExact<TakeUntil<2, [0, 1, 2, 3, 4, 5]>, [0, 1]>, true>;
// TakeFrom
type T10 = Assert<IsExact<TakeFrom<2, [0, 1, 2, 3, 4, 5]>, [2, 3, 4, 5]>, true>;
// SplitAt
// PartialFrom
type T11 = Assert<IsExact<PartialFrom<2, [0, 1, 2, 3, 4, 5]>, [0, 1, 2?, 3?, 4?, 5?]>, true>;
// Nth
// SetAt
type T08 = Assert<IsExact<SetAt<2, boolean, [0, 1, 2, 3, 4]>, [0, 1, boolean, 3, 4]>, true>;
// InsertAt
type T23 = Assert<IsExact<InsertAt<3, string, [1, 2, 3, 4, 5]>, [1, 2, 3, string, 4, 5]>, true>;
// InsertAllAt
type T73 = Assert<IsExact<InsertAllAt<2, [9, 8, 7], [1, 2, 3, 4]>, [1, 2, 9, 8, 7, 3, 4]>, true>;
// DropAt
type T24 = Assert<IsExact<DropAt<2, [1, 2, 3, 4, 5, 6]>, [1, 2, 4, 5, 6]>, true>;
// FillToLength
type T13 = Assert<IsExact<FillToLength<4, any, []>, [any, any, any, any]>, true>;
type T14 = Assert<IsExact<FillToLength<2, any, [0, 1, 2, 3]>, [0, 1, 2, 3]>, true>;
// TupleN
type T15 = Assert<IsExact<TupleN<5, 0>, [0, 0, 0, 0, 0]>, true>;
// TupleLengthGTE
type T16 = Assert<IsExtension<[any], TupleLengthGTE<[any, any, any]>>, false>;
type T46 = Assert<IsExtension<TupleN<5, string>, TupleLengthGTE<[any, any, any]>>, true>;
// TupleLengthLTE
type T22 = Assert<IsExtension<[1, 1, 1], TupleLengthLTE<[1, 2, 3, 4]>>, true>;
// SetAll
type T21 = Assert<IsExact<SetAll<string, [1, 1, 1]>, [string, string, string]>, true>;
// TupleLengthEq
type T20 = Assert<IsExtension<[1, 1, 1], TupleLengthEq<[1, 2, 3]>>, true>;
// TupleRepeat
type T17 = Assert<IsExact<TupleRepeat<8, [1, 2, 3]>, [1, 2, 3, 1, 2, 3, 1, 2]>, true>;
// ZipTuples
type T19 = Assert<IsExact<ZipTuples<[1, 2, 3], [4, 5]>, [[1, 4], [2, 5], [3, any]]>, true>;
// Find
