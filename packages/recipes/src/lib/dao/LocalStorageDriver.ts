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

/* SAMPLE DB (ACTUAL)
[
    {
        "recipe_id": 1,
        "name": "roasted pig",
        "ingredients": [
            {
                "pk": 1,
                "state": 1,
                "name": "pig"
            },
            {
                "pk": 2,
                "state": 1,
                "name": "knife"
            },
            {
                "pk": 3,
                "state": 1,
                "name": "fire"
            },
            {
                "pk": 4,
                "state": 1,
                "name": "pot"
            }
        ]
    },
    {
        "recipe_id": 2,
        "name": "Spagetti Recipe",
        "ingredients": [
            {
                "pk": 1,
                "state": 1,
                "name": "meatloaf"
            },
            {
                "pk": 2,
                "state": 1,
                "name": "tomatoes"
            },
            {
                "pk": 3,
                "state": 1,
                "name": "water"
            },
            {
                "pk": 4,
                "state": 1,
                "name": "herbs"
            },
            {
                "pk": 5,
                "state": 1,
                "name": "pasta"
            },
            {
                "pk": 6,
                "state": 1,
                "name": "zeze    "
            }
        ]
    }
]
*/

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

    remove(id: number): boolean {
        return this.#storage.remove(id);
    }

    add(r: Recipe): Recipe | undefined {
        return this.#storage.add(r);
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
        rc.setId(this.#id);
        rc.setName('Spagetti');
        this.#id++;
        this.#cache.push(rc);
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
    formatIds(): void {
        this.#cache.forEach((v, i) => {
            v.formatIds();
            v.setId(i + 1);
        });
        this.#id = this.#cache.length + 1;
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

    add(recipe: Recipe): Recipe| undefined {
        if (!recipe.name || recipe.name.trim() === ''){
            return undefined;
        }
        if (!Number.isInteger(recipe.id) || recipe.id < 0){
            recipe.setId(this.incrPk());
        }
        this.#cache.push(recipe);
        return recipe;
    }

    //save everything
    saveAll(): void {
        if (this.#hasStorage){
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
        const data = window.localStorage.getItem(this.#appKey) || "";
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
            if (!recipe.name || recipe.name?.trim() == '') {
                continue;
            }
            const model = new Recipe();
            try {
                model.setName(recipe.name?.trim());
                model.setId(recipe.recipe_id);
            }
            catch (err) {
                const rc = recipesToPlainObj([recipe as Recipe]);
                console.error(`There was an error hydrating ${JSON.stringify(rc)}`);
                continue;
            }
            this.#cache.push(model);
            if (
                !recipe.ingredients
                || !(Array.isArray(recipe.ingredients))
                || recipe.ingredients.length === 0) {
                continue;
            }
            for (const ingredient of recipe.ingredients) {
                model.addIngredient(ingredient.name?.trim(), ingredient.pk);
            }
        }
        this.formatIds();
        return this.#cache;
    }
}