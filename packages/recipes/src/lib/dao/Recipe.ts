import { Ingredient } from './Ingredient';


export class Recipe {
    #name: string;
    #id: number;

    ingredientPk = 1;
    ingredients: Ingredient[] = [];

    get id(): number {
        return this.#id;
    }

    set id(id: number) {
        if (Number.isInteger(id) && id >= 0) {
            this.#id = id;
            return;
        }
        throw new Error(`recipe id is invalid [${id}]`);
    }

    get name(): string {
        return this.#name;
    }

    set name(name: string) {
        const tn = name.trim();
        if (tn.length === 0) {
            throw new Error(`recipe name is invalid [${name}]`);
        }
        this.#name = tn;
    }

    addIngredient(name: string, id?: number): Ingredient | undefined {
        if (!name || name.trim() === '') {
            return;
        }
        if (!Number.isInteger(id) || id < 0) {
            id = this.ingredientPk;
            this.ingredientPk++;
        }
        const rc = new Ingredient(id, name);
        this.ingredients.push(rc);
        return rc;
    }

    formatIds(): void {
        this.ingredients.forEach((v, i) => {
            v.id = i + 1;
        });
        this.ingredientPk = this.ingredients.length + 1;
    }
}