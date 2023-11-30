import { Engine, Loader, DisplayMode } from "excalibur";
import { Resources } from "./resources";
import logo from "./images/Top-Down/Chips/ChipsA_Flat-64x72.png"
import { PlayScene } from "./scene";

class Game extends Engine {
  constructor() {
    super({ width: 800, height: 600, displayMode: DisplayMode.FillScreen });
  }
  initialize() {
    this.addScene("playLevel", new PlayScene())
    this.startCustomLoader().then(() => {
      this.goToScene("playLevel")
    })
  }


  public startCustomLoader(): Promise<void> {
    const loader: Loader = new Loader([...Object.values(Resources.Cards)]);
    loader.playButtonText = "Start"
    loader.logo = logo
    loader.logoHeight = 144
    loader.logoWidth = 320
    return this.start(loader);
  }
}

export const game = new Game();
game.initialize();
