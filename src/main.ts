import { Engine, Loader, DisplayMode, PointerScope } from "excalibur";
import { Resources } from "./resources";
import logo from "./images/Top-Down/Chips/ChipsA_Flat-64x72.png";
import { PlayScene } from "./scene";
import { gameStates } from "./parser";

class Game extends Engine {
  constructor() {
    super({
      width: 800,
      height: 600,
      displayMode: DisplayMode.FillScreen
      /**
       * Specify our custom canvas element so Excalibur doesn't make one
       */,
      canvasElementId: "game",
      /**
       * Specify pointer scope to ensure that excalibur won't capture the mouse input
       * meant to be captured by HTML GUI
       */
      pointerScope: PointerScope.Canvas,
    });
  }
  initialize() {
    this.addScene("playLevel", new PlayScene(gameStates));
    this.startCustomLoader().then(() => {
      this.goToScene("playLevel");
    });
  }

  public startCustomLoader(): Promise<void> {
    const loader: Loader = new Loader([...Object.values(Resources.Cards)]);
    loader.playButtonText = "Start";
    loader.logo = logo;
    loader.logoHeight = 144;
    loader.logoWidth = 320;
    return this.start(loader);
  }
}

export const game = new Game();
game.initialize();
