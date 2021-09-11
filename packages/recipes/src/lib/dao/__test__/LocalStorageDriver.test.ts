/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import 'jest-localstorage-mock';
//import { listen_dev } from 'svelte/internal';
import { Recipe } from '../Recipe';

import { LocalStorageDriver } from '../LocalStorageDriver';

import { recipesToPlainObj } from '$lib/recipe2Plain';

// make code less verbose
type setItemMock = jest.Mock<void, [a: string, b: string]>;
type removeItemMock = jest.Mock<void, [a: string]>;

const appKey = '_Jacob Bogers_recipes_2d6feea08b0ea4b235b89b17c8d5d3b8803baff8';
const fixture = '[{"recipe_id":1,"name":"roasted pig","ingredients":[{"pk":1,"state":1,"name":"pig"},{"pk":2,"state":1,"name":"knife"},{"pk":3,"state":1,"name":"fire"},{"pk":4,"state":1,"name":"pot"}]},{"recipe_id":2,"name":"Spagetti Recipe","ingredients":[{"pk":1,"state":1,"name":"meatloaf"},{"pk":2,"state":1,"name":"tomatoes"},{"pk":3,"state":1,"name":"water"},{"pk":4,"state":1,"name":"herbs"},{"pk":5,"state":1,"name":"pasta"},{"pk":6,"state":1,"name":"zeze    "}]}]';

function setToFixture() {
    globalThis.localStorage.setItem(appKey, fixture);
    (globalThis.localStorage.setItem as setItemMock).mockClear();
}

function cleanStorage() {
    globalThis.localStorage.removeItem(appKey);
    (globalThis.localStorage.removeItem as removeItemMock).mockClear();
}

