'use strict';

import { recipesToPlainObj } from '$lib/recipe2Plain';
import { Recipe } from './Recipe';
import type { StorageConnector } from './StorageConnector';


// sec-it or user could have disabled this, check it
function storageAvailable() {
    try {
        const storage = window.localStorage,
            x = '__storage_test__';
        storage.setItem(x, x);
        const s = storage.getItem(x);
        storage.removeItem(x);
        return s === x;
    }
    catch (e) {
        return false;
    }
}

interface IngredientSerialized {
    pk: number;
    state: number;
    name: string;
}

interface RecipeSerialized {
    recipe_id: number
    name: string;
    ingredients: Partial<IngredientSerialized>[];
}

class StorageConnectorImpl implements StorageConnector<Recipe> {
    #storage: LocalStorageDriver;

    constructor(realStorage: LocalStorageDriver) {
        this.#storage = realStorage;
    }

    loadAll(): Recipe[] {
        return this.#storage.loadAll();
    }

    saveAll(): void {
        this.#storage.saveAll();
    }

    incrPk(){
        return this.#storage.incrPk();
    }

    commit(rId: number, ingrId: number): boolean {
        return this.#storage.commit(rId, ingrId);
    }

    remove(id: number): boolean {
        return this.#storage.remove(id);
    }

    formatRowNumbers():void {
        this.#storage.formatRowNumbers();
    }

    add(r: Recipe): Recipe {
        return this.#storage.add(r);
    }

    findIdxOfRecipe(id: number): [Recipe, number]{
        const cache = this.#storage.getCache();
        let found: Recipe| undefined = undefined;
        let idx = -1; 
        for (const r of cache){
            idx++;
            if (r.id === id) {
                  found = r;
                  break;
            }
        }
        if (found === undefined) throw new Error(`/Internal error/ Recipe id:${id} not found`);
        return [found, idx];
    }
    findIdxOfIngredient(recipeId: number, ingredientId: number): number {
        const [recipe, idx] = this.findIdxOfRecipe(recipeId);
        let offset = -1;
        for (const ingr of recipe.ingredients){
            offset++;
            if (ingr.id === ingredientId){
                break;
            }
        }
        if (offset < 0) throw new Error(`/Internal error/ IngredientId:${ingredientId} not found within recipe:${recipeId}`);
        return idx+offset;
    }
}

export class LocalStorageDriver {

    // private props
    #hasStorage: boolean = storageAvailable();
    #appKey = this.#hasStorage ? '_Jacob Bogers_recipes_2d6feea08b0ea4b235b89b17c8d5d3b8803baff8' : '';
    #cache: Recipe[] = [];
    #id = 1;
    #storageConnector = new StorageConnectorImpl(this);
        
    // private methods
    #fixture(): void {
        this.#cache.splice(0);
        this.#id = 1;
        const rc = new Recipe();
        rc.id = this.#id;
        rc.name = '🍝 Spaghetti';
        this.#id++;
        this.#cache.push(rc);
        [
            '🧅 Onions', 
            '🍄 Mushrooms', 
            '🧄 Garlic',
            '🧀 Cheese'
        ].forEach(ingr => rc.addIngredient(ingr));
    }


    hasStorage(): boolean {
        return this.#hasStorage;
    }

    getPk(): number {
        return this.#id;
    }

    incrPk(): number {
        const prev = this.#id;
        this.#id++;
        return prev;
    }

    getCache(): Recipe[] {
        return this.#cache;
    }

    getConnector(): StorageConnector<Recipe> {
        return this.#storageConnector;
    }

    // public methods
    // format ids and rownums at the same time
    formatIds(): void {
        let rowNum = 3;
        this.#cache.forEach((v, i) => {
            rowNum++;
            v.rowNum = rowNum;
            rowNum = v.formatIds(rowNum);
            v.id = i + 1;
        });
        this.#id = this.#cache.length + 1;
    }

    formatRowNumbers(): void {
        let rowNum = 3;
        this.#cache.forEach(v => {
            rowNum++;
            v.rowNum = rowNum;
            rowNum = v.formatNumbers(rowNum);
        });
    }

    // Note: id is not the index, id's are also not in order perse
    remove(id: number): boolean {
        const idx = this.#cache.findIndex(r => r.id === id);
        if (idx < 0){
            return false;
        }
        this.#cache.splice(idx, 1);
        return true;
    }

    add(recipe: Recipe): Recipe {
        if (!Number.isInteger(recipe.id) || recipe.id < 0){
            recipe.id = this.incrPk();
        }
        this.#cache.unshift(recipe);
        return recipe;
    }
    
    commit(rId: number, ingrId: number): boolean {
        const recipe = this.#cache.find(rp => rp.id === rId);
        let flag = 0;
        if (recipe !== undefined){
            recipe.name = recipe.name.trim();
            if (recipe.name.length > 0){
                if (recipe.id === 0){
                    recipe.id = this.incrPk();
                    flag++;
                }
                if (ingrId >= 0){
                    const ingredient = recipe.getIngredient(ingrId);
                    ingredient.name = ingredient.name.trim();
                    if (ingredient.name.length > 0){
                        if (ingredient.id >= 0 && ingredient.id < 1){
                            ingredient.id = recipe.ingredientPk;
                            recipe.ingredientPk++;
                            flag++;
                        }
                    }
                }
            }
        }
        return flag > 0;
    }

    //save everything
    saveAll(): void {
        if (this.#hasStorage) {
            const data = recipesToPlainObj(this.#cache);
            window.localStorage.setItem(this.#appKey, JSON.stringify(data));
        }
    }

    // loads everything
    loadAll(): Recipe[] {
        if (!this.#appKey || !this.#hasStorage) {  // no persistance fake it
            if (this.#cache.length === 0){
                this.#fixture();
            }
            else {
                this.formatIds();
            }
            return this.#cache;
        }
        const _data = window.localStorage.getItem(this.#appKey);
        const data = _data === null ? '' : _data;
        if (data.trim().length === 0) {
            this.#fixture();
            this.saveAll();
            return this.#cache;
        }
        let recipes: Partial<RecipeSerialized>[] | undefined;
        try {
            recipes = JSON.parse(data);
        }
        catch (e) { // json corrupt
            this.#fixture();
            this.saveAll();
            return this.#cache;
        }
        if (!Array.isArray(recipes)) {
            this.#fixture();
            this.saveAll();
            return this.#cache;
        }
        this.#cache.splice(0);
        for (const recipe of recipes) {
            // sanity checks
            if (recipe.name === undefined || recipe.name.trim() == '') {
                continue;
            }
            const model = new Recipe();
            try {
                model.name = recipe.name?.trim();
                model.id = recipe.recipe_id as number;
            }
            catch (err) {
                const rc = recipesToPlainObj([recipe as Recipe]);
                console.error(`There was an error hydrating ${JSON.stringify(rc)}`);
                continue;
            }
            this.#cache.push(model);
            if (
                !Array.isArray(recipe.ingredients)
                ||
                (Array.isArray(recipe.ingredients) && recipe.ingredients.length === 0)) {
                continue;
            }
            for (const ingredient of recipe.ingredients) {
                const name = ingredient.name !== undefined ? ingredient.name.trim() : '';
                model.addIngredient(name, ingredient.pk);
            }
        }
        this.formatIds();
        return this.#cache;
    }
}