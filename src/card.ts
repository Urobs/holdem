import { Actor, vec } from "excalibur";
import { CARD_HEIGHT, CARD_WIDTH, Rank, Suit, getCardSprite } from "./sprites";

export class Card extends Actor {
  public rank: Rank;
  public suit: Suit;
  constructor(rank: Rank, suit: Suit, x: number, y: number) {
    super({
      pos: vec(x,  y),
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
