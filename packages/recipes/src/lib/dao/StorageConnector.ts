export interface StorageConnector<T> {
   loadAll(): T[];
   saveAll(): void;
   incrPk(): number;
   remove(id: number): boolean;
   add(t: T): T;
   commit(): T| undefined;
   findIdxOfRecipe(id: number):[T, number];
   findIdxOfIngredient(recipeId: number, ingredientId: number): number;
   formatRowNumbers(): void;
}