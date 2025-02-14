/**
 * A wrapper that provides game state and dispatches events
 */
import { useState, useCallback, useLayoutEffect } from "react";
import { useActor, useInterpret, useSelector } from "@xstate/react";
import React, { useContext } from "react";

import * as Auth from "features/auth/lib/Provider";
import {
  cacheShortcuts,
  getShortcuts,
} from "features/farming/hud/lib/shortcuts";

import {
  startGame,
  MachineInterpreter,
  MachineState,
  INITIAL_SESSION,
} from "./lib/gameMachine";
import { InventoryItemName } from "./types/game";
import { useParams } from "react-router-dom";

interface GameContext {
  shortcutItem: (item: InventoryItemName) => void;
  selectedItem?: InventoryItemName;
  gameService: MachineInterpreter;
}

export const Context = React.createContext<GameContext>({} as GameContext);

const selectInventory = (state: MachineState) => state.context.state.inventory;
const selectSessionId = (state: MachineState) => state.context.sessionId;

export const GameProvider: React.FC = ({ children }) => {
  const { authService } = useContext(Auth.Context);
  const [authState] = useActor(authService);

  const { id } = useParams();
  const [gameMachine] = useState(
    startGame({
      ...authState.context,
      farmId: id ? Number(id) : authState.context.farmId,
      // If the last event was a create farm, walk them through the tutorial
      // For now hide the tutorial until we can figure out an approach that is maintainable
      isNoob: false, //authState.history?.event.type === "CREATE_FARM",
    }) as any
  );

  // TODO - Typescript error
  const gameService = useInterpret(gameMachine) as MachineInterpreter;
  const inventory = useSelector(gameService, selectInventory);
  const sessionId = useSelector(gameService, selectSessionId);
  const [shortcuts, setShortcuts] = useState<InventoryItemName[]>([]);

  const shortcutItem = useCallback((item: InventoryItemName) => {
    const items = cacheShortcuts(item);

    setShortcuts(items);
  }, []);

  useLayoutEffect(() => {
    const savedShortcuts = getShortcuts();

    if (sessionId !== INITIAL_SESSION && savedShortcuts.length === 0) {
      const defaultItem: InventoryItemName = inventory["Shovel"]
        ? "Shovel"
        : "Rusty Shovel";

      shortcutItem(defaultItem);
    } else {
      setShortcuts(savedShortcuts);
    }
  }, [inventory, sessionId, shortcutItem]);

  const selectedItem = shortcuts.length > 0 ? shortcuts[0] : undefined;

  return (
    <Context.Provider value={{ shortcutItem, selectedItem, gameService }}>
      {children}
    </Context.Provider>
  );
};
