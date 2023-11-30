import { SpriteSheet } from "excalibur";
import { Resources } from "./resources";

export type Rank = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "T" | "J" | "Q" | "K"
export type Suit = "s" | "h" | "d" | "c"
export const CARD_WIDTH = 88;
export const CARD_HEIGHT = 124;
const CARDS_ROWS = 3;
const CARDS_COLUMNS = 5;
const CARD_GRID = {
  rows: CARDS_ROWS,
  columns: CARDS_COLUMNS,
  spriteWidth: CARD_WIDTH,
  spriteHeight: CARD_HEIGHT,
};
export const CARD_INDEX: Record<Rank, [number, number]> = {
    "A": [0, 0],
    "2": [1, 0],
    "3": [2, 0],
    "4": [3, 0],
    "5": [4, 0],
    "6": [0, 0],
    "7": [1, 1],
    "8": [2, 1],
    "9": [3, 1],
    "T": [4, 1],
    "J": [0, 2],
    "Q": [1, 2],
    "K": [2, 2]
}
export const clubSprites = SpriteSheet.fromImageSource({
  image: Resources.Cards.Clubs,
  grid: CARD_GRID,
});
export const diamondSprite = SpriteSheet.fromImageSource({
  image: Resources.Cards.Diamonds,
  grid: CARD_GRID,
});
export const heartSprite = SpriteSheet.fromImageSource({
  image: Resources.Cards.Hearts,
  grid: CARD_GRID,
});
export const spadeSprite = SpriteSheet.fromImageSource({
  image: Resources.Cards.Spades,
  grid: CARD_GRID,
});

export const getCardSprite = (rank: Rank, suit: Suit) => {
    const rankIndex = CARD_INDEX[rank]
    if (suit === "c") {
        return clubSprites.getSprite(...rankIndex)
    }
    if (suit === "d") {
        return diamondSprite.getSprite(...rankIndex)
    }
    if (suit === "h") {
        return heartSprite.getSprite(...rankIndex)
    }
    if (suit === "s") {
        return spadeSprite.getSprite(...rankIndex)
    }
    return null
}