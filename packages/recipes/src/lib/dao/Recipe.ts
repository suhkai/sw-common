import type { StorageConnector } from './StorageConnector';
import { Ingredient } from './Ingredient';

export class Recipe {
    name: string;
    id: number;
    storage: StorageConnector<Recipe>;
    
    ingredientPk = 1;
    ingredients: Ingredient[] = [];

    setName(name?: string): void {
        if (name){
            this.name = name.trim();
            return;
        }
        throw new Error(`recipe name is invalid [${name}]`);
    }

    setId(id?: number): void {
        if (Number.isInteger(id) && id >= 0){
            this.id = id;
            return;
        }
        throw new Error(`recipe name is invalid [${name}]`);
    }

    add(name: string, id?: number): Ingredient| undefined {
        if (!name || name.trim() === ''){
           return;
        }
        if (!Number.isInteger(id) || id < 0){
            id = this.ingredientPk;
            this.ingredientPk++;
        }
        const rc = new Ingredient(id, name);
        this.ingredients.push(rc);
        return rc;
    }

    formatIds(): void{
        this.ingredients.forEach((v, i) => {
            v.id = i+1;
        });
        this.ingredientPk = this.ingredients.length;
    }

    toJSON(): unknown {
        return { recipe_id: this.id, name: this.name, ingredients: this.ingredients };
    }

    constructor(storage: StorageConnector<Recipe>){
        /**/
        this.storage = storage;
    }
}