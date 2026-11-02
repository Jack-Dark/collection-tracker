import type { LinkProps } from '@tanstack/react-router';

export type RouterPath = LinkProps['to'];

/**
 * Usage:
 * ```ts
 * const myObjectMap = {...} as const;
 *
 * type MyObjectValuesDef = ObjectValues<typeof myObjectMap>
 * ```
 * */
export type ObjectValues<T extends Record<any, any>> = T[keyof T];

export type DeepPartial<T> =
  T extends Array<infer InferredArrayMember>
    ? DeepPartialArray<InferredArrayMember>
    : T extends object
      ? DeepPartialObject<T>
      : T | undefined;

type DeepPartialArray<T> = Array<DeepPartial<T>>;

type DeepPartialObject<T> = {
  [Key in keyof T]?: DeepPartial<T[Key]>;
};
