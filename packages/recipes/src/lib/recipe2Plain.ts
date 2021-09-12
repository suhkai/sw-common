import type { Recipe } from '$lib/dao/Recipe';

interface RawIngredient  {
    state: number 
    pk: number
    name: string
}

interface RawRecipe {
    ingredients: RawIngredient[]
    [index: string]: unknown
}

export function recipesToPlainObj(recipes: Recipe[], ...props: string[]): unknown {
    const actual:RawRecipe[] = [];

    if (props.length === 0){
        props = ['name:name', 'recipe_id:id'];
    }

    for (const recipe of recipes) {
        if (recipe.id === 0){
            continue;
        }
        const rcR: RawRecipe = { ingredients: [] };
        for (const prop of props){
            const [dest, src] = prop.split(':');
            if (typeof recipe[src] === 'string'){
                rcR[dest] = recipe[src].trim();
            }
            else{
                rcR[dest] = recipe[src];
            }
        }
        actual.push(rcR);
        for (const ingr of recipe.ingredients) {
            if ((ingr.id >= 0 && ingr.id < 1) || ingr.name.trim().length === 0){
                continue;
            }
            rcR.ingredients.push({ state: 1, pk: ingr.id, name: ingr.name.trim() });
        }
    }
    return actual;
}