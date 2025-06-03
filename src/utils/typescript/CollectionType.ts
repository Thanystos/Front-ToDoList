export type CollectionType<T> = {
  member: T[],
  totalItems: number,
  [key: string]: any;
}