/**
 * Type for testing types.
 */
export type Assert<T extends true | false, Expected extends T> = never;
