export type None = { readonly _type: 'None' };
export type Some<T> = { readonly _type: 'Some'; value: T };
export type Option<T> = None | Some<T>;

export const none: None = { _type: 'None' };
export const some = <T>(value: T): Some<T> => ({ _type: 'Some', value });

export function isSome<T>(option: Option<T>): option is Some<T> {
  return option._type === 'Some';
}
export function isNone<T>(option: Option<T>): option is None {
  return option._type === 'None';
}