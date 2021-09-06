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
        const rc = new Recipe(this.#storageConnector);
        rc.setId(this.#id);
        rc.setName('Spagetti');
        this.#id++;
        this.#cache.push(rc);
    }

    hasStorage(): boolean {
        return this.#hasStorage;
    }

    getId(): number {
        return this.#id;
    }

    getCache(): Recipe[] {
        return this.#cache;
    }

    // public methods
    formatIds(): void {
        this.#cache.forEach((v, i) => {
            v.formatIds();
            v.setId(i + 1);
        });
        this.#id = this.#cache.length;
    }

    //save everything
    public saveAll(): void {
        if (this.#hasStorage){
            window.localStorage.setItem(this.#appKey, JSON.stringify(this.#cache));
        }
    }

    // loads everything
    public loadAll(): Recipe[] {
        if (!this.#appKey || !this.#hasStorage) {  // no persistance fake it
            if (this.#cache.length === 0){
                this.#fixture();
            }
            return this.#cache;
        }
        const data = window.localStorage.getItem(this.#appKey) || "";
        if (data.trim().length == 0) {
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
            return;
        }
        if (!Array.isArray(recipes)) {
            this.#fixture();
            this.saveAll();
            this.loadAll(); // try again
            return;
        }
        this.#cache.splice(0);
        for (const recipe of recipes) {
            // sanity checks
            if (!recipe.name || recipe.name.trim() == '') {
                continue;
            }
            const model = new Recipe(new StorageConnectorImpl(this));
            try {
                model.setName(recipe.name);
                model.setId(recipe.recipe_id);
            }
            catch (err) {
                console.error(`There was an error hydrating ${JSON.stringify(recipe)}`);
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
                model.add(ingredient.name, ingredient.pk);
            }
        }
        this.formatIds();
        return this.#cache;
    }
}