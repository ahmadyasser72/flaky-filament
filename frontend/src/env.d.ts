interface ObjectConstructor {
  entries<T extends object>(o: T): Array<[keyof T, T[keyof T]]>;
  keys<T extends object>(o: T): Array<keyof T>;
}
