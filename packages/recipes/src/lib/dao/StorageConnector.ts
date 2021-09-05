export interface StorageConnector<T> {
   loadAll(): T[];
   saveAll(): void;
}