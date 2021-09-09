import { getContext, setContext } from 'svelte';
import type { StorageConnector } from '../dao/StorageConnector';
import type { Recipe } from '../dao/Recipe';

export function connectorContext(c?: StorageConnector<Recipe>): StorageConnector<Recipe> {
      if (c=== undefined){
        return getContext('connector');
      }
      setContext('connector', c);
      return c;
}

