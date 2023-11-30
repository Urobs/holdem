import { Actor, vec } from "excalibur";
import { getCardSprite } from "./sprites";

export class Player extends Actor {
  constructor() {
    super({
      pos: vec(150, 150),
      width: 100,
      height: 100
    });
  }

  onInitialize() {
    this.graphics.add(getCardSprite("A", "c")!);
    this.on('pointerup', () => {
      alert('yo');
    });
  }
}
