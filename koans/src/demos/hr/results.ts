export type Failure<E = unknown> = { _type: 'Failure'; error: E };
export type Success<T = void> = { _type: 'Success'; value: T };
export type Results<T = void, E = unknown> = Success<T> | Failure<E>;

export const succeeded = <T = void>(value: T): Success<T> => ({ _type: 'Success', value });
export const failed = <E = unknown>(error: E): Failure<E> => ({ _type: 'Failure', error });

export function isSuccess<T, E>(r: Results<T, E>): r is Success<T> {
  return r._type === 'Success';
}
export function isFailure<T, E>(r: Results<T, E>): r is Failure<E> {
  return r._type === 'Failure';
}