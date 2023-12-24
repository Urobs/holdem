import { vec, Label, Font, FontUnit, Color, Engine } from "excalibur";

export class Text extends Label {
  constructor(text: string, x: number, y: number, font?: Font) {
    super({
      text: text,
      pos: vec(x, y),
      font: font || new Font({
        // family: 'impact',
        size: 20,
        color: Color.White,
        unit: FontUnit.Px,
      }),
    });
  }
  onInitialize(_engine: Engine): void {
      this.on("pointerup", () => {
        console.log('click')
      })
  }
}
