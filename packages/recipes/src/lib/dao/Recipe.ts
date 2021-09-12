import { Ingredient } from './Ingredient';


export class Recipe {
    #name: string;
    #id: number;

    ctx = { 
        expanded: false, 
        focus: false,
    };

    rowNum = 0;

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
        this.#name = name.trim();
    }

    addIngredient(name: string, id?: number): Ingredient | undefined {
        if (id === undefined) {
            id = this.ingredientPk;
            this.ingredientPk++;
        }
        if (id < 0){
            return;
        } 
        if (id >= 1) {
            if (!name || name.trim() === '') {
                return;
            }
        }
        const rc = new Ingredient(id, name);
        this.ingredients.push(rc);
        return rc;
    }

    formatNumbers(rowNum: number): number {
        this.ingredients.forEach(v => {
            rowNum++;
            v.rowNum = rowNum;
        });
        return rowNum;
    }

    formatIds(rowNum: number): number {
        this.ingredients.forEach((v, i) => {
            rowNum++;
            v.id = i + 1;
            v.rowNum = rowNum;
        });
        this.ingredientPk = this.ingredients.length + 1;
        return rowNum;
    }

    getIngredient(id: number): Ingredient {
        const found = this.ingredients.find(ing => ing.id === id);
        if (found === undefined){
            throw new Error(`/Internal Error: ingredient with id=${id} not found in recipe=${this.#id}`);
        }
        return found;
    }

    getIngredientIdx(id: number): number {
        const idx = this.ingredients.findIndex(ing => ing.id === id);
        if (idx < 0){
            throw new Error(`/Internal Error: ingredient with id=${id} not found in recipe=${this.#id}`);
        }
        return idx;
    }

    #testIdForNew(id: number): boolean {
        if (id >= 0 && id < 1) {
            return true;
        }
        return false;
    }

    #testExistingId(id1: number, id2: number): boolean {
        return id1 === id2;
    }

    hasNewIngredient(): boolean {
        return this.ingredients.find(ingr => this.#testIdForNew(ingr.id)) !== undefined;
    }

    removeIngredient(id: number): boolean {
        const fn = this.#testIdForNew(id) ? (v: Ingredient) => this.#testIdForNew(v.id) : (v: Ingredient) => this.#testExistingId(id, v.id);
        const idx = this.ingredients.findIndex(fn);
        if (idx >= 0) {
            this.ingredients.splice(idx, 1);
            return true;
        }
        return false;
    }

    constructor() {
        this.#id = 0;
        this.#name = '';
    }
}