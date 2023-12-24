import { Color, Font, FontUnit, Scene } from "excalibur";
import { Card } from "./card";
import { BettingRound, Player, GameState } from "./parser";
import { Rank, Suit } from "./sprites";
import { Text } from "./text";

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
const ui = document.getElementById("ui")!;
const EN2CN = {
  call: "跟注",
  raise: "加注",
  fold: "弃牌",
  river: "河牌",
  preflop: "预下注",
  turn: "转牌",
  flop: "翻牌",
};

export class PlayScene extends Scene {
  private round: number = 0;
  private gameStates: GameState[];
  private tick: number = 0;

  constructor(gs: GameState[]) {
    super();
    this.gameStates = gs;
  }

  get gameState(): GameState {
    return this.gameStates[this.tick];
  }

  public nextState(): void {
    if (this.tick < this.gameStates.length - 1) {
      this.tick++;
      this.round = 0;
      this.clear();
      this.getRound();
      this.setupRound();
    }
  }

  public lastState(): void {
    if (this.tick > 0) {
      this.tick--;
      this.round = 0;
      this.clear();
      this.getRound();
      this.setupRound();
    }
  }

  public nextRound(): void {
    if (this.round >= this.gameState.bettingRounds.length - 1) return;
    this.round++;
    this.clear();
    this.getRound();
    this.setupRound(this.gameState.bettingRounds.length - 1 === this.round);
  }

  public lastRound(): void {
    if (this.round <= 0) return;
    this.round--;
    this.clear();
    this.getRound();
    this.setupRound();
  }

  public onActivate(): void {
    this.setupRound();
    // Add a CSS class to `ui` that helps indicate which scene is being displayed
    ui.classList.add("MainMenu");

    // Create a <button /> element
    const btnNext = document.createElement("button");
    btnNext.textContent = "下一回合";

    // Style it outside JavaScript for ease of use
    btnNext.className = "button button--start";

    // Handle the DOM click event
    btnNext.onclick = (e) => {
      e.preventDefault();
      this.nextRound();
    };

    // Append the <button /> to our `ui` container
    ui.appendChild(btnNext);

    // Create a <button /> element
    const btnLast = document.createElement("button");
    btnLast.textContent = "上一回合";

    // Style it outside JavaScript for ease of use
    btnLast.className = "button button--last";

    // Handle the DOM click event
    btnLast.onclick = (e) => {
      e.preventDefault();
      this.lastRound();
    };

    // Append the <button /> to our `ui` container
    ui.appendChild(btnLast);

    // Create a <button /> element
    const btn = document.createElement("button");
    btn.textContent = "下一对局";

    // Style it outside JavaScript for ease of use
    btn.className = "button button--startb";

    // Handle the DOM click event
    btn.onclick = (e) => {
      e.preventDefault();
      this.nextState();
    };

    // Append the <button /> to our `ui` container
    ui.appendChild(btn);

    // Create a <button /> element
    const btn2 = document.createElement("button");
    btn2.textContent = "上一对局";

    // Style it outside JavaScript for ease of use
    btn2.className = "button button--lastb";

    // Handle the DOM click event
    btn2.onclick = (e) => {
      e.preventDefault();
      this.lastState();
    };

    // Append the <button /> to our `ui` container
    ui.appendChild(btn2);
  }

  public getRound(): BettingRound & {
    players: Player[];
    communityCards: string[];
  } {
    const round = this.gameState.bettingRounds[this.round];
    return {
      ...round,
      players: this.gameState.players,
      communityCards:
        this.round > 0
          ? this.gameState.communityCards.slice(
              0,
              round.stage == "flop" ? 2 : (round.stage === "turn" ? 3 : 4)
            )
          : [],
    };
  }

  public setupRound(showChange: boolean = false): void {
    const LEFT = 550;
    const TOP = 200;
    const round = this.getRound();
    round.players.forEach((p, index1) => {
      p.holeCards.map((hc, index2) =>
        this.addCard(hc, LEFT + index2 * 150, TOP + index1 * 450)
      );
      this.addText(`${p.name} 手牌：`, LEFT - 400, TOP + index1 * 450);
      showChange &&
        this.addText(
          `${p.name} 筹码变化：${p.stackChange}`,
          LEFT + 350,
          TOP + 60 + index1 * 450
        );
    }, this);
    round.communityCards.forEach(
      (card, index) => this.addCard(card, LEFT + index * 150, 425),
      this
    );
    this.addText("回合: " + EN2CN[round.stage], 100, 100);
    this.addText("对局: " + this.gameState.handId, 50, 50);
    round.actions
      .filter((act, index) => index % 2 === 0)
      .forEach((act, index) => {
        this.addText(
          `行动${index + 1}：${EN2CN[act.action]} ${act.amount ?? ""}`,
          LEFT - 400,
          TOP + 50 + 25 * index
        );
      });

    round.actions
      .filter((act, index) => index % 2 !== 0)
      .forEach((act, index) => {
        this.addText(
          `行动${index + 1}：${EN2CN[act.action]} ${act.amount ?? ""}`,
          LEFT - 400,
          TOP + 50 + 450 + 25 * index
        );
      });
  }

  public onDeactivate(): void {
    this.clear();
    ui.classList.remove("MainMenu");
    ui.innerHTML = "";
  }

  public addCard(mark: string, x: number, y: number): void {
    const [rank, suit] = mark.split("");
    if (isRank(rank) && isSuit(suit)) {
      this.add(new Card(rank, suit, x, y));
    } else {
      console.error(`rank: ${rank}, suit: ${suit} is not legal`);
    }
  }

  public addText(text: string, x: number, y: number): void {
    this.add(new Text(text, x, y));
  }
}

export class MainMenu extends Scene {}
