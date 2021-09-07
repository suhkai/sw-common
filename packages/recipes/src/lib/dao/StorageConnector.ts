export interface StorageConnector<T> {
   loadAll(): T[];
   saveAll(): void;
   incrPk(): number;
   remove(id: number): boolean;
   add(t: T): T;
}