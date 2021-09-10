import { Ingredient } from './Ingredient';


export class Recipe {
    #name: string;
    #id: number;

    ctx = { expanded: false, focus: false };

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
        for (const ingr of this.ingredients){
            if (ingr.id === id){
                return ingr;
            }
        }
        throw new Error(`/Internal Error: ingredient with id=${id} not found in recipe=${this.#id}`);
    }

    constructor(){
        this.#id = 0;
        this.#name = '';
    }
}