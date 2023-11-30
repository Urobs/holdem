import { Actor, vec } from "excalibur";
import { CARD_HEIGHT, CARD_WIDTH, Rank, Suit, getCardSprite } from "./sprites";

const GAP = 150
const OFFSET = 400
export class Card extends Actor {
  public rank: Rank;
  public suit: Suit;
  constructor(rank: Rank, suit: Suit, row: number, column: number, offset=OFFSET) {
    super({
      pos: vec(offset+ column * GAP,  offset + row * GAP),
      width: CARD_WIDTH,
      height: CARD_HEIGHT
    });
    this.rank = rank
    this.suit = suit
  }

  onInitialize() {
    this.graphics.add(getCardSprite(this.rank, this.suit)!);
    this.graphics.current
  }
}
