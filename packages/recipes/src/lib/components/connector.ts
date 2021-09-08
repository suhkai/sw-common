import { getContext } from 'svelte';
import type { StorageConnector } from '../dao/StorageConnector';
import type { Recipe } from '../dao/Recipe';

export function connector(): StorageConnector<Recipe> {
      return getContext('connector');
}