describe('LocalStorageDriver', () => {
    it('initialize adaptor with existing data', () => {
        setToFixture();

        const lsd = new LocalStorageDriver();
        expect(lsd.hasStorage()).toBe(true);
        const recipes = lsd.loadAll();

        const pk = lsd.getPk();
        expect(pk).toBe(3);

        const actual = recipesToPlainObj(recipes, 'recipe_id:id', 'pk:ingredientPk', 'name:name');
        expect(actual).toEqual(
            [
                {
                    recipe_id: 1,
                    name: 'roasted pig',
                    pk: 5,
                    ingredients: [
                        { pk: 1, state: 1, name: 'pig' },
                        { pk: 2, state: 1, name: 'knife' },
                        { pk: 3, state: 1, name: 'fire' },
                        { pk: 4, state: 1, name: 'pot' }
                    ]
                },
                {
                    recipe_id: 2,
                    name: 'Spagetti Recipe',
                    pk: 7,
                    ingredients: [
                        { pk: 1, state: 1, name: 'meatloaf' },
                        { pk: 2, state: 1, name: 'tomatoes' },
                        { pk: 3, state: 1, name: 'water' },
                        { pk: 4, state: 1, name: 'herbs' },
                        { pk: 5, state: 1, name: 'pasta' },
                        { pk: 6, state: 1, name: 'zeze' }
                    ]
                }
            ]);
    });
    it('initialize adaptor with No data', () => {
        cleanStorage();

        const lsd = new LocalStorageDriver();
        expect(lsd.hasStorage()).toBe(true);
        const recipes = lsd.loadAll();

        const pk = lsd.getPk();
        expect(pk).toBe(2);

        const actual = recipesToPlainObj(recipes, 'recipe_id:id', 'pk:ingredientPk', 'name:name');
        expect(actual).toEqual(
            [
                {
                    name: '🍝 Spaghetti', recipe_id: 1,
                    pk: 5,
                    ingredients: [
                        { name: '🧅 Onions', pk: 1, state: 1 },
                        { name: '🍄 Mushrooms', pk: 2, state: 1 },
                        { name: '🧄 Garlic', pk: 3, state: 1 },
                        { name: '🧀 Cheese', pk: 4, state: 1 }
                    ]
                }
            ]);
    });
    it('add Recipe via connector, remove recipe, reload', () => {
        setToFixture();
        const lsd = new LocalStorageDriver();
        const connector = lsd.getConnector();
        connector.loadAll();
        expect(connector.remove(2)).toBe(true);
        // add recipe
        let recipe = new Recipe();
        recipe.name = 'Duck and BBQ Pork   ';
        recipe = connector.add(recipe); // recipe has pk and trimmed name
        expect(recipe.id).toBe(0);
        expect(lsd.getPk()).toBe(3);
        connector.saveAll();
        // check directly in localStorage
        const raw = globalThis.localStorage.getItem(appKey);
        const json = JSON.parse(raw);
        expect(json).toEqual([
            {
                recipe_id: 1,
                name: 'roasted pig',
                ingredients: [
                    { pk: 1, state: 1, name: 'pig' },
                    { pk: 2, state: 1, name: 'knife' },
                    { pk: 3, state: 1, name: 'fire' },
                    { pk: 4, state: 1, name: 'pot' }
                ]
            }
        ]);
        connector.commit();
        connector.saveAll();
        {
            const raw = globalThis.localStorage.getItem(appKey);
            const json = JSON.parse(raw);
            expect(json).toEqual([
                {
                    ingredients: [],
                    name: 'Duck and BBQ Pork',
                    recipe_id: 3
                },
                {
                    ingredients: [
                        {
                            state: 1,
                            pk: 1,
                            name: 'pig'
                        },
                        {
                            state: 1,
                            pk: 2,
                            name: 'knife'
                        },
                        {
                            state: 1,
                            pk: 3,
                            name: 'fire'
                        },
                        {
                            state: 1,
                            pk: 4,
                            name: 'pot'
                        }
                    ],
                    name: 'roasted pig',
                    recipe_id: 1
                }
            ]);
            expect(lsd.getPk()).toBe(4);
        }
    });
    it('disable localStorage (sec-It, or user disabled)', () => {
        const prev = globalThis.localStorage;
        delete globalThis.localStorage;
        const lsd = new LocalStorageDriver();
        const connector = lsd.getConnector();
        const recipes = connector.loadAll();
        const plain = recipesToPlainObj(recipes);
        expect(plain).toEqual([
            {
                name: '🍝 Spaghetti',
                recipe_id: 1,
                ingredients: [
                    { name: '🧅 Onions', pk: 1, state: 1 },
                    { name: '🍄 Mushrooms', pk: 2, state: 1 },
                    { name: '🧄 Garlic', pk: 3, state: 1 },
                    { name: '🧀 Cheese', pk: 4, state: 1 }
                ]
            }
        ]);

        //add recipes
        {
            [
                'Duck and BBQ Pork   ', // 2 x
                'Eqq Fried rice',       // 3
                'Okra fried garlic',    // 4
                'Rice noodle rolls'    // 5 x
            ].forEach(name => {
                const recipe = new Recipe();
                recipe.name = name;
                connector.add(recipe);
                connector.commit();
            });
            connector.saveAll(); // should no nothing
            connector.remove(2);
            connector.remove(5);
            connector.loadAll(); // will reformat id's
            const plain = recipesToPlainObj(recipes);
            expect(plain).toEqual([
                {
                    ingredients: [],
                    name: 'Okra fried garlic',
                    recipe_id: 1
                },
                {
                    ingredients: [],
                    name: 'Eqq Fried rice',
                    recipe_id: 2
                },
                {
                    ingredients: [
                        {
                            state: 1,
                            pk: 1,
                            name: '🧅 Onions'
                        },
                        {
                            state: 1,
                            pk: 2,
                            name: '🍄 Mushrooms'
                        },
                        {
                            state: 1,
                            pk: 3,
                            name: '🧄 Garlic'
                        },
                        {
                            state: 1,
                            pk: 4,
                            name: '🧀 Cheese'
                        }
                    ],
                    name: '🍝 Spaghetti',
                    recipe_id: 3
                }
            ]);
        }
        globalThis.localStorage = prev; // restore
    });
});