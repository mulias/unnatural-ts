export type Assert<T extends true | false, Expected extends T> = never;

export type IsAny<T> = IsUnknown<T> extends true ? false
    : IsNever<T> extends true ? false
    : T extends any ? any extends T ? true : false : false;

export type IsUnknown<T> = IsNever<T> extends true ? false
    : (T extends unknown ? unknown extends T ? /* catch any type */ T extends string ? false : true : false : false);

export type IsNever<T> = [T] extends [never] ? true : false;

export type IsExact<T, U> =
  IsAny<T> extends true ? IsAny<U> extends true ? true : false : IsAny<U> extends true ? false
  : [T] extends [U] ? [U] extends [T] ? true : false : false;
