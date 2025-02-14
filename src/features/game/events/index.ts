import { craft, CraftAction } from "./craft";
import { sell, SellAction } from "./sell";
import { plant, PlantAction } from "./plant";
import { harvest, HarvestAction } from "./harvest";
import { removeCrop, RemoveCropAction } from "./removeCrop";
import { mineGold, GoldMineAction } from "./goldMine";
import { mineStone, StoneMineAction } from "./stoneMine";
import { mineIron, IronMineAction } from "./ironMine";
import { chop, ChopAction } from "./chop";
import { openReward, OpenRewardAction } from "./rewarded";
import { collectEggs, CollectAction } from "./collectEgg";
import { feedChicken, FeedAction } from "./feedChicken";
import {
  LandExpansionPlantAction,
  plant as landExpansionPlant,
} from "./landExpansion/plant";
import {
  harvest as landExpansionHarvest,
  LandExpansionHarvestAction,
} from "./landExpansion/harvest";
import {
  chop as landExpansionChop,
  LandExpansionChopAction,
} from "./landExpansion/chop";
import {
  mineStone as landExpansionMineStone,
  LandExpansionStoneMineAction,
} from "./landExpansion/stoneMine";

import { GameState } from "../types/game";
import { trade, TradeAction } from "./trade";
import { PebbleStrikeAction, strikePebble } from "./landExpansion/pebbleStrike";
import { chopShrub, ChopShrubAction } from "./chopShrub";
import { reveal, RevealAction } from "./revealExpansion";
import { fertiliseCrop, FertiliseCropAction } from "./fertiliseCrop";
import { claimAirdrop, ClaimAirdropAction } from "./claimAirdrop";
import {
  placeBuilding,
  PlaceBuildingAction,
} from "./landExpansion/placeBuilding";
import {
  constructBuilding,
  ConstructBuildingAction,
} from "./landExpansion/constructBuilding";
import {
  placeCollectible,
  PlaceCollectibleAction,
} from "./landExpansion/placeCollectible";
import { buyWarBonds, CollectWarBonds as BuyWarBonds } from "./buyWarBonds";
import { pickSide, PickSide } from "./pickSide";
import { cook, RecipeCookedAction } from "./landExpansion/cook";
import {
  collectRecipe,
  CollectRecipeAction,
} from "./landExpansion/collectRecipe";
import { feedBumpkin, FeedBumpkinAction } from "./landExpansion/feedBumpkin";
import { detectBot, DetectBotAction } from "./detectBot";

export type PlayingEvent =
  | CraftAction
  | SellAction
  | PlantAction
  | HarvestAction
  | StoneMineAction
  | IronMineAction
  | GoldMineAction
  | ChopAction
  | OpenRewardAction
  | FeedAction
  | RemoveCropAction
  | CollectAction
  | TradeAction
  | LandExpansionPlantAction
  | LandExpansionHarvestAction
  | LandExpansionChopAction
  | LandExpansionStoneMineAction
  | PebbleStrikeAction
  | TradeAction
  | ChopShrubAction
  | RevealAction
  | FertiliseCropAction
  | ClaimAirdropAction
  | BuyWarBonds
  | PickSide
  | RecipeCookedAction
  | CollectRecipeAction
  | FeedBumpkinAction
  | DetectBotAction;

export type PlacementEvent =
  | ConstructBuildingAction
  | PlaceBuildingAction
  | PlaceCollectibleAction;

export type GameEvent = PlayingEvent | PlacementEvent;
export type GameEventName<T> = Extract<T, { type: string }>["type"];

/**
 * Type which enables us to map the event name to the payload containing that event name
 */
type Handlers<T> = {
  [Name in GameEventName<T>]: (options: {
    state: GameState;
    // Extract the correct event payload from the list of events
    action: Extract<GameEventName<T>, { type: Name }>;
  }) => GameState;
};

export const PLAYING_EVENTS: Handlers<PlayingEvent> = {
  "item.planted": plant,
  "item.harvested": harvest,
  "item.crafted": craft,
  "item.sell": sell,
  "stone.mined": mineStone,
  "iron.mined": mineIron,
  "gold.mined": mineGold,
  "tree.chopped": chop,
  "reward.opened": openReward,
  "chicken.collectEgg": collectEggs,
  "chicken.feed": feedChicken,
  "item.traded": trade,
  "item.removed": removeCrop,
  "airdrop.claimed": claimAirdrop,
  "warBonds.bought": buyWarBonds,
  "side.picked": pickSide,
  "bot.detected": detectBot,
  // Land Expansion Handlers
  "seed.planted": landExpansionPlant,
  "crop.harvested": landExpansionHarvest,
  "pebble.struck": strikePebble,
  "shrub.chopped": chopShrub,
  "expansion.revealed": reveal,
  "timber.chopped": landExpansionChop,
  "rock.mined": landExpansionMineStone,
  "item.fertilised": fertiliseCrop,
  "recipe.cooked": cook,
  "recipe.collected": collectRecipe,
  "bumpkin.feed": feedBumpkin,
};

export const PLACEMENT_EVENTS: Handlers<PlacementEvent> = {
  "building.constructed": constructBuilding,
  "building.placed": placeBuilding,
  "collectible.placed": placeCollectible,
};

export const EVENTS = { ...PLAYING_EVENTS, ...PLACEMENT_EVENTS };
