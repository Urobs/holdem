import { Scene } from "excalibur";
import { Card } from "./card";
import { gameState } from "./parser";
import { Rank, Suit } from "./sprites";

function isRank(value: string): value is Rank {
  return [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "T",
    "J",
    "Q",
    "K",
  ].includes(value);
}

function isSuit(value: string): value is Suit {
  return ["s", "h", "d", "c"].includes(value);
}

export class PlayScene extends Scene {
  public onActivate(): void {
    console.log(gameState);
    gameState.players.forEach((p, index1) => p.holeCards.map((hc, index2) => this.addCard(hc, index1, index2)), this)
    gameState.communityCards.forEach((card, index) => this.addCard(card, 0, index, 700), this)
  }



  public onDeactivate(): void {
    this.clear();
  }

  public addCard(mark: string, row: number, column: number, offset?: number): void {
    const [rank, suit] = mark.split("")
    if (isRank(rank) && isSuit(suit)) {
      this.add(new Card(rank, suit, row, column, offset));
    } else {
      console.error(`rank: ${rank}, suit: ${suit} is not legal`)
    }
  }
}

export class MainMenu extends Scene {}
