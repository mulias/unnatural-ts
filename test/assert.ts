import {Assert} from '../src/Assert';
import {IsAny, IsNever} from '../src/Compare';

type T00 = Assert<true, true>;
type T01 = Assert<false, false>;
type T03 = Assert<any, true>;
type T04 = Assert<any, false>;
type T05 = Assert<never, never>;
type T06 = Assert<IsAny<any>, true>;
type T07 = Assert<IsAny<never>, false>;
type T08 = Assert<IsNever<any>, false>;
type T09 = Assert<IsNever<never>, true>;
