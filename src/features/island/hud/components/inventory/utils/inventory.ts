import { Inventory } from "components/InventoryItems";
import { BUILDINGS_DIMENSIONS } from "features/game/types/buildings";
import { COLLECTIBLES_DIMENSIONS } from "features/game/types/craftables";
import { getKeys } from "features/game/types/craftables";
import { GameState } from "features/game/types/game";

const PLACEABLE_DIMENSIONS = {
  ...BUILDINGS_DIMENSIONS,
  ...COLLECTIBLES_DIMENSIONS,
};

export const getBasketItems = (inventory: Inventory) => {
  return getKeys(inventory).reduce((acc, itemName) => {
    if (itemName in PLACEABLE_DIMENSIONS) {
      return acc;
    }

    return {
      ...acc,
      [itemName]: inventory[itemName],
    };
  }, {} as Inventory);
};

export const getChestItems = (state: GameState) => {
  return getKeys(state.inventory).reduce((acc, itemName) => {
    if (
      itemName in COLLECTIBLES_DIMENSIONS &&
      !(itemName in state.collectibles)
    ) {
      return {
        ...acc,
        [itemName]: state.inventory[itemName],
      };
    }

    return acc;
  }, {} as Inventory);
};
